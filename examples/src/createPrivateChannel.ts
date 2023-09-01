import {
    CreatePrivateChannelResponseData,
    CreatePublicChannelResponseData,
    SquadusClient,
} from '@squadus/botsdk';
import 'dotenv/config';
import { consoleError, consoleLog } from './utils/colorConsole';
import { NEW_PRIVATE_CHANNEL_NAME } from './utils/constants';
import { handleError } from './utils/handleError';

const { TOKEN, SERVER } = process.env;
const squadusClient = new SquadusClient({
    token: TOKEN || '',
    server: SERVER || '',
});

(async (): Promise<void> => {
    try {
        await squadusClient.connect();
        const response = await squadusClient.room.createChannel({
            name: NEW_PRIVATE_CHANNEL_NAME,
            members: [],
            isPrivate: true,
            readOnly: false,
            encrypted: false,
        });
        const roomId =
            (response?.data as CreatePrivateChannelResponseData)?.group?._id ??
            (response?.data as CreatePublicChannelResponseData)?.channel?._id;

        if (!roomId) {
            consoleError('Room was not created', response?.data);
            process.exit();
        }
        consoleLog(`Room with id ${roomId} was created successfully`);
        process.exit();
    } catch (error) {
        // look up the implementation of handleError()
        // to learn more about SquadusClient error handling
        handleError(error);
        process.exit();
    }
})();
