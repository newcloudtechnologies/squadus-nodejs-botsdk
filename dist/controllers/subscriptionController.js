"use strict";
/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionController = void 0;
const isEqual_1 = __importDefault(require("lodash/isEqual"));
const rxjs_1 = require("rxjs");
const lib_1 = require("../lib");
const types_1 = require("../lib/types");
const utils_1 = require("../utils");
const SDKError_1 = require("../lib/SDKError");
class SubscriptionController {
    constructor(params) {
        this.roomsSubscriptions = {};
        this.subscriptionCounter = 0;
        // onMessage
        this.onMessageSubscriptions = {};
        this.onAllMessagesSubscriptions = [];
        this.onMessageReadRoomsMap = {};
        // onRoomChange
        this.roomsRxSubscriptions = {};
        this.squadusClient = params.squadusClient;
    }
    async _readRoom(rid) {
        if (this.onAllMessagesSubscriptions.length > 0 ||
            this.onMessageReadRoomsMap[rid]?.length > 0) {
            try {
                await this.squadusClient.restClient.readRoom(rid);
            }
            catch (error) {
                console.error(error);
            }
        }
    }
    async _subscribeRoom(rid) {
        if (!this.roomsSubscriptions[rid]) {
            const subscription = await this.squadusClient.wsClient.subscribeRoom(rid);
            if (subscription.includes(undefined)) {
                throw new SDKError_1.SDKError(lib_1.SDKErrors.RoomSubscriptionError, `Subscription to room "${rid}" was failed`);
            }
            this.roomsSubscriptions[rid] = subscription;
        }
        const roomStream = this.squadusClient.wsClient.events$.pipe((0, rxjs_1.filter)(utils_1.roomEventsFilter), (0, rxjs_1.filter)((data) => (0, utils_1.ridFilter)(rid, data)));
        return roomStream;
    }
    _saveRoomSubscription(subscription, rid) {
        const id = `rx-${++this.subscriptionCounter}`;
        if (!this.roomsRxSubscriptions[rid]) {
            this.roomsRxSubscriptions[rid] = {};
        }
        this.roomsRxSubscriptions[rid][id] = subscription;
        const unsubscribe = async () => {
            this.roomsRxSubscriptions[rid][id].unsubscribe();
            delete this.roomsRxSubscriptions[rid][id];
            const roomSubscriptions = Object.values(this.roomsRxSubscriptions[rid]);
            if (roomSubscriptions.length === 0) {
                await Promise.all(this.roomsSubscriptions[rid].map(async (subscription) => subscription?.unsubscribe()));
                delete this.roomsSubscriptions[rid];
            }
        };
        return unsubscribe;
    }
    async onMessage(cb, rid) {
        (0, utils_1.validateOnMessageParams)({ cb, rid });
        const id = `rx-${++this.subscriptionCounter}`;
        const userId = this.squadusClient.wsClient.userId;
        if (!userId) {
            throw new types_1.RestClientError(
            // @ts-expect-error error should be typed
            `Wrong user id, you should be logged in`, {});
        }
        const newLastMessageStream = this.squadusClient.wsClient.events$.pipe((0, rxjs_1.filter)((data) => (0, utils_1.newLastMessageFilter)(userId, data)), (0, rxjs_1.map)((data) => data.fields.args[1].lastMessage), (0, rxjs_1.distinctUntilChanged)((previous, current) => {
            return previous._id === current._id;
        }));
        if (!this.messagesSubscription) {
            this.messagesSubscription = await this.subscribe(types_1.Collections.StreamNotifyUser, `${userId}/rooms-changed`);
            this.onMessageReadSubscription = newLastMessageStream.subscribe(async (lastMessage) => {
                const rid = lastMessage.rid;
                this._readRoom(rid);
            });
        }
        if (rid) {
            if (!Array.isArray(this.onMessageReadRoomsMap[rid])) {
                this.onMessageReadRoomsMap[rid] = [];
            }
            this.onMessageReadRoomsMap[rid].push(id);
        }
        else {
            this.onAllMessagesSubscriptions.push(id);
        }
        this.onMessageSubscriptions[id] = newLastMessageStream
            .pipe((0, rxjs_1.filter)((lastMessage) => {
            return rid ? lastMessage.rid === rid : true;
        }))
            .subscribe(cb);
        const unsubscribe = async () => {
            this.onMessageSubscriptions[id].unsubscribe();
            delete this.onMessageSubscriptions[id];
            if (rid) {
                this.onMessageReadRoomsMap[rid] = this.onMessageReadRoomsMap[rid].filter((_id) => _id !== id);
            }
            else {
                this.onAllMessagesSubscriptions =
                    this.onAllMessagesSubscriptions.filter((_id) => _id !== id);
            }
            if (this.onAllMessagesSubscriptions.length === 0 &&
                Object.values(this.onMessageSubscriptions).length === 0) {
                this.onMessageReadSubscription?.unsubscribe();
                delete this.onMessageReadSubscription;
                await this.messagesSubscription?.unsubscribe();
                delete this.messagesSubscription;
            }
        };
        return { unsubscribe };
    }
    async onRoomChange(rid, cb) {
        (0, utils_1.validateOnRoomChangeParams)({ cb, rid });
        const roomStream = await this._subscribeRoom(rid);
        const subscription = roomStream.subscribe(cb);
        const unsubscribe = this._saveRoomSubscription(subscription, rid);
        return { unsubscribe };
    }
    async onReaction(rid, msgId, cb) {
        (0, utils_1.validateOnReactionParams)({ cb, rid, msgId });
        const roomStream = await this._subscribeRoom(rid);
        const subscription = roomStream
            .pipe((0, rxjs_1.filter)(utils_1.messageEventFilter), (0, rxjs_1.filter)((data) => (0, utils_1.msgIdFilter)(msgId, data)), (0, rxjs_1.map)((data) => data.fields.args[0]), (0, rxjs_1.distinctUntilChanged)((previous, current) => {
            const { reactions: previousReactions = {} } = previous;
            const { reactions: currentReactions = {} } = current;
            return (0, isEqual_1.default)(previousReactions, currentReactions);
        }))
            .subscribe(cb);
        const unsubscribe = this._saveRoomSubscription(subscription, rid);
        return { unsubscribe };
    }
    onEvent(cb) {
        (0, utils_1.validateOnEventParams)(cb);
        return this.squadusClient.wsClient.events$.subscribe(cb);
    }
    async subscribe(collection, event) {
        (0, utils_1.validateSubscribeParams)({ collection, event });
        return this.squadusClient.wsClient.subscribe(collection, [
            event,
            { useCollection: false, args: [false] },
        ]);
    }
    async close() {
        this.squadusClient.wsClient.close();
    }
    async reopen() {
        await this.squadusClient.wsClient.reopen();
    }
    async subscribeNotifyUser() {
        return this.squadusClient.wsClient.subscribeNotifyUser();
    }
    async subscribeLoggedNotify() {
        return this.squadusClient.wsClient.subscribeLoggedNotify();
    }
    async subscribeNotifyAll() {
        return this.squadusClient.wsClient.subscribeLoggedNotify();
    }
    async logout() {
        return this.squadusClient.wsClient.logout();
    }
    async unsubscribe(id) {
        (0, utils_1.validateUnsubscribeParams)(id);
        return this.squadusClient.wsClient.unsubscribe(id);
    }
}
exports.SubscriptionController = SubscriptionController;
//# sourceMappingURL=subscriptionController.js.map