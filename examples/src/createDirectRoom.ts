import { SquadusClient } from '@squadus/botsdk';
import 'dotenv/config';
import { consoleError, consoleLog } from './utils/colorConsole';
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
            consoleError('Room was not created', response);
            process.exit();
        }
        consoleLog(
            `Direct dialog with ${PARTNER_NAME} was created successfully`,
        );
        process.exit();
    } catch (error) {
        // look up the implementation of handleError()
        // to learn more about SquadusClient error handling
        handleError(error);
        process.exit();
    }
})();
