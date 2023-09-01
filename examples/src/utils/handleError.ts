import {
    ErrorCode as RestErrors,
    RestClientError,
    SDKError,
    SDKErrors,
} from '@squadus/botsdk';
import { consoleError } from './colorConsole';

export const handleError = (error: unknown) => {
    const handledError = error as RestClientError | SDKError;
    switch (handledError.code) {
        case SDKErrors.RoomSubscriptionError:
            consoleError(handledError.error);
            break;
        case RestErrors.WrongServerAddress:
            consoleError('Wrong server address');
            break;
        case RestErrors.InvalidRequest:
            consoleError('Invalid request to server');
            break;
        case RestErrors.AuthorizationError:
            consoleError('Wrong credentials');
            break;
        case RestErrors.InvalidArguments:
            consoleError(`Invalid arguments ${handledError.error}`);
            break;
        case RestErrors.CantInviteForDirectRoom:
            consoleError('You are trying to add user to direct room');
            break;
        case RestErrors.RoomNotFound:
            consoleError('You are trying to use wrong roomId!');
            break;
        case RestErrors.InvalidUsername:
        case RestErrors.InvalidUser:
            consoleError('Wrong username');
            break;
        case RestErrors.ChannelNameAlreadyExists:
            consoleError(
                "Channel with such name already exists. Let's try another name",
            );
            break;
        case RestErrors.InvalidRoom:
            consoleError('Wrong room id');
            break;
        case RestErrors.InvalidName:
            consoleError('Provided name contains invalid characters');
            break;
        case RestErrors.InvalidPathToAttachment:
            consoleError('Path does not match allowed path from config');
            break;
        case RestErrors.NoSuchFileOrDirectory:
            consoleError('Wrong path to file', handledError);
            break;
        case RestErrors.FileToLarge:
            consoleError('File is too large', handledError);
            break;
        case RestErrors.LostServerConnection:
            consoleError('Try to send again late', handledError);
            break;
        case RestErrors.EmptyResult:
            consoleError('Wrong rid or request');
            break;
        case RestErrors.MessageSizeExceeded:
            consoleError('Message is too large');
            break;
        case RestErrors.UserAlreadyModerator:
        case RestErrors.UserAlreadyOwner:
        case RestErrors.UserAlreadyLeader:
            consoleError('Role already assigned to user');
            break;
        case RestErrors.UserNotLeader:
        case RestErrors.UserNotModerator:
        case RestErrors.UserNotOwner:
            consoleError('User does not have this role');
            break;
        case RestErrors.UserNotInRoom:
            consoleError('User is not a member of the room');
            break;
        default:
            consoleError(handledError);
    }
};
