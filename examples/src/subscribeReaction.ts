/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */

import 'dotenv/config';
import { SquadusClient, LastMessage, Message } from '@squadus/botsdk';
import { consoleLog } from './utils/colorConsole';
import { handleError } from './utils/handleError';

const { TOKEN, SERVER } = process.env;
const squadusClient = new SquadusClient({
    token: TOKEN || '',
    server: SERVER || '',
});

const CLAP_MARK = ':clap:';
const GRIPPING_MARK = ':grinning:';

const msgHandler = async (message: LastMessage) => {
    consoleLog('New message received');
    const { msg, rid, u } = message;
    const { username = '' } = u;
    const regexp = new RegExp('start', 'ig');
    const botMessage = `React to the message via ${CLAP_MARK} to receive an image. Image won't be sent if reaction is ${GRIPPING_MARK}.`;
    if (!regexp.test(msg)) {
        return;
    }
    try {
        const response = await squadusClient.message.sendMessageByRid({
            rid,
            msg: botMessage,
        });
        consoleLog(`Sent response on ${username} message`);
        const msgId = response._id;

        const subscription = await squadusClient.subscription.onReaction(
            rid,
            msgId,
            async (message: Message) => {
                const { reactions } = message;
                if (!reactions) return;
                consoleLog(`New reaction received`);
                consoleLog(`List of reactions: ${JSON.stringify(reactions)}`);
                let msg = '';
                if (reactions[CLAP_MARK]?.usernames.includes(username)) {
                    msg = ':sunrise_over_mountains:';
                } else if (
                    reactions[GRIPPING_MARK]?.usernames.includes(username)
                ) {
                    msg = 'Do not want an image?.. Catch a ball! \n:soccer:';
                }

                if (msg) {
                    await squadusClient.message.sendMessageByRid({ rid, msg });
                    consoleLog('Message on target reaction was sent');
                    await subscription.unsubscribe();
                    consoleLog('Stopped listening to reactions');
                }
            },
        );
    } catch (error) {
        handleError(error);
    }
};

(async (): Promise<void> => {
    try {
        await squadusClient.connect();
        squadusClient.subscription.onMessage(msgHandler);
    } catch (error) {
        // look up the implementation of handleError()
        // to learn more about SquadusClient error handling
        handleError(error);
        process.exit();
    }
})();
