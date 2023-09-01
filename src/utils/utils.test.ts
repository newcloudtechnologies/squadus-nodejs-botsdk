/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */

import * as path from 'path';

import noop from 'lodash/noop';

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
    validateAddUseToRoomParams,
    validateGetRoomInfoByRoomIdParams,
    validateCreateChannelParams,
    validateUsernameParam,
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
} from '.';
import { CreatePrivateChannelSDKParams, IsPrivateType } from '../lib';

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

describe('Utils', () => {
    describe('validateAddUseToRoomParams', () => {
        it('should return undefined if valid params were passed', () => {
            const params = { users: [TARGET_USER], rid: TARGET_RID };
            expect(validateAddUseToRoomParams(params)).toBeUndefined();
        });
        it('should throw an Error if rid was empty string', () => {
            const params = { users: [TARGET_USER], rid: '' };
            expect(() => validateAddUseToRoomParams(params)).toThrow();
        });
        it('should throw an Error if empty users array was passed', () => {
            const params = { users: [1], rid: TARGET_RID };
            // @ts-expect-error passed wrong type on purpose
            expect(() => validateAddUseToRoomParams(params)).toThrow();
        });
    });
    describe('validateCreatePrivateChannelArguments', () => {
        it('should return undefined if valid params were passed', () => {
            const correctParams: CreatePrivateChannelSDKParams = {
                name: CHANNEL_NAME,
                members: [],
                isPrivate: true,
                readOnly: false,
                encrypted: false,
            };
            expect(
                validateCreatePrivateChannelParams(correctParams),
            ).toBeUndefined();
        });
        it('should throw an Error if empty string was passed to teamId', () => {
            const correctParams: CreatePrivateChannelSDKParams = {
                name: CHANNEL_NAME,
                members: [],
                isPrivate: true,
                readOnly: false,
                encrypted: false,
                teamId: '',
            };
            expect(() =>
                validateCreatePrivateChannelParams(correctParams),
            ).toThrow();
        });
        it('should throw an Error if empty string was passed as member', () => {
            const correctParams: CreatePrivateChannelSDKParams = {
                name: CHANNEL_NAME,
                members: [''],
                isPrivate: true,
                readOnly: false,
                encrypted: false,
            };
            expect(() =>
                validateCreatePrivateChannelParams(correctParams),
            ).toThrow();
        });
    });
    describe('validateCreatePublicChannelParams', () => {
        it('should return undefined if only name is passed', () => {
            const correctParams = {
                name: CHANNEL_NAME,
            };
            expect(
                validateCreatePublicChannelParams(correctParams),
            ).toBeUndefined();
        });
        it('should throw an Error if members element is wrong type', () => {
            const correctParams = {
                name: CHANNEL_NAME,
                members: [5, '1'],
            };
            expect(() =>
                // @ts-expect-error passed wrong type on purpose
                validateCreatePublicChannelParams(correctParams),
            ).toThrow();
        });
        it('should throw an Error if readOnly is null', () => {
            const correctParams = {
                name: CHANNEL_NAME,
                readOnly: null,
            };
            expect(() =>
                // @ts-expect-error passed wrong type on purpose
                validateCreatePublicChannelParams(correctParams),
            ).toThrow();
        });
    });
    describe('validateSaveRoomSettingsParams', () => {
        it('should return undefined if valid params were passed', () => {
            const correctParams = {
                isPrivate: true,
                rid: TARGET_RID,
                roomName: TARGET_ROOM_NAME,
                roomDescription: TARGET_ROOM_DESCRIPTION,
                roomTopic: TARGET_ROOM_TOPIC,
                roomAnnouncement: TARGET_ROOM_ANNOUNCEMENT,
                readOnly: false,
                systemMessages: [
                    SystemMessages.UserJoin,
                    SystemMessages.UserAdded,
                ],
                joinCode: TARGET_JOIN_CODE,
                reactWhenReadOnly: false,
                encrypted: false,
            };
            expect(
                validateSaveRoomSettingsParams(correctParams),
            ).toBeUndefined();
        });
        it('should throw an Error if empty string was passed to rid', () => {
            const correctParams = {
                isPrivate: true,
                rid: '',
                roomName: TARGET_ROOM_NAME,
                roomDescription: TARGET_ROOM_DESCRIPTION,
                roomTopic: TARGET_ROOM_TOPIC,
                roomAnnouncement: TARGET_ROOM_ANNOUNCEMENT,
                readOnly: false,
                systemMessages: [],
                joinCode: TARGET_JOIN_CODE,
                reactWhenReadOnly: false,
                encrypted: false,
            };
            expect(() =>
                validateSaveRoomSettingsParams(correctParams),
            ).toThrow();
        });
        it('should throw an Error if wrong string was passed as system message', () => {
            const correctParams = {
                isPrivate: true,
                rid: '',
                roomName: TARGET_ROOM_NAME,
                roomDescription: TARGET_ROOM_DESCRIPTION,
                roomTopic: TARGET_ROOM_TOPIC,
                roomAnnouncement: TARGET_ROOM_ANNOUNCEMENT,
                readOnly: false,
                systemMessages: [],
                joinCode: TARGET_JOIN_CODE,
                reactWhenReadOnly: false,
                encrypted: false,
            };
            expect(() =>
                validateSaveRoomSettingsParams(correctParams),
            ).toThrow();
        });
    });
    describe('validateSetUserRoleParams', () => {
        it('should return undefined on correct params', () => {
            const params = {
                roomId: TARGET_RID,
                userId: TARGET_USER,
                roleName: RoleName.Leader,
                roleValue: true,
            };
            expect(validateSetUserRoleParams(params)).toBeUndefined();
        });
        it('should throw an Error if empty roomId passed', () => {
            const params = {
                roomId: '',
                userId: TARGET_USER,
                roleName: RoleName.Leader,
                roleValue: true,
            };
            expect(() => validateSetUserRoleParams(params)).toThrow();
        });
        it('should throw an Error if empty userId passed', () => {
            const params = {
                roomId: TARGET_RID,
                userId: '',
                roleName: RoleName.Leader,
                roleValue: true,
            };
            expect(() => validateSetUserRoleParams(params)).toThrow();
        });
    });
    describe('validateGetRoomInfoByRoomIdParams', () => {
        it('should return undefined on correct params', () => {
            const params = {
                rid: TARGET_RID,
            };
            expect(validateGetRoomInfoByRoomIdParams(params)).toBeUndefined();
        });
        it('should throw an Error if empty rid was passed', () => {
            const params = {
                rid: '',
            };
            expect(() => validateGetRoomInfoByRoomIdParams(params)).toThrow();
        });
        it('should throw an Error if number was passed to rid', () => {
            const params = {
                rid: 123,
            };
            // @ts-expect-error passed wrong type on purpose
            expect(() => validateGetRoomInfoByRoomIdParams(params)).toThrow();
        });
    });
    describe('validateCreateChannelParams', () => {
        it('should return undefined if isPrivate is false', () => {
            const isPrivate = false;
            expect(
                validateCreateChannelParams(
                    isPrivate as unknown as IsPrivateType,
                ),
            ).toBeUndefined();
        });
        it('should return undefined if isPrivate is true', () => {
            const isPrivate = true;
            expect(
                validateCreateChannelParams(
                    isPrivate as unknown as IsPrivateType,
                ),
            ).toBeUndefined();
        });
        it('should return undefined if isPrivate is undefined', () => {
            const isPrivate = undefined;
            expect(
                validateCreateChannelParams(
                    isPrivate as unknown as IsPrivateType,
                ),
            ).toBeUndefined();
        });
        it('should throw an Error if isPrivate is string', () => {
            const isPrivate = '';
            expect(() =>
                validateCreateChannelParams(
                    isPrivate as unknown as IsPrivateType,
                ),
            ).toThrow();
        });
    });
    describe('validateUsernameParam', () => {
        it('should return undefined if correct username was passed', () => {
            const username = TARGET_USER;
            expect(validateUsernameParam(username)).toBeUndefined();
        });
        it('should throw an Error if empty string was passed as username', () => {
            const username = '';
            expect(() => validateUsernameParam(username)).toThrow();
        });
        it('should throw an Error if empty string was passed as username', () => {
            const username = 12842;
            // @ts-expect-error passed wrong type on purpose
            expect(() => validateUsernameParam(username)).toThrow();
        });
    });
    describe('validateRemoveUserFromChannelParams', () => {
        it('should return undefined if correct params were passed', () => {
            const params = {
                rid: TARGET_RID,
                username: TARGET_USER,
            };
            expect(validateRemoveUserFromChannelParams(params)).toBeUndefined();
        });
        it('should throw an Error if empty params were passed as username', () => {
            const params = {
                rid: '',
                username: '',
            };
            expect(() => validateRemoveUserFromChannelParams(params)).toThrow();
        });
        it('should throw an Error if incorrect types were passed as params', () => {
            const params = {
                rid: 111,
                username: true,
            };
            // @ts-expect-error passed wrong type on purpose
            expect(() => validateRemoveUserFromChannelParams(params)).toThrow();
        });
    });
    describe('validateSendMessageByRidParams', () => {
        it('should return undefined if correct params were passed', () => {
            const params = {
                rid: TARGET_RID,
                msg: TARGET_USER,
            };
            expect(validateSendMessageByRidParams(params)).toBeUndefined();
        });
        it('should throw an Error if empty strings were passed as params', () => {
            const params = {
                rid: '',
                msg: '',
            };
            expect(() => validateSendMessageByRidParams(params)).toThrow();
        });
        it('should throw an Error if incorrect types were passed as params', () => {
            const params = {
                rid: 111,
                msg: true,
            };
            // @ts-expect-error passed wrong type on purpose
            expect(() => validateSendMessageByRidParams(params)).toThrow();
        });
    });
    describe('validateSendAttachmentParams', () => {
        it('should return undefined if correct params were passed', () => {
            const params = {
                rid: TARGET_RID,
                path: TARGET_PATH,
                msg: TARGET_USER,
            };
            expect(validateSendAttachmentParams(params)).toBeUndefined();
        });
        it('should return undefined if no msg were passed', () => {
            const params = {
                rid: TARGET_RID,
                path: TARGET_PATH,
            };
            expect(validateSendAttachmentParams(params)).toBeUndefined();
        });
        it('should throw an Error if empty strings were passed as params', () => {
            const params = {
                rid: '',
                path: '',
            };
            expect(() => validateSendAttachmentParams(params)).toThrow();
        });
        it('should throw an Error if incorrect types were passed as params', () => {
            const params = {
                rid: 111,
                path: new Object(),
                msg: true,
            };
            // @ts-expect-error passed wrong type on purpose
            expect(() => validateSendAttachmentParams(params)).toThrow();
        });
    });

    describe('validateGetSettingsParam', () => {
        it('should return undefined if correct settings were passed', () => {
            const settings = [SettingsName.Accounts_AddGuestsToChats];
            expect(validateGetSettingsParam(settings)).toBeUndefined();
        });
        it('should return undefined if undefined were passed as settings array', () => {
            const settings = undefined;
            expect(validateGetSettingsParam(settings)).toBeUndefined();
        });
        it('should return undefined if empty array of settings was passed', () => {
            const settings: SettingsName[] = [];
            expect(validateGetSettingsParam(settings)).toBeUndefined();
        });
        it('should throw an Error if empty array of settings was passed', () => {
            const settings = ['Hello', 1234];
            // @ts-expect-error passed wrong type on purpose
            expect(() => validateGetSettingsParam(settings)).toThrow();
        });
    });
    describe('validateOnMessageParams', () => {
        it('should return undefined if correct settings were passed', () => {
            const params = {
                rid: 'ridExample',
                cb: noop,
            };
            expect(validateOnMessageParams(params)).toBeUndefined();
        });
        it('should return undefined if rid was not passed', () => {
            const params = {
                cb: noop,
            };
            expect(validateOnMessageParams(params)).toBeUndefined();
        });
        it('should throw an Error if incorrect types were passed as params', () => {
            const params = {
                rid: noop,
                cb: 'cbExample',
            };
            // @ts-expect-error passed wrong type on purpose
            expect(() => validateOnMessageParams(params)).toThrow();
        });
    });
    describe('validateOnRoomChangeParams', () => {
        it('should return undefined if correct settings were passed', () => {
            const params = {
                rid: 'ridExample',
                cb: noop,
            };
            expect(validateOnRoomChangeParams(params)).toBeUndefined();
        });
        it('should throw an Error if incorrect types were passed as params', () => {
            const params = {
                rid: noop,
                cb: 'cbExample',
            };
            // @ts-expect-error passed wrong type on purpose
            expect(() => validateOnRoomChangeParams(params)).toThrow();
        });
    });
    describe('validateOnReactionParams', () => {
        it('should return undefined if correct settings were passed', () => {
            const params = {
                rid: 'ridExample',
                msgId: 'msgIdExample',
                cb: noop,
            };
            expect(validateOnReactionParams(params)).toBeUndefined();
        });
        it('should throw an Error if msgId was not passed', () => {
            const params = {
                rid: 'ridExample',
                cb: noop,
            };
            // @ts-expect-error passed wrong type on purpose
            expect(() => validateOnReactionParams(params)).toThrow();
        });
        it('should throw an Error if incorrect types were passed as params', () => {
            const params = {
                rid: noop,
                cb: 'cbExample',
                msgId: 'msgIdExample',
            };
            // @ts-expect-error passed wrong type on purpose
            expect(() => validateOnReactionParams(params)).toThrow();
        });
    });
    describe('validateOnEventParams', () => {
        it('should return undefined if correct settings were passed', () => {
            expect(validateOnEventParams(noop)).toBeUndefined();
        });
        it('should throw an Error if incorrect types were passed as params', () => {
            // @ts-expect-error passed wrong type on purpose
            expect(() => validateOnEventParams('param')).toThrow();
        });
    });
    describe('validateSubscribeParams', () => {
        it('should return undefined if correct settings were passed', () => {
            const params = {
                collection: Collections.StreamNotifyUser,
                event: 'f9i0s9di0ve/typing',
            };
            expect(validateSubscribeParams(params)).toBeUndefined();
        });
        it('should throw an Error if collection is string', () => {
            const params = {
                collection: 'string',
                event: 'f9i0s9di0ve/typing',
            };
            // @ts-expect-error passed wrong type on purpose
            expect(() => validateSubscribeParams(params)).toThrow();
        });
        it('should throw an Error if incorrect types were passed as params', () => {
            const params = {
                event: 2,
                collection: 3,
            };
            // @ts-expect-error passed wrong type on purpose
            expect(() => validateSubscribeParams(params)).toThrow();
        });
    });
    describe('validateUnsubscribeParams', () => {
        it('should return undefined if correct settings were passed', () => {
            expect(validateUnsubscribeParams('idExample')).toBeUndefined();
        });

        it('should throw an Error if incorrect types were passed as params', () => {
            // @ts-expect-error passed wrong type on purpose
            expect(() => validateUnsubscribeParams(12345)).toThrow();
        });
    });
    describe('validateSendMessageToThread', () => {
        it('should return undefined if correct settings were passed', () => {
            const params = {
                msg: TARGET_USER,
                parentMessageId: TARGET_PARENT_MESSAGE_ID,
            };
            expect(validateSendMessageToThread(params)).toBeUndefined();
        });

        it('should throw an Error if empty tmid were passed in params', () => {
            const params = {
                msg: TARGET_USER,
                parentMessageId: '',
            };
            expect(() => validateSendMessageToThread(params)).toThrow();
        });
    });
    describe('validateReadThreadParam', () => {
        it('should return undefined if correct tmid were passed', () => {
            const tmid = TARGET_PARENT_MESSAGE_ID;
            expect(validateReadThreadParam(tmid)).toBeUndefined();
        });
        it('should throw an Error if empty tmid were passed as argument', () => {
            const tmid = '';
            expect(() => validateReadThreadParam(tmid)).toThrow();
        });
        it('should throw an Error if tmid of incorrect type were passed as argument', () => {
            const tmid = 12;
            // @ts-expect-error passed wrong type on purpose
            expect(() => validateReadThreadParam(tmid)).toThrow();
        });
    });
    describe('convertRelativeToAbsolute', () => {
        it('should return absolute path', () => {
            const relativePath = '../..';
            expect(convertRelativeToAbsolute(relativePath)).toBe(
                path.resolve(__dirname, '../../../../'),
            );
        });
        it('should return source path without any changes', () => {
            const absolutePath = path.resolve(__dirname);
            expect(convertRelativeToAbsolute(absolutePath)).toBe(absolutePath);
        });
    });
});
