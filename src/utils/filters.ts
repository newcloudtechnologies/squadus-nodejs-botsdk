/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2026
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */

import { isRoomsChangedEvent } from '@squadus/core/dist/wsClient/utils';

import {
    WsData,
    RoomsChangedEvent,
    RoomEvent,
    Collections,
    RoomMessageEvent,
} from '../lib/types';

export function newLastMessageFilter(
    userId: string,
    data: WsData,
): data is RoomsChangedEvent {
    if (isRoomsChangedEvent(data)) {
        const msg = data.fields.args[1]?.lastMessage;
        const isNewLastMessage = msg?.u?._id !== userId && msg?.unread;
        return Boolean(isNewLastMessage);
    }
    return false;
}

export const roomEventsFilter = (data: WsData): data is RoomEvent => {
    if ('collection' in data) {
        const { collection } = data;
        return (
            collection === Collections.StreamRoomMessages ||
            collection === Collections.StreamNotifyRoom
        );
    }
    return false;
};

export const ridFilter = (rid: string, data: RoomEvent): boolean => {
    const eventName = data.fields.eventName;
    return eventName.includes(rid);
};

export const messageEventFilter = (
    data: RoomEvent,
): data is RoomMessageEvent => {
    return data.collection === Collections.StreamRoomMessages;
};

export const msgIdFilter = (msgId: string, data: RoomMessageEvent): boolean => {
    const message = data.fields.args[0];
    return msgId === message._id;
};
