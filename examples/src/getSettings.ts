import { SettingsName, SquadusClient } from '@squadus/botsdk';
import 'dotenv/config';
import { consoleLog } from './utils/colorConsole';
import { handleError } from './utils/handleError';

const { TOKEN, SERVER } = process.env;
const squadusClient = new SquadusClient({
    token: TOKEN || '',
    server: SERVER || '',
});

(async (): Promise<void> => {
    const settings = [
        SettingsName.Accounts_AllowRealNameChange,
        SettingsName.Accounts_AddGuestsToChats,
    ];
    try {
        const response = await squadusClient.getSettings(settings);
        consoleLog(
            `Settings were successfully fetched: ${response?.data.settings
                .map((s) => s._id)
                .join(', ')}\n`,
            response?.data,
        );
        process.exit();
    } catch (error) {
        // look up the implementation of handleError()
        // to learn more about SquadusClient error handling
        handleError(error);
        process.exit();
    }
})();
