/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */

import 'dotenv/config';
import {
    SquadusClient,
    RoomEvent,
    RoomEventNames,
    RoomTypingEvent,
} from '@squadus/botsdk';
import { consoleError, consoleLog } from './utils/colorConsole';
import { handleError } from './utils/handleError';

const { TOKEN, SERVER, PARTNER_NAME = '' } = process.env;
const squadusClient = new SquadusClient({
    token: TOKEN || '',
    server: SERVER || '',
});

(async (): Promise<void> => {
    try {
        const typingState = {} as { [name: string]: boolean };
        await squadusClient.connect();
        const response = await squadusClient.room.createDirectRoom(
            PARTNER_NAME,
        );
        const roomId = response?.rid;

        if (!roomId) {
            consoleError('Room was not created', response);
            process.exit();
        }

        await squadusClient.subscription.onRoomChange(
            roomId,
            (data: RoomEvent) => {
                if (
                    data.fields.eventName ===
                    `${roomId}/${RoomEventNames.Typing}`
                ) {
                    const typingData = data as RoomTypingEvent;
                    const [user, isTyping] = typingData.fields.args;
                    if (typingState[user] !== isTyping) {
                        typingState[user] = isTyping;
                        const message = isTyping
                            ? ' is typing'
                            : ' has stopped typing';
                        consoleLog(user + message);
                    }
                }
            },
        );
    } catch (error) {
        // look up the implementation of handleError()
        // to learn more about SquadusClient error handling
        handleError(error);
        process.exit();
    }
})();
