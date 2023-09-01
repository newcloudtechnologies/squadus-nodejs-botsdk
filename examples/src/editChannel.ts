import {
    CreatePrivateChannelResponseData,
    CreatePublicChannelResponseData,
    SquadusClient,
} from '@squadus/botsdk';
import 'dotenv/config';
import { consoleError, consoleLog } from './utils/colorConsole';
import {
    NEW_PUBLIC_CHANNEL_NAME,
    TARGET_CHANNEL_NAME,
} from './utils/constants';
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
            name: TARGET_CHANNEL_NAME,
        });
        const rid =
            (response?.data as CreatePrivateChannelResponseData)?.group?._id ??
            (response?.data as CreatePublicChannelResponseData)?.channel?._id;
        if (!rid) {
            consoleError('Room was not created', response?.data);
            process.exit();
        }
        await squadusClient.room.saveRoomSettings({
            rid: rid,
            roomName: NEW_PUBLIC_CHANNEL_NAME,
        });
        consoleLog(
            `Name of the room with id ${rid} was successfully replaced with new name - ${NEW_PUBLIC_CHANNEL_NAME}`,
        );
        process.exit();
    } catch (error) {
        // look up the implementation of handleError()
        // to learn more about SquadusClient error handling
        handleError(error);
        process.exit();
    }
})();
