/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2026
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */

import {
    catchError,
    concatMap,
    debounceTime,
    distinctUntilChanged,
    EMPTY,
    filter,
    from,
    map,
    merge,
    Observable,
    Subscription,
} from 'rxjs';

import { MySquadusClient } from '../client';
import { SDKErrors } from '../lib';
import { LastMessage, Message } from '../lib/models';
import {
    WsData,
    WsSubscription,
    RoomsChangedEvent,
    CommonSubscriptionData,
    Collections,
    RoomMessageEvent,
    RoomEvent,
    UnsubscribeResponseData,
    OnMessagesResponse,
    OnMessageOptions,
    OnRoomChangeResponse,
    OnReactionResponse,
    RoomsSubscriptions,
    RestClientError,
} from '../lib/types';
import {
    messageEventFilter,
    msgIdFilter,
    newLastMessageFilter,
    ridFilter,
    roomEventsFilter,
    validateOnEventParams,
    validateOnMessageParams,
    validateOnReactionParams,
    validateOnRoomChangeParams,
    validateSubscribeParams,
    validateUnsubscribeParams,
} from '../utils';
import { SDKError } from '../lib/SDKError';

export class SubscriptionController {
    private mySquadusClient: MySquadusClient;
    messagesSubscription: WsSubscription | undefined;
    roomsSubscriptions = {} as RoomsSubscriptions;
    subscriptionCounter = 0;

    // onMessage
    onMessageSubscriptions = {} as { [key: string]: Subscription };
    onAllMessagesSubscriptions = [] as string[];
    onMessageReadRoomsMap = {} as { [rid: string]: string[] };
    onMessageReadSubscription: Subscription | undefined;

    private autoResubscribeSub: Subscription | undefined;
    private threadRoomSubs = {} as { [rid: string]: WsSubscription };
    private _threadSubscriptionsActive = false;

    // onRoomChange
    roomsRxSubscriptions = {} as {
        [rid: string]: { [id: string]: Subscription };
    };

    constructor(params: { mySquadusClient: MySquadusClient }) {
        this.mySquadusClient = params.mySquadusClient;
    }

    private async _readRoom(rid: string): Promise<void> {
        if (
            this.onAllMessagesSubscriptions.length > 0 ||
            this.onMessageReadRoomsMap[rid]?.length > 0
        ) {
            try {
                await this.mySquadusClient.restClient.readRoom(rid);
            } catch (error) {
                console.error(error);
            }
        }
    }

    private async _subscribeRoom(rid: string): Promise<Observable<RoomEvent>> {
        if (!this.roomsSubscriptions[rid]) {
            const subscription =
                await this.mySquadusClient.wsClient.subscribeRoom(rid);
            if (subscription.includes(undefined)) {
                throw new SDKError(
                    SDKErrors.RoomSubscriptionError,
                    `Subscription to room "${rid}" was failed`,
                );
            }
            this.roomsSubscriptions[rid] = subscription;
        }

        const roomStream = this.mySquadusClient.wsClient.events$.pipe(
            filter(roomEventsFilter),
            filter((data: RoomEvent) => ridFilter(rid, data)),
        );

        return roomStream;
    }

    private _saveRoomSubscription(
        subscription: Subscription,
        rid: string,
    ): () => Promise<void> {
        const id = `rx-${++this.subscriptionCounter}`;
        if (!this.roomsRxSubscriptions[rid]) {
            this.roomsRxSubscriptions[rid] = {};
        }
        this.roomsRxSubscriptions[rid][id] = subscription;

        const unsubscribe = async (): Promise<void> => {
            this.roomsRxSubscriptions[rid][id].unsubscribe();
            delete this.roomsRxSubscriptions[rid][id];
            const roomSubscriptions = Object.values(
                this.roomsRxSubscriptions[rid],
            );
            if (roomSubscriptions.length === 0) {
                await Promise.all(
                    this.roomsSubscriptions[rid].map(async (subscription) =>
                        subscription?.unsubscribe(),
                    ),
                );
                delete this.roomsSubscriptions[rid];
            }
        };

        return unsubscribe;
    }

    private _isNewSubscriptionEvent(
        data: WsData,
    ): data is CommonSubscriptionData {
        if (
            roomEventsFilter(data) ||
            !('collection' in data) ||
            !('fields' in data)
        ) {
            return false;
        }
        const { fields } = data;
        if (!('eventName' in fields) || !('args' in fields)) {
            return false;
        }
        return (
            data.collection === Collections.StreamNotifyUser &&
            fields.eventName.includes('subscriptions-changed') &&
            Array.isArray(fields.args) &&
            fields.args[0] === 'inserted'
        );
    }

    private _getNewSubscriptionRid(
        data: CommonSubscriptionData,
    ): string | undefined {
        const args = data.fields.args;
        if (Array.isArray(args) && args.length > 1) {
            const subData = args[1];
            if (
                subData &&
                typeof subData === 'object' &&
                'rid' in subData &&
                typeof subData.rid === 'string'
            ) {
                return subData.rid;
            }
        }
        return undefined;
    }

    private _isThreadMessageEvent(
        userId: string,
        data: WsData,
    ): data is RoomMessageEvent {
        if (!roomEventsFilter(data) || !messageEventFilter(data)) {
            return false;
        }
        const msg = data.fields.args[0];
        return !!msg.tmid && msg.u?._id !== userId;
    }

    private _messageToLastMessage(msg: Message): LastMessage {
        return {
            _id: msg._id,
            _updatedAt: msg._updatedAt as unknown as Date,
            attachments: msg.attachments ?? [],
            channels: msg.channels ?? [],
            e2e: msg.e2e as LastMessage['e2e'],
            file: msg.file,
            md: msg.md,
            mentions: msg.mentions ?? [],
            msg: msg.msg,
            reactions: msg.reactions as LastMessage['reactions'],
            rid: msg.rid,
            status: Boolean(msg.status),
            t: msg.t as LastMessage['t'],
            tmid: msg.tmid ?? '',
            ts: msg.ts as unknown as Date,
            tshow: msg.tshow ?? false,
            u: msg.u,
            unread: msg.unread ?? true,
            urls: (msg.urls ?? []) as unknown as string[],
        };
    }

    private async _subscribeRoomMessages(rid: string): Promise<void> {
        if (this.threadRoomSubs[rid]) {
            return;
        }
        try {
            const sub = await this.subscribe(
                Collections.StreamRoomMessages,
                rid,
            );
            if (sub) {
                this.threadRoomSubs[rid] = sub;
            }
        } catch (error) {
            console.error(
                `[SquadusBotSDK] subscribe to room messages failed for ${rid}:`,
                error,
            );
        }
    }

    private async _subscribeAllRoomMessages(): Promise<void> {
        try {
            const response =
                await this.mySquadusClient.restClient.getSubscriptions();
            const rooms = response?.data?.update ?? [];
            await Promise.all(
                rooms.map(async (room) =>
                    this._subscribeRoomMessages(room.rid),
                ),
            );
        } catch (error) {
            console.error(
                '[SquadusBotSDK] failed to get subscriptions for thread support:',
                error,
            );
        }
    }

    private async _unsubscribeAllRoomMessages(): Promise<void> {
        await Promise.allSettled(
            Object.values(this.threadRoomSubs).map(async (sub) =>
                sub.unsubscribe(),
            ),
        );
        this.threadRoomSubs = {};
    }

    private async _resubscribeToRoomsChanged(userId: string): Promise<void> {
        await this.messagesSubscription?.unsubscribe();
        this.messagesSubscription = await this.subscribe(
            Collections.StreamNotifyUser,
            `${userId}/rooms-changed`,
        );
    }

    private async _setupAutoResubscribe(userId: string): Promise<void> {
        await this.subscribe(
            Collections.StreamNotifyUser,
            `${userId}/subscriptions-changed`,
        );

        this.autoResubscribeSub = this.mySquadusClient.wsClient.events$
            .pipe(
                filter((data: WsData): data is CommonSubscriptionData =>
                    this._isNewSubscriptionEvent(data),
                ),
                debounceTime(500),
                concatMap((data: CommonSubscriptionData) =>
                    from(
                        (async () => {
                            await this._resubscribeToRoomsChanged(userId);
                            if (this._threadSubscriptionsActive) {
                                const newRid =
                                    this._getNewSubscriptionRid(data);
                                if (newRid) {
                                    await this._subscribeRoomMessages(newRid);
                                }
                            }
                        })(),
                    ).pipe(
                        catchError((error) => {
                            console.error(
                                '[SquadusBotSDK] auto-resubscribe failed:',
                                error,
                            );
                            return EMPTY;
                        }),
                    ),
                ),
            )
            .subscribe();
    }

    async onMessage(
        cb: (msg: LastMessage) => void,
        rid?: string,
        options?: OnMessageOptions,
    ): Promise<OnMessagesResponse> {
        validateOnMessageParams({ cb, rid, options });
        const id = `rx-${++this.subscriptionCounter}`;
        const userId = this.mySquadusClient.wsClient.userId;
        const includeThreadMessages = options?.includeThreadMessages ?? false;
        if (!userId) {
            throw new RestClientError(
                `Wrong user id, you should be logged in`,
                {},
            );
        }

        const newLastMessageStream = this.mySquadusClient.wsClient.events$.pipe(
            filter((data: WsData): data is RoomsChangedEvent =>
                newLastMessageFilter(userId, data),
            ),
            map(
                (data: RoomsChangedEvent): LastMessage =>
                    data.fields.args[1].lastMessage,
            ),
            distinctUntilChanged((previous, current) => {
                return previous._id === current._id;
            }),
        );

        const threadMessageStream = this.mySquadusClient.wsClient.events$.pipe(
            filter((data: WsData): data is RoomMessageEvent =>
                this._isThreadMessageEvent(userId, data),
            ),
            map(
                (data: RoomMessageEvent): LastMessage =>
                    this._messageToLastMessage(data.fields.args[0]),
            ),
            distinctUntilChanged((previous, current) => {
                return previous._id === current._id;
            }),
        );

        const allMessagesStream = merge(
            newLastMessageStream,
            threadMessageStream,
        ).pipe(
            distinctUntilChanged((previous, current) => {
                return previous._id === current._id;
            }),
        );

        if (!this.messagesSubscription) {
            this.messagesSubscription = await this.subscribe(
                Collections.StreamNotifyUser,
                `${userId}/rooms-changed`,
            );
            this.onMessageReadSubscription = allMessagesStream.subscribe(
                async (lastMessage: LastMessage) => {
                    const rid = lastMessage.rid;
                    this._readRoom(rid);
                },
            );
            await this._setupAutoResubscribe(userId);
        }

        if (includeThreadMessages) {
            if (rid) {
                await this._subscribeRoomMessages(rid);
            } else if (!this._threadSubscriptionsActive) {
                await this._subscribeAllRoomMessages();
                this._threadSubscriptionsActive = true;
            }
        }

        if (rid) {
            if (!Array.isArray(this.onMessageReadRoomsMap[rid])) {
                this.onMessageReadRoomsMap[rid] = [];
            }
            this.onMessageReadRoomsMap[rid].push(id);
        } else {
            this.onAllMessagesSubscriptions.push(id);
        }

        this.onMessageSubscriptions[id] = allMessagesStream
            .pipe(
                filter((lastMessage: LastMessage) => {
                    if (rid && lastMessage.rid !== rid) return false;
                    if (!includeThreadMessages && lastMessage.tmid)
                        return false;
                    return true;
                }),
            )
            .subscribe(cb);

        const unsubscribe = async (): Promise<void> => {
            this.onMessageSubscriptions[id].unsubscribe();
            delete this.onMessageSubscriptions[id];
            if (rid) {
                this.onMessageReadRoomsMap[rid] = this.onMessageReadRoomsMap[
                    rid
                ].filter((_id) => _id !== id);
            } else {
                this.onAllMessagesSubscriptions =
                    this.onAllMessagesSubscriptions.filter((_id) => _id !== id);
            }
            if (
                this.onAllMessagesSubscriptions.length === 0 &&
                Object.values(this.onMessageSubscriptions).length === 0
            ) {
                this.onMessageReadSubscription?.unsubscribe();
                delete this.onMessageReadSubscription;
                this.autoResubscribeSub?.unsubscribe();
                this.autoResubscribeSub = undefined;
                await this._unsubscribeAllRoomMessages();
                this._threadSubscriptionsActive = false;
                await this.messagesSubscription?.unsubscribe();
                delete this.messagesSubscription;
            }
        };

        return { unsubscribe };
    }

    async onRoomChange(
        rid: string,
        cb: (data: RoomEvent) => void,
    ): Promise<OnRoomChangeResponse> {
        validateOnRoomChangeParams({ cb, rid });
        const roomStream = await this._subscribeRoom(rid);
        const subscription = roomStream.subscribe(cb) as Subscription;

        const unsubscribe = this._saveRoomSubscription(subscription, rid);
        return { unsubscribe };
    }

    async onReaction(
        rid: string,
        msgId: string,
        cb: (message: Message) => void,
    ): Promise<OnReactionResponse> {
        validateOnReactionParams({ cb, rid, msgId });
        const roomStream = await this._subscribeRoom(rid);
        const subscription = roomStream
            .pipe(
                filter(messageEventFilter),
                filter((data: RoomMessageEvent) => msgIdFilter(msgId, data)),
                map((data: RoomMessageEvent) => data.fields.args[0]),
                distinctUntilChanged((previous: Message, current: Message) => {
                    const { reactions: previousReactions = {} } = previous;
                    const { reactions: currentReactions = {} } = current;

                    return (
                        JSON.stringify(previousReactions) ===
                        JSON.stringify(currentReactions)
                    );
                }),
            )
            .subscribe(cb);

        const unsubscribe = this._saveRoomSubscription(subscription, rid);
        return { unsubscribe };
    }

    onEvent(cb: (event: WsData) => void): Subscription {
        validateOnEventParams(cb);
        return this.mySquadusClient.wsClient.events$.subscribe(cb);
    }

    async subscribe(
        collection: Collections,
        event: string,
    ): Promise<WsSubscription | undefined> {
        validateSubscribeParams({ collection, event });
        return this.mySquadusClient.wsClient.subscribe(collection, [
            event,
            { useCollection: false, args: [false] },
        ]);
    }

    async close(): Promise<void> {
        this.mySquadusClient.wsClient.close();
    }

    async reopen(): Promise<void> {
        await this.mySquadusClient.wsClient.close();
        await this.mySquadusClient.connect();
    }

    async subscribeNotifyUser(): Promise<(WsSubscription | undefined)[]> {
        return this.mySquadusClient.wsClient.subscribeNotifyUser();
    }

    async subscribeLoggedNotify(): Promise<(WsSubscription | undefined)[]> {
        return this.mySquadusClient.wsClient.subscribeLoggedNotify();
    }

    async subscribeNotifyAll(): Promise<(WsSubscription | undefined)[]> {
        return this.mySquadusClient.wsClient.subscribeLoggedNotify();
    }

    async logout(): Promise<void> {
        return this.mySquadusClient.wsClient.logout();
    }

    async unsubscribe(id: string): Promise<UnsubscribeResponseData> {
        validateUnsubscribeParams(id);
        return this.mySquadusClient.wsClient.unsubscribe(id);
    }
}
