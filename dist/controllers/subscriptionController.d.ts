import { Subscription } from 'rxjs';
import { SquadusClient } from '../client';
import { LastMessage, Message } from '../lib/models';
import { WsData, WsSubscription, Collections, RoomEvent, UnsubscribeResponseData, OnMessagesResponse, OnRoomChangeResponse, OnReactionResponse, RoomsSubscriptions } from '../lib/types';
export declare class SubscriptionController {
    private squadusClient;
    messagesSubscription: WsSubscription | undefined;
    roomsSubscriptions: RoomsSubscriptions;
    subscriptionCounter: number;
    onMessageSubscriptions: {
        [key: string]: Subscription;
    };
    onAllMessagesSubscriptions: string[];
    onMessageReadRoomsMap: {
        [rid: string]: string[];
    };
    onMessageReadSubscription: Subscription | undefined;
    roomsRxSubscriptions: {
        [rid: string]: {
            [id: string]: Subscription;
        };
    };
    constructor(params: {
        squadusClient: SquadusClient;
    });
    private _readRoom;
    private _subscribeRoom;
    private _saveRoomSubscription;
    onMessage(cb: (msg: LastMessage) => void, rid?: string): Promise<OnMessagesResponse>;
    onRoomChange(rid: string, cb: (data: RoomEvent) => void): Promise<OnRoomChangeResponse>;
    onReaction(rid: string, msgId: string, cb: (message: Message) => void): Promise<OnReactionResponse>;
    onEvent(cb: (event: WsData) => void): Subscription;
    subscribe(collection: Collections, event: string): Promise<WsSubscription | undefined>;
    close(): Promise<void>;
    reopen(): Promise<void>;
    subscribeNotifyUser(): Promise<(WsSubscription | undefined)[]>;
    subscribeLoggedNotify(): Promise<(WsSubscription | undefined)[]>;
    subscribeNotifyAll(): Promise<(WsSubscription | undefined)[]>;
    logout(): Promise<void>;
    unsubscribe(id: string): Promise<UnsubscribeResponseData>;
}
