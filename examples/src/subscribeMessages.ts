/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */

import 'dotenv/config';
import { SquadusClient, LastMessage } from '@squadus/botsdk';
import { consoleError, consoleLog } from './utils/colorConsole';
import { handleError } from './utils/handleError';

const { TOKEN, SERVER, PARTNER_NAME = '' } = process.env;
const squadusClient = new SquadusClient({
    token: TOKEN || '',
    server: SERVER || '',
});

const BY_SUBSCRIPTION_UNSUBSCRIBE_TIMEOUT = 40000;
const HI_SUBSCRIPTION_UNSUBSCRIBE_TIMEOUT = 20000;

(async (): Promise<void> => {
    try {
        await squadusClient.connect();
        const response = await squadusClient.room.createDirectRoom(
            PARTNER_NAME,
        );
        const roomId = response?.rid;
        if (!roomId) {
            consoleError('Room was not created', response);
            process.exit();
        }

        const hiHandler = (message: LastMessage) => {
            const { msg, u: user } = message;
            consoleLog(
                `Received new message from target room with ${PARTNER_NAME}`,
            );
            const regexp = new RegExp('hi', 'ig');
            if (regexp.test(msg)) {
                squadusClient.message.sendMessageByRid({
                    rid: roomId,
                    msg: `Hello, ${user.name}`,
                });
                consoleLog(
                    `Sent response on key word 'hi' in target room with ${PARTNER_NAME}`,
                );
            }
        };

        const byeHandler = (message: LastMessage) => {
            const { msg, rid, u: user } = message;
            consoleLog(`Received new message`);
            const regexp = new RegExp('bye', 'ig');
            if (regexp.test(msg)) {
                squadusClient.message.sendMessageByRid({
                    rid,
                    msg: `Bye, ${user.name}`,
                });
                consoleLog(`Sent response on key word 'Bye'`);
            }
        };

        const hiSubscription = await squadusClient.subscription.onMessage(
            hiHandler,
            roomId,
        );
        const byeSubscription = await squadusClient.subscription.onMessage(
            byeHandler,
        );

        setTimeout(() => {
            hiSubscription.unsubscribe();
            consoleLog(
                `Unsubscribe from messages in target room with ${PARTNER_NAME}`,
            );
        }, HI_SUBSCRIPTION_UNSUBSCRIBE_TIMEOUT);
        setTimeout(() => {
            byeSubscription.unsubscribe();
            consoleLog(`Unsubscribe from all new messages`);
            process.exit();
        }, BY_SUBSCRIPTION_UNSUBSCRIBE_TIMEOUT);
    } catch (error) {
        // look up the implementation of handleError()
        // to learn more about SquadusClient error handling
        handleError(error);
        process.exit();
    }
})();
