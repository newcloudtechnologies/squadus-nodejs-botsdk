"use strict";
/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const noop_1 = __importDefault(require("lodash/noop"));
const types_1 = require("../lib/types");
const _1 = require(".");
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
            expect((0, _1.validateAddUseToRoomParams)(params)).toBeUndefined();
        });
        it('should throw an Error if rid was empty string', () => {
            const params = { users: [TARGET_USER], rid: '' };
            expect(() => (0, _1.validateAddUseToRoomParams)(params)).toThrow();
        });
        it('should throw an Error if empty users array was passed', () => {
            const params = { users: [1], rid: TARGET_RID };
            // @ts-expect-error passed wrong type on purpose
            expect(() => (0, _1.validateAddUseToRoomParams)(params)).toThrow();
        });
    });
    describe('validateCreatePrivateChannelArguments', () => {
        it('should return undefined if valid params were passed', () => {
            const correctParams = {
                name: CHANNEL_NAME,
                members: [],
                isPrivate: true,
                readOnly: false,
                encrypted: false,
            };
            expect((0, _1.validateCreatePrivateChannelParams)(correctParams)).toBeUndefined();
        });
        it('should throw an Error if empty string was passed to teamId', () => {
            const correctParams = {
                name: CHANNEL_NAME,
                members: [],
                isPrivate: true,
                readOnly: false,
                encrypted: false,
                teamId: '',
            };
            expect(() => (0, _1.validateCreatePrivateChannelParams)(correctParams)).toThrow();
        });
        it('should throw an Error if empty string was passed as member', () => {
            const correctParams = {
                name: CHANNEL_NAME,
                members: [''],
                isPrivate: true,
                readOnly: false,
                encrypted: false,
            };
            expect(() => (0, _1.validateCreatePrivateChannelParams)(correctParams)).toThrow();
        });
    });
    describe('validateCreatePublicChannelParams', () => {
        it('should return undefined if only name is passed', () => {
            const correctParams = {
                name: CHANNEL_NAME,
            };
            expect((0, _1.validateCreatePublicChannelParams)(correctParams)).toBeUndefined();
        });
        it('should throw an Error if members element is wrong type', () => {
            const correctParams = {
                name: CHANNEL_NAME,
                members: [5, '1'],
            };
            expect(() => 
            // @ts-expect-error passed wrong type on purpose
            (0, _1.validateCreatePublicChannelParams)(correctParams)).toThrow();
        });
        it('should throw an Error if readOnly is null', () => {
            const correctParams = {
                name: CHANNEL_NAME,
                readOnly: null,
            };
            expect(() => 
            // @ts-expect-error passed wrong type on purpose
            (0, _1.validateCreatePublicChannelParams)(correctParams)).toThrow();
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
                    types_1.SystemMessages.UserJoin,
                    types_1.SystemMessages.UserAdded,
                ],
                joinCode: TARGET_JOIN_CODE,
                reactWhenReadOnly: false,
                encrypted: false,
            };
            expect((0, _1.validateSaveRoomSettingsParams)(correctParams)).toBeUndefined();
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
            expect(() => (0, _1.validateSaveRoomSettingsParams)(correctParams)).toThrow();
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
            expect(() => (0, _1.validateSaveRoomSettingsParams)(correctParams)).toThrow();
        });
    });
    describe('validateSetUserRoleParams', () => {
        it('should return undefined on correct params', () => {
            const params = {
                roomId: TARGET_RID,
                userId: TARGET_USER,
                roleName: types_1.RoleName.Leader,
                roleValue: true,
            };
            expect((0, _1.validateSetUserRoleParams)(params)).toBeUndefined();
        });
        it('should throw an Error if empty roomId passed', () => {
            const params = {
                roomId: '',
                userId: TARGET_USER,
                roleName: types_1.RoleName.Leader,
                roleValue: true,
            };
            expect(() => (0, _1.validateSetUserRoleParams)(params)).toThrow();
        });
        it('should throw an Error if empty userId passed', () => {
            const params = {
                roomId: TARGET_RID,
                userId: '',
                roleName: types_1.RoleName.Leader,
                roleValue: true,
            };
            expect(() => (0, _1.validateSetUserRoleParams)(params)).toThrow();
        });
    });
    describe('validateGetRoomInfoByRoomIdParams', () => {
        it('should return undefined on correct params', () => {
            const params = {
                rid: TARGET_RID,
            };
            expect((0, _1.validateGetRoomInfoByRoomIdParams)(params)).toBeUndefined();
        });
        it('should throw an Error if empty rid was passed', () => {
            const params = {
                rid: '',
            };
            expect(() => (0, _1.validateGetRoomInfoByRoomIdParams)(params)).toThrow();
        });
        it('should throw an Error if number was passed to rid', () => {
            const params = {
                rid: 123,
            };
            // @ts-expect-error passed wrong type on purpose
            expect(() => (0, _1.validateGetRoomInfoByRoomIdParams)(params)).toThrow();
        });
    });
    describe('validateCreateChannelParams', () => {
        it('should return undefined if isPrivate is false', () => {
            const isPrivate = false;
            expect((0, _1.validateCreateChannelParams)(isPrivate)).toBeUndefined();
        });
        it('should return undefined if isPrivate is true', () => {
            const isPrivate = true;
            expect((0, _1.validateCreateChannelParams)(isPrivate)).toBeUndefined();
        });
        it('should return undefined if isPrivate is undefined', () => {
            const isPrivate = undefined;
            expect((0, _1.validateCreateChannelParams)(isPrivate)).toBeUndefined();
        });
        it('should throw an Error if isPrivate is string', () => {
            const isPrivate = '';
            expect(() => (0, _1.validateCreateChannelParams)(isPrivate)).toThrow();
        });
    });
    describe('validateUsernameParam', () => {
        it('should return undefined if correct username was passed', () => {
            const username = TARGET_USER;
            expect((0, _1.validateUsernameParam)(username)).toBeUndefined();
        });
        it('should throw an Error if empty string was passed as username', () => {
            const username = '';
            expect(() => (0, _1.validateUsernameParam)(username)).toThrow();
        });
        it('should throw an Error if empty string was passed as username', () => {
            const username = 12842;
            // @ts-expect-error passed wrong type on purpose
            expect(() => (0, _1.validateUsernameParam)(username)).toThrow();
        });
    });
    describe('validateRemoveUserFromChannelParams', () => {
        it('should return undefined if correct params were passed', () => {
            const params = {
                rid: TARGET_RID,
                username: TARGET_USER,
            };
            expect((0, _1.validateRemoveUserFromChannelParams)(params)).toBeUndefined();
        });
        it('should throw an Error if empty params were passed as username', () => {
            const params = {
                rid: '',
                username: '',
            };
            expect(() => (0, _1.validateRemoveUserFromChannelParams)(params)).toThrow();
        });
        it('should throw an Error if incorrect types were passed as params', () => {
            const params = {
                rid: 111,
                username: true,
            };
            // @ts-expect-error passed wrong type on purpose
            expect(() => (0, _1.validateRemoveUserFromChannelParams)(params)).toThrow();
        });
    });
    describe('validateSendMessageByRidParams', () => {
        it('should return undefined if correct params were passed', () => {
            const params = {
                rid: TARGET_RID,
                msg: TARGET_USER,
            };
            expect((0, _1.validateSendMessageByRidParams)(params)).toBeUndefined();
        });
        it('should throw an Error if empty strings were passed as params', () => {
            const params = {
                rid: '',
                msg: '',
            };
            expect(() => (0, _1.validateSendMessageByRidParams)(params)).toThrow();
        });
        it('should throw an Error if incorrect types were passed as params', () => {
            const params = {
                rid: 111,
                msg: true,
            };
            // @ts-expect-error passed wrong type on purpose
            expect(() => (0, _1.validateSendMessageByRidParams)(params)).toThrow();
        });
    });
    describe('validateSendAttachmentParams', () => {
        it('should return undefined if correct params were passed', () => {
            const params = {
                rid: TARGET_RID,
                path: TARGET_PATH,
                msg: TARGET_USER,
            };
            expect((0, _1.validateSendAttachmentParams)(params)).toBeUndefined();
        });
        it('should return undefined if no msg were passed', () => {
            const params = {
                rid: TARGET_RID,
                path: TARGET_PATH,
            };
            expect((0, _1.validateSendAttachmentParams)(params)).toBeUndefined();
        });
        it('should throw an Error if empty strings were passed as params', () => {
            const params = {
                rid: '',
                path: '',
            };
            expect(() => (0, _1.validateSendAttachmentParams)(params)).toThrow();
        });
        it('should throw an Error if incorrect types were passed as params', () => {
            const params = {
                rid: 111,
                path: new Object(),
                msg: true,
            };
            // @ts-expect-error passed wrong type on purpose
            expect(() => (0, _1.validateSendAttachmentParams)(params)).toThrow();
        });
    });
    describe('validateGetSettingsParam', () => {
        it('should return undefined if correct settings were passed', () => {
            const settings = [types_1.SettingsName.Accounts_AddGuestsToChats];
            expect((0, _1.validateGetSettingsParam)(settings)).toBeUndefined();
        });
        it('should return undefined if undefined were passed as settings array', () => {
            const settings = undefined;
            expect((0, _1.validateGetSettingsParam)(settings)).toBeUndefined();
        });
        it('should return undefined if empty array of settings was passed', () => {
            const settings = [];
            expect((0, _1.validateGetSettingsParam)(settings)).toBeUndefined();
        });
        it('should throw an Error if empty array of settings was passed', () => {
            const settings = ['Hello', 1234];
            // @ts-expect-error passed wrong type on purpose
            expect(() => (0, _1.validateGetSettingsParam)(settings)).toThrow();
        });
    });
    describe('validateOnMessageParams', () => {
        it('should return undefined if correct settings were passed', () => {
            const params = {
                rid: 'ridExample',
                cb: noop_1.default,
            };
            expect((0, _1.validateOnMessageParams)(params)).toBeUndefined();
        });
        it('should return undefined if rid was not passed', () => {
            const params = {
                cb: noop_1.default,
            };
            expect((0, _1.validateOnMessageParams)(params)).toBeUndefined();
        });
        it('should throw an Error if incorrect types were passed as params', () => {
            const params = {
                rid: noop_1.default,
                cb: 'cbExample',
            };
            // @ts-expect-error passed wrong type on purpose
            expect(() => (0, _1.validateOnMessageParams)(params)).toThrow();
        });
    });
    describe('validateOnRoomChangeParams', () => {
        it('should return undefined if correct settings were passed', () => {
            const params = {
                rid: 'ridExample',
                cb: noop_1.default,
            };
            expect((0, _1.validateOnRoomChangeParams)(params)).toBeUndefined();
        });
        it('should throw an Error if incorrect types were passed as params', () => {
            const params = {
                rid: noop_1.default,
                cb: 'cbExample',
            };
            // @ts-expect-error passed wrong type on purpose
            expect(() => (0, _1.validateOnRoomChangeParams)(params)).toThrow();
        });
    });
    describe('validateOnReactionParams', () => {
        it('should return undefined if correct settings were passed', () => {
            const params = {
                rid: 'ridExample',
                msgId: 'msgIdExample',
                cb: noop_1.default,
            };
            expect((0, _1.validateOnReactionParams)(params)).toBeUndefined();
        });
        it('should throw an Error if msgId was not passed', () => {
            const params = {
                rid: 'ridExample',
                cb: noop_1.default,
            };
            // @ts-expect-error passed wrong type on purpose
            expect(() => (0, _1.validateOnReactionParams)(params)).toThrow();
        });
        it('should throw an Error if incorrect types were passed as params', () => {
            const params = {
                rid: noop_1.default,
                cb: 'cbExample',
                msgId: 'msgIdExample',
            };
            // @ts-expect-error passed wrong type on purpose
            expect(() => (0, _1.validateOnReactionParams)(params)).toThrow();
        });
    });
    describe('validateOnEventParams', () => {
        it('should return undefined if correct settings were passed', () => {
            expect((0, _1.validateOnEventParams)(noop_1.default)).toBeUndefined();
        });
        it('should throw an Error if incorrect types were passed as params', () => {
            // @ts-expect-error passed wrong type on purpose
            expect(() => (0, _1.validateOnEventParams)('param')).toThrow();
        });
    });
    describe('validateSubscribeParams', () => {
        it('should return undefined if correct settings were passed', () => {
            const params = {
                collection: types_1.Collections.StreamNotifyUser,
                event: 'f9i0s9di0ve/typing',
            };
            expect((0, _1.validateSubscribeParams)(params)).toBeUndefined();
        });
        it('should throw an Error if collection is string', () => {
            const params = {
                collection: 'string',
                event: 'f9i0s9di0ve/typing',
            };
            // @ts-expect-error passed wrong type on purpose
            expect(() => (0, _1.validateSubscribeParams)(params)).toThrow();
        });
        it('should throw an Error if incorrect types were passed as params', () => {
            const params = {
                event: 2,
                collection: 3,
            };
            // @ts-expect-error passed wrong type on purpose
            expect(() => (0, _1.validateSubscribeParams)(params)).toThrow();
        });
    });
    describe('validateUnsubscribeParams', () => {
        it('should return undefined if correct settings were passed', () => {
            expect((0, _1.validateUnsubscribeParams)('idExample')).toBeUndefined();
        });
        it('should throw an Error if incorrect types were passed as params', () => {
            // @ts-expect-error passed wrong type on purpose
            expect(() => (0, _1.validateUnsubscribeParams)(12345)).toThrow();
        });
    });
    describe('validateSendMessageToThread', () => {
        it('should return undefined if correct settings were passed', () => {
            const params = {
                msg: TARGET_USER,
                parentMessageId: TARGET_PARENT_MESSAGE_ID,
            };
            expect((0, _1.validateSendMessageToThread)(params)).toBeUndefined();
        });
        it('should throw an Error if empty tmid were passed in params', () => {
            const params = {
                msg: TARGET_USER,
                parentMessageId: '',
            };
            expect(() => (0, _1.validateSendMessageToThread)(params)).toThrow();
        });
    });
    describe('validateReadThreadParam', () => {
        it('should return undefined if correct tmid were passed', () => {
            const tmid = TARGET_PARENT_MESSAGE_ID;
            expect((0, _1.validateReadThreadParam)(tmid)).toBeUndefined();
        });
        it('should throw an Error if empty tmid were passed as argument', () => {
            const tmid = '';
            expect(() => (0, _1.validateReadThreadParam)(tmid)).toThrow();
        });
        it('should throw an Error if tmid of incorrect type were passed as argument', () => {
            const tmid = 12;
            // @ts-expect-error passed wrong type on purpose
            expect(() => (0, _1.validateReadThreadParam)(tmid)).toThrow();
        });
    });
    describe('convertRelativeToAbsolute', () => {
        it('should return absolute path', () => {
            const relativePath = '../..';
            expect((0, _1.convertRelativeToAbsolute)(relativePath)).toBe(path.resolve(__dirname, '../../../../'));
        });
        it('should return source path without any changes', () => {
            const absolutePath = path.resolve(__dirname);
            expect((0, _1.convertRelativeToAbsolute)(absolutePath)).toBe(absolutePath);
        });
    });
});
//# sourceMappingURL=utils.test.js.map