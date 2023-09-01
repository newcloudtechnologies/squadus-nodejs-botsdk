import { SquadusClient } from '@squadus/botsdk';
import 'dotenv/config';
import { consoleError, consoleLog } from './utils/colorConsole';
import { MESSAGE_TEXT } from './utils/constants';
import { handleError } from './utils/handleError';

const { TOKEN, SERVER, PARTNER_NAME = '' } = process.env;
const squadusClient = new SquadusClient({
    token: TOKEN || '',
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
        consoleLog('MESSAGE _ID:', res._id);
        process.exit();
    } catch (error) {
        // look up the implementation of handleError()
        // to learn more about SquadusClient error handling
        handleError(error);
        process.exit();
    }
})();
