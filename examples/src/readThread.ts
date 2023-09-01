import 'dotenv/config';
import { SquadusClient } from '@squadus/botsdk';
import { consoleError, consoleLog } from './utils/colorConsole';
import { MESSAGE_TEXT, REPLY_TEXT } from './utils/constants';
import { handleError } from './utils/handleError';

const { TOKEN, SERVER, PARTNER_TOKEN, PARTNER_NAME = '' } = process.env;
const squadusClient = new SquadusClient({
    token: TOKEN || '',
    server: SERVER || '',
});

const partnerSquadusClient = new SquadusClient({
    token: PARTNER_TOKEN || '',
    server: SERVER || '',
});

(async (): Promise<void> => {
    try {
        await squadusClient.connect();
        const response = await squadusClient.room.createDirectRoom(
            PARTNER_NAME,
        );
        const roomId = response?.rid;
        if (!roomId) {
            consoleLog('Room was not created');
            process.exit();
        }
        consoleLog(`Room with id ${roomId} was created successfully`);
        const res = await squadusClient.message.sendMessageByRid({
            rid: roomId,
            msg: MESSAGE_TEXT,
        });
        if (!res) {
            consoleError('Message was not sent', res);
            process.exit();
        }
        consoleLog(
            `Message with text "${MESSAGE_TEXT}" was successfully sent to ${PARTNER_NAME}`,
        );
        const parentMessageId = res._id;
        const replyRes = await squadusClient.message.sendMessageToThread({
            msg: REPLY_TEXT,
            parentMessageId,
        });
        if (!replyRes) {
            consoleError('Message was not sent', replyRes);
            process.exit();
        }
        consoleLog(
            `Message with text "${REPLY_TEXT}" was successfully sent to THREAD`,
        );
        await partnerSquadusClient.connect();
        await partnerSquadusClient.room.readThread(parentMessageId);
        consoleLog(`User with name ${PARTNER_NAME} has read THREAD`);
        process.exit();
    } catch (error) {
        // look up the implementation of handleError()
        // to learn more about SquadusClient error handling
        handleError(error);
        process.exit();
    }
})();
