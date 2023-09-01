import { SquadusClient } from '@squadus/botsdk';
import 'dotenv/config';
import * as path from 'path';
import { consoleError, consoleLog } from './utils/colorConsole';
import { handleError } from './utils/handleError';

const {
    TOKEN,
    SERVER,
    PARTNER_NAME = '',
    ALLOWED_ATTACHMENT_PATH,
} = process.env;
const squadusClient = new SquadusClient({
    token: TOKEN || '',
    server: SERVER || '',
    allowedAttachmentsPath: ALLOWED_ATTACHMENT_PATH || '',
});

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
        consoleLog(`Room with id ${roomId} was created successfully`);

        const res = await squadusClient.message.sendAttachment({
            rid: roomId,
            msg: 'Image with logo',
            path: path.resolve(__dirname, 'example.png'),
        });
        if (!res) {
            consoleError('Message was not sent', res);
            process.exit();
        }
        consoleLog(
            `Message with attachment was successfully sent to room ${roomId}`,
        );
        process.exit();
    } catch (error) {
        // look up the implementation of handleError()
        // to learn more about SquadusClient error handling
        handleError(error);
        process.exit();
    }
})();
