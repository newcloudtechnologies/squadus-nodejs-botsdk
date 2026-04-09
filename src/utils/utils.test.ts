/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2026
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */

import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

import {
    Collections,
    RoleName,
    SettingsName,
    SystemMessages,
} from '../lib/types';
import {
    validateCreatePrivateChannelParams,
    validateCreatePublicChannelParams,
    validateSaveRoomSettingsParams,
    validateSetUserRoleParams,
    validateAddUsersToRoomParams,
    validateGetRoomInfoByRoomIdParams,
    validateCreateChannelParams,
    validateUsernameParam,
    validateEmailParam,
    validateRemoveUserFromChannelParams,
    validateSendMessageByRidParams,
    validateSendAttachmentParams,
    validateGetSettingsParam,
    validateOnMessageParams,
    validateOnRoomChangeParams,
    validateOnReactionParams,
    validateOnEventParams,
    validateSubscribeParams,
    validateUnsubscribeParams,
    validateSendMessageToThread,
    validateReadThreadParam,
    convertRelativeToAbsolute,
    isPathValid,
    newLastMessageFilter,
    roomEventsFilter,
    ridFilter,
    messageEventFilter,
    msgIdFilter,
} from '.';
import {
    CreatePrivateChannelSDKParams,
    CreatePublicChannelSDKParams,
    IsPrivateType,
} from '../lib';

const CHANNEL_NAME = 'channel_name';
const TARGET_RID = 'targetRoomId';
const TARGET_PARENT_MESSAGE_ID = 'targetRoomTmid';
const TARGET_USER = 'squadus.bot';
const TARGET_ROOM_NAME = 'roomName';
const TARGET_ROOM_DESCRIPTION = 'roomDescription';
const TARGET_ROOM_TOPIC = 'roomTopic';
const TARGET_ROOM_ANNOUNCEMENT = 'roomAnnouncement';
const TARGET_JOIN_CODE = 'joinCode';
const TARGET_PATH = './';

describe('validateAddUsersToRoomParams', () => {
    it('should pass with valid params', () => {
        expect(
            validateAddUsersToRoomParams({
                users: [TARGET_USER],
                rid: TARGET_RID,
            }),
        ).toBeUndefined();
    });

    it('should pass with multiple users', () => {
        expect(
            validateAddUsersToRoomParams({
                users: ['user1', 'user2', 'user3'],
                rid: TARGET_RID,
            }),
        ).toBeUndefined();
    });

    it('should throw if rid is empty string', () => {
        expect(() =>
            validateAddUsersToRoomParams({ users: [TARGET_USER], rid: '' }),
        ).toThrow();
    });

    it('should throw if users array contains non-string element', () => {
        const params = { users: [1], rid: TARGET_RID } as never;
        expect(() => validateAddUsersToRoomParams(params)).toThrow();
    });

    it('should throw if users array contains empty string', () => {
        expect(() =>
            validateAddUsersToRoomParams({ users: [''], rid: TARGET_RID }),
        ).toThrow();
    });

    it('should throw if rid is not a string', () => {
        const params = { users: [TARGET_USER], rid: 123 } as never;
        expect(() => validateAddUsersToRoomParams(params)).toThrow();
    });
});

describe('validateCreatePublicChannelParams', () => {
    it('should pass with only name', () => {
        expect(
            validateCreatePublicChannelParams({ name: CHANNEL_NAME }),
        ).toBeUndefined();
    });

    it('should pass with all optional fields', () => {
        const params: CreatePublicChannelSDKParams = {
            isPrivate: false,
            members: ['user1', 'user2'],
            name: CHANNEL_NAME,
            readOnly: true,
            teamId: 'team123',
        };
        expect(validateCreatePublicChannelParams(params)).toBeUndefined();
    });

    it('should pass with empty members array', () => {
        expect(
            validateCreatePublicChannelParams({
                name: CHANNEL_NAME,
                members: [],
            }),
        ).toBeUndefined();
    });

    it('should throw if name is empty string', () => {
        expect(() => validateCreatePublicChannelParams({ name: '' })).toThrow();
    });

    it('should throw if members element is wrong type', () => {
        const params = { name: CHANNEL_NAME, members: [5, '1'] } as never;
        expect(() => validateCreatePublicChannelParams(params)).toThrow();
    });

    it('should throw if members contain empty string', () => {
        expect(() =>
            validateCreatePublicChannelParams({
                name: CHANNEL_NAME,
                members: [''],
            }),
        ).toThrow();
    });

    it('should throw if readOnly is null', () => {
        const params = { name: CHANNEL_NAME, readOnly: null } as never;
        expect(() => validateCreatePublicChannelParams(params)).toThrow();
    });

    it('should throw if teamId is empty string', () => {
        expect(() =>
            validateCreatePublicChannelParams({
                name: CHANNEL_NAME,
                teamId: '',
            }),
        ).toThrow();
    });

    it('should throw if name is not a string', () => {
        const params = { name: 123 } as never;
        expect(() => validateCreatePublicChannelParams(params)).toThrow();
    });
});

describe('validateCreatePrivateChannelParams', () => {
    const validParams: CreatePrivateChannelSDKParams = {
        encrypted: false,
        isPrivate: true,
        members: [],
        name: CHANNEL_NAME,
        readOnly: false,
    };

    it('should pass with valid params', () => {
        expect(validateCreatePrivateChannelParams(validParams)).toBeUndefined();
    });

    it('should pass with members', () => {
        expect(
            validateCreatePrivateChannelParams({
                ...validParams,
                members: ['user1', 'user2'],
            }),
        ).toBeUndefined();
    });

    it('should pass with teamId', () => {
        expect(
            validateCreatePrivateChannelParams({
                ...validParams,
                teamId: 'team123',
            }),
        ).toBeUndefined();
    });

    it('should throw if name is empty', () => {
        expect(() =>
            validateCreatePrivateChannelParams({ ...validParams, name: '' }),
        ).toThrow();
    });

    it('should throw if teamId is empty string', () => {
        expect(() =>
            validateCreatePrivateChannelParams({
                ...validParams,
                teamId: '',
            }),
        ).toThrow();
    });

    it('should throw if member is empty string', () => {
        expect(() =>
            validateCreatePrivateChannelParams({
                ...validParams,
                members: [''],
            }),
        ).toThrow();
    });

    it('should throw if name is not a string', () => {
        const params = { ...validParams, name: 123 } as never;
        expect(() => validateCreatePrivateChannelParams(params)).toThrow();
    });
});

describe('validateCreateChannelParams', () => {
    it('should pass if isPrivate is false', () => {
        expect(
            validateCreateChannelParams(false as unknown as IsPrivateType),
        ).toBeUndefined();
    });

    it('should pass if isPrivate is true', () => {
        expect(
            validateCreateChannelParams(true as unknown as IsPrivateType),
        ).toBeUndefined();
    });

    it('should pass if isPrivate is undefined', () => {
        expect(
            validateCreateChannelParams(undefined as unknown as IsPrivateType),
        ).toBeUndefined();
    });

    it('should throw if isPrivate is a string', () => {
        expect(() =>
            validateCreateChannelParams('' as unknown as IsPrivateType),
        ).toThrow();
    });

    it('should throw if isPrivate is a number', () => {
        expect(() =>
            validateCreateChannelParams(1 as unknown as IsPrivateType),
        ).toThrow();
    });
});

describe('validateSaveRoomSettingsParams', () => {
    const validParams = {
        rid: TARGET_RID,
    };

    it('should pass with only rid', () => {
        expect(validateSaveRoomSettingsParams(validParams)).toBeUndefined();
    });

    it('should pass with all optional fields', () => {
        expect(
            validateSaveRoomSettingsParams({
                encrypted: false,
                isPrivate: true,
                joinCode: TARGET_JOIN_CODE,
                reactWhenReadOnly: false,
                readOnly: false,
                rid: TARGET_RID,
                roomAnnouncement: TARGET_ROOM_ANNOUNCEMENT,
                roomDescription: TARGET_ROOM_DESCRIPTION,
                roomName: TARGET_ROOM_NAME,
                roomTopic: TARGET_ROOM_TOPIC,
                systemMessages: [
                    SystemMessages.UserJoin,
                    SystemMessages.UserAdded,
                ],
            }),
        ).toBeUndefined();
    });

    it('should pass with empty systemMessages array', () => {
        expect(
            validateSaveRoomSettingsParams({
                ...validParams,
                systemMessages: [],
            }),
        ).toBeUndefined();
    });

    it('should throw if rid is empty string', () => {
        expect(() => validateSaveRoomSettingsParams({ rid: '' })).toThrow();
    });

    it('should throw if rid is not a string', () => {
        const params = { rid: 123 } as never;
        expect(() => validateSaveRoomSettingsParams(params)).toThrow();
    });

    it('should throw if wrong string was passed as system message', () => {
        const params = {
            rid: TARGET_RID,
            systemMessages: ['invalid_system_message'],
        } as never;
        expect(() => validateSaveRoomSettingsParams(params)).toThrow();
    });

    it('should throw if joinCode is empty string', () => {
        expect(() =>
            validateSaveRoomSettingsParams({
                ...validParams,
                joinCode: '',
            }),
        ).toThrow();
    });

    it('should throw if roomName is empty string', () => {
        expect(() =>
            validateSaveRoomSettingsParams({
                ...validParams,
                roomName: '',
            }),
        ).toThrow();
    });
});

describe('validateSetUserRoleParams', () => {
    const validParams = {
        roomId: TARGET_RID,
        userId: TARGET_USER,
        roleName: RoleName.Leader,
        roleValue: true,
    };

    it('should pass with valid params', () => {
        expect(validateSetUserRoleParams(validParams)).toBeUndefined();
    });

    it('should pass with Moderator role', () => {
        expect(
            validateSetUserRoleParams({
                ...validParams,
                roleName: RoleName.Moderator,
            }),
        ).toBeUndefined();
    });

    it('should pass with Owner role', () => {
        expect(
            validateSetUserRoleParams({
                ...validParams,
                roleName: RoleName.Owner,
            }),
        ).toBeUndefined();
    });

    it('should pass with roleValue false', () => {
        expect(
            validateSetUserRoleParams({ ...validParams, roleValue: false }),
        ).toBeUndefined();
    });

    it('should throw if roomId is empty', () => {
        expect(() =>
            validateSetUserRoleParams({ ...validParams, roomId: '' }),
        ).toThrow();
    });

    it('should throw if userId is empty', () => {
        expect(() =>
            validateSetUserRoleParams({ ...validParams, userId: '' }),
        ).toThrow();
    });

    it('should throw if roleName is invalid string', () => {
        const params = { ...validParams, roleName: 'InvalidRole' } as never;
        expect(() => validateSetUserRoleParams(params)).toThrow();
    });

    it('should throw if roleValue is not a boolean', () => {
        const params = { ...validParams, roleValue: 'yes' } as never;
        expect(() => validateSetUserRoleParams(params)).toThrow();
    });
});

describe('validateGetRoomInfoByRoomIdParams', () => {
    it('should pass with valid rid', () => {
        expect(
            validateGetRoomInfoByRoomIdParams({ rid: TARGET_RID }),
        ).toBeUndefined();
    });

    it('should throw if rid is empty', () => {
        expect(() => validateGetRoomInfoByRoomIdParams({ rid: '' })).toThrow();
    });

    it('should throw if rid is a number', () => {
        const params = { rid: 123 } as never;
        expect(() => validateGetRoomInfoByRoomIdParams(params)).toThrow();
    });

    it('should throw if rid is undefined', () => {
        const params = {} as never;
        expect(() => validateGetRoomInfoByRoomIdParams(params)).toThrow();
    });
});

describe('validateUsernameParam', () => {
    it('should pass with valid username', () => {
        expect(validateUsernameParam(TARGET_USER)).toBeUndefined();
    });

    it('should pass with single character username', () => {
        expect(validateUsernameParam('a')).toBeUndefined();
    });

    it('should throw if empty string', () => {
        expect(() => validateUsernameParam('')).toThrow();
    });

    it('should throw if number', () => {
        expect(() => validateUsernameParam(12842 as never)).toThrow();
    });

    it('should throw if null', () => {
        expect(() => validateUsernameParam(null as never)).toThrow();
    });
});

describe('validateEmailParam', () => {
    it('should pass with valid email', () => {
        expect(validateEmailParam('user@example.com')).toBeUndefined();
    });

    it('should pass with email with subdomain', () => {
        expect(validateEmailParam('user@mail.example.com')).toBeUndefined();
    });

    it('should pass with email with + tag', () => {
        expect(validateEmailParam('user+tag@example.com')).toBeUndefined();
    });

    it('should throw if empty string', () => {
        expect(() => validateEmailParam('')).toThrow();
    });

    it('should throw if string without @', () => {
        expect(() => validateEmailParam('userexample.com')).toThrow();
    });

    it('should throw if string without domain', () => {
        expect(() => validateEmailParam('user@')).toThrow();
    });

    it('should throw if number', () => {
        expect(() => validateEmailParam(12345 as never)).toThrow();
    });

    it('should throw if just @', () => {
        expect(() => validateEmailParam('@')).toThrow();
    });
});

describe('validateRemoveUserFromChannelParams', () => {
    it('should pass with valid params', () => {
        expect(
            validateRemoveUserFromChannelParams({
                rid: TARGET_RID,
                username: TARGET_USER,
            }),
        ).toBeUndefined();
    });

    it('should throw if rid is empty', () => {
        expect(() =>
            validateRemoveUserFromChannelParams({
                rid: '',
                username: TARGET_USER,
            }),
        ).toThrow();
    });

    it('should throw if username is empty', () => {
        expect(() =>
            validateRemoveUserFromChannelParams({
                rid: TARGET_RID,
                username: '',
            }),
        ).toThrow();
    });

    it('should throw if both are empty', () => {
        expect(() =>
            validateRemoveUserFromChannelParams({ rid: '', username: '' }),
        ).toThrow();
    });

    it('should throw if types are wrong', () => {
        const params = { rid: 111, username: true } as never;
        expect(() => validateRemoveUserFromChannelParams(params)).toThrow();
    });
});

describe('validateSendMessageByRidParams', () => {
    it('should pass with valid params', () => {
        expect(
            validateSendMessageByRidParams({
                rid: TARGET_RID,
                msg: 'hello',
            }),
        ).toBeUndefined();
    });

    it('should throw if rid is empty', () => {
        expect(() =>
            validateSendMessageByRidParams({ rid: '', msg: 'hello' }),
        ).toThrow();
    });

    it('should throw if msg is empty', () => {
        expect(() =>
            validateSendMessageByRidParams({ rid: TARGET_RID, msg: '' }),
        ).toThrow();
    });

    it('should throw if both are empty', () => {
        expect(() =>
            validateSendMessageByRidParams({ rid: '', msg: '' }),
        ).toThrow();
    });

    it('should throw if types are wrong', () => {
        const params = { rid: 111, msg: true } as never;
        expect(() => validateSendMessageByRidParams(params)).toThrow();
    });
});

describe('validateSendMessageToThread', () => {
    it('should pass with valid params', () => {
        expect(
            validateSendMessageToThread({
                rid: TARGET_RID,
                msg: 'hello',
                parentMessageId: TARGET_PARENT_MESSAGE_ID,
            }),
        ).toBeUndefined();
    });

    it('should throw if parentMessageId is empty', () => {
        expect(() =>
            validateSendMessageToThread({
                rid: TARGET_RID,
                msg: 'hello',
                parentMessageId: '',
            }),
        ).toThrow();
    });

    it('should throw if rid is empty', () => {
        expect(() =>
            validateSendMessageToThread({
                rid: '',
                msg: 'hello',
                parentMessageId: TARGET_PARENT_MESSAGE_ID,
            }),
        ).toThrow();
    });

    it('should throw if msg is empty', () => {
        expect(() =>
            validateSendMessageToThread({
                rid: TARGET_RID,
                msg: '',
                parentMessageId: TARGET_PARENT_MESSAGE_ID,
            }),
        ).toThrow();
    });
});

describe('validateSendAttachmentParams', () => {
    it('should pass with rid, path and msg', () => {
        expect(
            validateSendAttachmentParams({
                rid: TARGET_RID,
                path: TARGET_PATH,
                msg: 'caption',
            }),
        ).toBeUndefined();
    });

    it('should pass without msg (optional)', () => {
        expect(
            validateSendAttachmentParams({
                rid: TARGET_RID,
                path: TARGET_PATH,
            }),
        ).toBeUndefined();
    });

    it('should throw if rid is empty', () => {
        expect(() =>
            validateSendAttachmentParams({ rid: '', path: TARGET_PATH }),
        ).toThrow();
    });

    it('should throw if path is empty', () => {
        expect(() =>
            validateSendAttachmentParams({ rid: TARGET_RID, path: '' }),
        ).toThrow();
    });

    it('should throw if both are empty', () => {
        expect(() =>
            validateSendAttachmentParams({ rid: '', path: '' }),
        ).toThrow();
    });

    it('should throw if types are wrong', () => {
        const params = { rid: 111, path: new Object(), msg: true } as never;
        expect(() => validateSendAttachmentParams(params)).toThrow();
    });
});

describe('validateGetSettingsParam', () => {
    it('should pass with valid settings array', () => {
        expect(
            validateGetSettingsParam([SettingsName.Accounts_AddGuestsToChats]),
        ).toBeUndefined();
    });

    it('should pass with undefined settings', () => {
        expect(validateGetSettingsParam(undefined)).toBeUndefined();
    });

    it('should pass with empty settings array', () => {
        expect(validateGetSettingsParam([])).toBeUndefined();
    });

    it('should pass with valid server URL', () => {
        expect(
            validateGetSettingsParam(undefined, 'https://example.com'),
        ).toBeUndefined();
    });

    it('should throw if settings contains invalid values', () => {
        expect(() =>
            validateGetSettingsParam(['Hello', 1234] as never),
        ).toThrow();
    });

    it('should throw if server is not a valid URL', () => {
        expect(() =>
            validateGetSettingsParam(undefined, 'not-a-url'),
        ).toThrow();
    });
});

describe('validateOnMessageParams', () => {
    it('should pass with cb and rid', () => {
        expect(
            validateOnMessageParams({ cb: noop, rid: 'ridExample' }),
        ).toBeUndefined();
    });

    it('should pass with cb only (rid is optional)', () => {
        expect(validateOnMessageParams({ cb: noop })).toBeUndefined();
    });

    it('should throw if cb is not a function', () => {
        const params = { cb: 'not-a-function' } as never;
        expect(() => validateOnMessageParams(params)).toThrow();
    });

    it('should throw if rid is empty string', () => {
        expect(() => validateOnMessageParams({ cb: noop, rid: '' })).toThrow();
    });

    it('should throw if types are swapped', () => {
        const params = { rid: noop, cb: 'string' } as never;
        expect(() => validateOnMessageParams(params)).toThrow();
    });
});

describe('validateOnRoomChangeParams', () => {
    it('should pass with valid params', () => {
        expect(
            validateOnRoomChangeParams({ cb: noop, rid: 'ridExample' }),
        ).toBeUndefined();
    });

    it('should throw if rid is missing', () => {
        expect(() =>
            validateOnRoomChangeParams({ cb: noop } as never),
        ).toThrow();
    });

    it('should throw if rid is empty', () => {
        expect(() =>
            validateOnRoomChangeParams({ cb: noop, rid: '' }),
        ).toThrow();
    });

    it('should throw if cb is not a function', () => {
        const params = { cb: 'string', rid: 'rid' } as never;
        expect(() => validateOnRoomChangeParams(params)).toThrow();
    });

    it('should throw if types are swapped', () => {
        const params = { rid: noop, cb: 'cbExample' } as never;
        expect(() => validateOnRoomChangeParams(params)).toThrow();
    });
});

describe('validateOnReactionParams', () => {
    it('should pass with valid params', () => {
        expect(
            validateOnReactionParams({
                cb: noop,
                rid: 'ridExample',
                msgId: 'msgIdExample',
            }),
        ).toBeUndefined();
    });

    it('should throw if msgId is missing', () => {
        const params = { cb: noop, rid: 'ridExample' } as never;
        expect(() => validateOnReactionParams(params)).toThrow();
    });

    it('should throw if msgId is empty', () => {
        expect(() =>
            validateOnReactionParams({
                cb: noop,
                rid: 'ridExample',
                msgId: '',
            }),
        ).toThrow();
    });

    it('should throw if rid is empty', () => {
        expect(() =>
            validateOnReactionParams({
                cb: noop,
                rid: '',
                msgId: 'msgIdExample',
            }),
        ).toThrow();
    });

    it('should throw if cb is not a function', () => {
        const params = {
            cb: 'string',
            rid: 'ridExample',
            msgId: 'msgIdExample',
        } as never;
        expect(() => validateOnReactionParams(params)).toThrow();
    });
});

describe('validateOnEventParams', () => {
    it('should pass with a function', () => {
        expect(validateOnEventParams(noop)).toBeUndefined();
    });

    it('should pass with arrow function', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        expect(validateOnEventParams(() => {})).toBeUndefined();
    });

    it('should throw if string is passed', () => {
        expect(() => validateOnEventParams('param' as never)).toThrow();
    });

    it('should throw if number is passed', () => {
        expect(() => validateOnEventParams(123 as never)).toThrow();
    });

    it('should throw if object is passed', () => {
        expect(() => validateOnEventParams({} as never)).toThrow();
    });
});

describe('validateSubscribeParams', () => {
    it('should pass with valid collection and event', () => {
        expect(
            validateSubscribeParams({
                collection: Collections.StreamNotifyUser,
                event: 'f9i0s9di0ve/typing',
            }),
        ).toBeUndefined();
    });

    it('should pass with StreamRoomMessages collection', () => {
        expect(
            validateSubscribeParams({
                collection: Collections.StreamRoomMessages,
                event: 'roomId',
            }),
        ).toBeUndefined();
    });

    it('should pass with StreamNotifyRoom collection', () => {
        expect(
            validateSubscribeParams({
                collection: Collections.StreamNotifyRoom,
                event: 'roomId/typing',
            }),
        ).toBeUndefined();
    });

    it('should throw if collection is arbitrary string', () => {
        const params = { collection: 'string', event: 'event' } as never;
        expect(() => validateSubscribeParams(params)).toThrow();
    });

    it('should throw if event is empty', () => {
        expect(() =>
            validateSubscribeParams({
                collection: Collections.StreamNotifyUser,
                event: '',
            }),
        ).toThrow();
    });

    it('should throw if types are wrong', () => {
        const params = { event: 2, collection: 3 } as never;
        expect(() => validateSubscribeParams(params)).toThrow();
    });
});

describe('validateUnsubscribeParams', () => {
    it('should pass with valid id', () => {
        expect(validateUnsubscribeParams('idExample')).toBeUndefined();
    });

    it('should throw if number is passed', () => {
        expect(() => validateUnsubscribeParams(12345 as never)).toThrow();
    });

    it('should throw if empty string', () => {
        expect(() => validateUnsubscribeParams('')).toThrow();
    });

    it('should throw if null', () => {
        expect(() => validateUnsubscribeParams(null as never)).toThrow();
    });
});

describe('validateReadThreadParam', () => {
    it('should pass with valid parentMessageId', () => {
        expect(
            validateReadThreadParam(TARGET_PARENT_MESSAGE_ID),
        ).toBeUndefined();
    });

    it('should throw if empty string', () => {
        expect(() => validateReadThreadParam('')).toThrow();
    });

    it('should throw if number', () => {
        expect(() => validateReadThreadParam(12 as never)).toThrow();
    });

    it('should throw if null', () => {
        expect(() => validateReadThreadParam(null as never)).toThrow();
    });
});

describe('isPathValid', () => {
    it('should return true if attachment path is within allowed path', () => {
        expect(
            isPathValid('/home/user/files/doc.pdf', '/home/user/files'),
        ).toBe(true);
    });

    it('should return true if paths are equal', () => {
        expect(isPathValid('/home/user/files', '/home/user/files')).toBe(true);
    });

    it('should return true for nested subdirectory', () => {
        expect(
            isPathValid('/home/user/files/a/b/c.txt', '/home/user/files'),
        ).toBe(true);
    });

    it('should return false if attachment is outside allowed path', () => {
        expect(
            isPathValid('/home/user/other/doc.pdf', '/home/user/files'),
        ).toBe(false);
    });

    it('should return false for path traversal with ..', () => {
        expect(
            isPathValid(
                '/home/user/files/../../etc/passwd',
                '/home/user/files',
            ),
        ).toBe(false);
    });

    it('should return false for similar prefix path (files vs files-evil)', () => {
        expect(
            isPathValid('/home/user/files-evil/doc.pdf', '/home/user/files'),
        ).toBe(false);
    });

    it('should handle relative paths', () => {
        expect(isPathValid('./test.txt', './')).toBe(true);
    });

    it('should return false for relative path outside allowed', () => {
        expect(isPathValid('../../etc/passwd', './uploads')).toBe(false);
    });
});

describe('convertRelativeToAbsolute', () => {
    it('should convert relative path to absolute', () => {
        const relativePath = '../..';
        expect(convertRelativeToAbsolute(relativePath)).toBe(
            path.resolve(__dirname, '../../../../'),
        );
    });

    it('should normalize absolute path (resolve ..)', () => {
        const pathWithDots = '/home/user/files/../other';
        expect(convertRelativeToAbsolute(pathWithDots)).toBe(
            '/home/user/other',
        );
    });

    it('should return normalized absolute path', () => {
        const absolutePath = '/home/user/files';
        expect(convertRelativeToAbsolute(absolutePath)).toBe(absolutePath);
    });

    it('should resolve dot path', () => {
        expect(convertRelativeToAbsolute('.')).toBe(process.cwd());
    });
});

describe('filters', () => {
    describe('roomEventsFilter', () => {
        it('should return true for StreamRoomMessages', () => {
            const data = {
                collection: Collections.StreamRoomMessages,
                fields: { args: [], eventName: 'roomId' },
                id: 'id',
                msg: 'changed',
            };
            expect(roomEventsFilter(data as never)).toBe(true);
        });

        it('should return true for StreamNotifyRoom', () => {
            const data = {
                collection: Collections.StreamNotifyRoom,
                fields: { args: [], eventName: 'roomId/typing' },
                id: 'id',
                msg: 'changed',
            };
            expect(roomEventsFilter(data as never)).toBe(true);
        });

        it('should return false for StreamNotifyUser', () => {
            const data = {
                collection: Collections.StreamNotifyUser,
                fields: { args: [], eventName: 'event' },
                id: 'id',
                msg: 'changed',
            };
            expect(roomEventsFilter(data as never)).toBe(false);
        });

        it('should return false for data without collection', () => {
            const data = { msg: 'pong' };
            expect(roomEventsFilter(data as never)).toBe(false);
        });
    });

    describe('ridFilter', () => {
        it('should return true when eventName contains rid', () => {
            const data = {
                collection: Collections.StreamRoomMessages,
                fields: { args: [], eventName: 'abc123' },
                id: 'id',
                msg: 'changed',
            };
            expect(ridFilter('abc123', data as never)).toBe(true);
        });

        it('should return true when eventName contains rid as prefix', () => {
            const data = {
                collection: Collections.StreamNotifyRoom,
                fields: { args: [], eventName: 'abc123/typing' },
                id: 'id',
                msg: 'changed',
            };
            expect(ridFilter('abc123', data as never)).toBe(true);
        });

        it('should return false when eventName does not contain rid', () => {
            const data = {
                collection: Collections.StreamRoomMessages,
                fields: { args: [], eventName: 'other-room' },
                id: 'id',
                msg: 'changed',
            };
            expect(ridFilter('abc123', data as never)).toBe(false);
        });
    });

    describe('messageEventFilter', () => {
        it('should return true for StreamRoomMessages', () => {
            const data = {
                collection: Collections.StreamRoomMessages,
                fields: { args: [{}], eventName: 'roomId' },
                id: 'id',
                msg: 'changed',
            };
            expect(messageEventFilter(data as never)).toBe(true);
        });

        it('should return false for StreamNotifyRoom', () => {
            const data = {
                collection: Collections.StreamNotifyRoom,
                fields: { args: ['user', true], eventName: 'roomId/typing' },
                id: 'id',
                msg: 'changed',
            };
            expect(messageEventFilter(data as never)).toBe(false);
        });
    });

    describe('msgIdFilter', () => {
        it('should return true when message _id matches', () => {
            const data = {
                collection: Collections.StreamRoomMessages,
                fields: {
                    args: [{ _id: 'msg123' }],
                    eventName: 'roomId',
                },
                id: 'id',
                msg: 'changed',
            };
            expect(msgIdFilter('msg123', data as never)).toBe(true);
        });

        it('should return false when message _id does not match', () => {
            const data = {
                collection: Collections.StreamRoomMessages,
                fields: {
                    args: [{ _id: 'other-msg' }],
                    eventName: 'roomId',
                },
                id: 'id',
                msg: 'changed',
            };
            expect(msgIdFilter('msg123', data as never)).toBe(false);
        });
    });

    describe('newLastMessageFilter', () => {
        it('should return false for data without eventName', () => {
            const data = { msg: 'pong' };
            expect(newLastMessageFilter('user1', data as never)).toBe(false);
        });

        it('should return false for non-rooms-changed event', () => {
            const data = {
                collection: Collections.StreamRoomMessages,
                fields: { args: [{}], eventName: 'roomId' },
                id: 'id',
                msg: 'changed',
            };
            expect(newLastMessageFilter('user1', data as never)).toBe(false);
        });

        it('should return true for unread message from other user', () => {
            const data = {
                collection: Collections.StreamNotifyUser,
                fields: {
                    args: [
                        'event',
                        {
                            lastMessage: {
                                u: { _id: 'otherUser' },
                                unread: true,
                            },
                        },
                    ],
                    eventName: 'userId/rooms-changed',
                },
                id: 'id',
                msg: 'changed',
            };
            expect(newLastMessageFilter('currentUser', data as never)).toBe(
                true,
            );
        });

        it('should return false for message from same user', () => {
            const data = {
                collection: Collections.StreamNotifyUser,
                fields: {
                    args: [
                        'event',
                        {
                            lastMessage: {
                                u: { _id: 'currentUser' },
                                unread: true,
                            },
                        },
                    ],
                    eventName: 'userId/rooms-changed',
                },
                id: 'id',
                msg: 'changed',
            };
            expect(newLastMessageFilter('currentUser', data as never)).toBe(
                false,
            );
        });

        it('should return false for read message from other user', () => {
            const data = {
                collection: Collections.StreamNotifyUser,
                fields: {
                    args: [
                        'event',
                        {
                            lastMessage: {
                                u: { _id: 'otherUser' },
                                unread: false,
                            },
                        },
                    ],
                    eventName: 'userId/rooms-changed',
                },
                id: 'id',
                msg: 'changed',
            };
            expect(newLastMessageFilter('currentUser', data as never)).toBe(
                false,
            );
        });

        it('should return false when lastMessage is undefined', () => {
            const data = {
                collection: Collections.StreamNotifyUser,
                fields: {
                    args: ['event', {}],
                    eventName: 'userId/rooms-changed',
                },
                id: 'id',
                msg: 'changed',
            };
            expect(newLastMessageFilter('currentUser', data as never)).toBe(
                false,
            );
        });
    });
});
