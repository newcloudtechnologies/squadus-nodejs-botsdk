import {
    CreatePrivateChannelResponseData,
    CreatePublicChannelResponseData,
    SquadusClient,
} from '@squadus/botsdk';

import 'dotenv/config';
import { consoleError, consoleLog } from './utils/colorConsole';
import {
    NEW_PRIVATE_CHANNEL_NAME,
    NEW_PUBLIC_CHANNEL_NAME,
} from './utils/constants';
import { handleError } from './utils/handleError';

const { TOKEN, SERVER, PARTNER_NAME = '' } = process.env;
const squadusClient = new SquadusClient({
    token: TOKEN || '',
    server: SERVER || '',
});
const IS_PRIVATE_CHANNEL = true;

(async (): Promise<void> => {
    try {
        await squadusClient.connect();
        const response = await squadusClient.room.createChannel({
            name: IS_PRIVATE_CHANNEL
                ? NEW_PRIVATE_CHANNEL_NAME
                : NEW_PUBLIC_CHANNEL_NAME,
            members: [],
            isPrivate: IS_PRIVATE_CHANNEL,
            readOnly: false,
            encrypted: false,
        });
        const responseData = response?.data;
        const roomId =
            (responseData as CreatePrivateChannelResponseData)?.group?._id ??
            (responseData as CreatePublicChannelResponseData)?.channel?._id;
        if (!roomId) {
            consoleError('No room was created. Try again!');
            process.exit();
        }
        consoleLog(`Room with id ${roomId} was created successfully`);
        const addResult = await squadusClient.room.addUsersToRoom({
            rid: roomId,
            users: [PARTNER_NAME],
        });
        if (!addResult) {
            consoleError(
                `User ${PARTNER_NAME} was not added to room with id ${roomId}`,
            );
            process.exit();
        }
        consoleLog(
            `User ${PARTNER_NAME} was added to room successfully ${addResult}`,
        );

        // remove user from channel
        const deleteResponse = await squadusClient.room.removeUserFromChannel({
            rid: roomId,
            username: PARTNER_NAME,
        });

        consoleLog(
            `User ${PARTNER_NAME} was removed from room successfully`,
            deleteResponse?.data,
        );
        process.exit();
    } catch (error) {
        // look up the implementation of handleError()
        // to learn more about SquadusClient error handling
        handleError(error);
        process.exit();
    }
})();
