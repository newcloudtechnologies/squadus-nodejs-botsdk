import {
    CreatePrivateChannelResponseData,
    CreatePublicChannelResponseData,
    RoleName,
    SquadusClient,
} from '@squadus/botsdk';
import 'dotenv/config';
import { consoleError, consoleLog } from './utils/colorConsole';
import { TARGET_CHANNEL_NAME } from './utils/constants';
import { handleError } from './utils/handleError';

const { TOKEN, SERVER, PARTNER_NAME = '' } = process.env;
const squadusClient = new SquadusClient({
    token: TOKEN || '',
    server: SERVER || '',
});

(async (): Promise<void> => {
    try {
        await squadusClient.connect();
        const response = await squadusClient.room.createChannel({
            name: TARGET_CHANNEL_NAME,
            members: [PARTNER_NAME],
        });
        const roomId =
            (response?.data as CreatePrivateChannelResponseData)?.group?._id ??
            (response?.data as CreatePublicChannelResponseData)?.channel?._id;

        if (!roomId) {
            consoleError('Room was not created', response?.data);
            process.exit();
        }
        consoleLog(`Room with id ${roomId} was created successfully`);
        const userInfoResponse = await squadusClient.getUserInfoByUsername(
            PARTNER_NAME,
        );
        const userId = userInfoResponse?.data.user._id;
        if (!userId) {
            consoleError(
                `User with id ${userId} was not found`,
                response?.data,
            );
            process.exit();
        }
        consoleLog(`User with id ${userId} was found`);
        const roleName = RoleName.Moderator;
        const roleValue = true;
        await squadusClient.room.setUserRole({
            roomId,
            roleName,
            roleValue,
            userId,
        });
        const correctVerb = roleValue ? 'assigned' : 'unassigned';
        consoleLog(
            `Role ${roleName} was successfully ${correctVerb} to user ${PARTNER_NAME}`,
        );
        process.exit();
    } catch (error) {
        // look up the implementation of handleError()
        // to learn more about SquadusClient error handling
        handleError(error);
        process.exit();
    }
})();
