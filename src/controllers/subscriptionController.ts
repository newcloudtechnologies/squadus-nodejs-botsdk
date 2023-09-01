/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */

import isEqual from 'lodash/isEqual';
import {
    filter,
    distinctUntilChanged,
    Subscription,
    map,
    Observable,
} from 'rxjs';

import { SquadusClient } from '../client';
import { SDKErrors } from '../lib';
import { LastMessage, Message } from '../lib/models';
import {
    WsData,
    WsSubscription,
    RoomsChangedEvent,
    Collections,
    RoomMessageEvent,
    RoomEvent,
    UnsubscribeResponseData,
    OnMessagesResponse,
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
    private squadusClient: SquadusClient;
    messagesSubscription: WsSubscription | undefined;
    roomsSubscriptions = {} as RoomsSubscriptions;
    subscriptionCounter = 0;

    // onMessage
    onMessageSubscriptions = {} as { [key: string]: Subscription };
    onAllMessagesSubscriptions = [] as string[];
    onMessageReadRoomsMap = {} as { [rid: string]: string[] };
    onMessageReadSubscription: Subscription | undefined;

    // onRoomChange
    roomsRxSubscriptions = {} as {
        [rid: string]: { [id: string]: Subscription };
    };

    constructor(params: { squadusClient: SquadusClient }) {
        this.squadusClient = params.squadusClient;
    }

    private async _readRoom(rid: string): Promise<void> {
        if (
            this.onAllMessagesSubscriptions.length > 0 ||
            this.onMessageReadRoomsMap[rid]?.length > 0
        ) {
            try {
                await this.squadusClient.restClient.readRoom(rid);
            } catch (error) {
                console.error(error);
            }
        }
    }

    private async _subscribeRoom(rid: string): Promise<Observable<RoomEvent>> {
        if (!this.roomsSubscriptions[rid]) {
            const subscription =
                await this.squadusClient.wsClient.subscribeRoom(rid);
            if (subscription.includes(undefined)) {
                throw new SDKError(
                    SDKErrors.RoomSubscriptionError,
                    `Subscription to room "${rid}" was failed`,
                );
            }
            this.roomsSubscriptions[rid] = subscription;
        }

        const roomStream = this.squadusClient.wsClient.events$.pipe(
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

    async onMessage(
        cb: (msg: LastMessage) => void,
        rid?: string,
    ): Promise<OnMessagesResponse> {
        validateOnMessageParams({ cb, rid });
        const id = `rx-${++this.subscriptionCounter}`;
        const userId = this.squadusClient.wsClient.userId;
        if (!userId) {
            throw new RestClientError(
                // @ts-expect-error error should be typed
                `Wrong user id, you should be logged in`,
                {},
            );
        }

        const newLastMessageStream = this.squadusClient.wsClient.events$.pipe(
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

        if (!this.messagesSubscription) {
            this.messagesSubscription = await this.subscribe(
                Collections.StreamNotifyUser,
                `${userId}/rooms-changed`,
            );
            this.onMessageReadSubscription = newLastMessageStream.subscribe(
                async (lastMessage: LastMessage) => {
                    const rid = lastMessage.rid;
                    this._readRoom(rid);
                },
            );
        }

        if (rid) {
            if (!Array.isArray(this.onMessageReadRoomsMap[rid])) {
                this.onMessageReadRoomsMap[rid] = [];
            }
            this.onMessageReadRoomsMap[rid].push(id);
        } else {
            this.onAllMessagesSubscriptions.push(id);
        }

        this.onMessageSubscriptions[id] = newLastMessageStream
            .pipe(
                filter((lastMessage: LastMessage) => {
                    return rid ? lastMessage.rid === rid : true;
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

                    return isEqual(previousReactions, currentReactions);
                }),
            )
            .subscribe(cb);

        const unsubscribe = this._saveRoomSubscription(subscription, rid);
        return { unsubscribe };
    }

    onEvent(cb: (event: WsData) => void): Subscription {
        validateOnEventParams(cb);
        return this.squadusClient.wsClient.events$.subscribe(cb);
    }

    async subscribe(
        collection: Collections,
        event: string,
    ): Promise<WsSubscription | undefined> {
        validateSubscribeParams({ collection, event });
        return this.squadusClient.wsClient.subscribe(collection, [
            event,
            { useCollection: false, args: [false] },
        ]);
    }

    async close(): Promise<void> {
        this.squadusClient.wsClient.close();
    }

    async reopen(): Promise<void> {
        await this.squadusClient.wsClient.reopen();
    }

    async subscribeNotifyUser(): Promise<(WsSubscription | undefined)[]> {
        return this.squadusClient.wsClient.subscribeNotifyUser();
    }

    async subscribeLoggedNotify(): Promise<(WsSubscription | undefined)[]> {
        return this.squadusClient.wsClient.subscribeLoggedNotify();
    }

    async subscribeNotifyAll(): Promise<(WsSubscription | undefined)[]> {
        return this.squadusClient.wsClient.subscribeLoggedNotify();
    }

    async logout(): Promise<void> {
        return this.squadusClient.wsClient.logout();
    }

    async unsubscribe(id: string): Promise<UnsubscribeResponseData> {
        validateUnsubscribeParams(id);
        return this.squadusClient.wsClient.unsubscribe(id);
    }
}
