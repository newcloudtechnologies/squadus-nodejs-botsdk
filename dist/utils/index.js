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
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertRelativeToAbsolute = exports.isPathValid = exports.msgIdFilter = exports.messageEventFilter = exports.ridFilter = exports.roomEventsFilter = exports.newLastMessageFilter = exports.validateReadThreadParam = exports.validateUnsubscribeParams = exports.validateSubscribeParams = exports.validateOnEventParams = exports.validateOnReactionParams = exports.validateOnRoomChangeParams = exports.validateOnMessageParams = exports.validateGetSettingsParam = exports.validateSendAttachmentParams = exports.validateSendMessageToThread = exports.validateSendMessageByRidParams = exports.validateRemoveUserFromChannelParams = exports.validateSetUserRoleParams = exports.validateUsernameParam = exports.validateSaveRoomSettingsParams = exports.validateCreatePrivateChannelParams = exports.validateCreateChannelParams = exports.validateCreatePublicChannelParams = exports.validateGetRoomInfoByRoomIdParams = exports.validateAddUseToRoomParams = void 0;
const path = __importStar(require("path"));
const utils_1 = require("@squadus/core/dist/wsClient/utils");
const lib_1 = require("../lib");
const types_1 = require("../lib/types");
const validators_1 = require("./validators");
const validateAddUseToRoomParams = (params) => {
    (0, validators_1.assertTypeEquality)();
    try {
        validators_1.zodAddUsersToRoomValidator.parse(params);
    }
    catch (validationError) {
        throw new types_1.RestClientError(lib_1.ErrorCode.InvalidArguments, validationError);
    }
};
exports.validateAddUseToRoomParams = validateAddUseToRoomParams;
function validateGetRoomInfoByRoomIdParams(params) {
    (0, validators_1.assertTypeEquality)();
    try {
        validators_1.zodGetRoomInfoByRoomIdValidator.parse(params);
    }
    catch (validationError) {
        throw new types_1.RestClientError(lib_1.ErrorCode.InvalidArguments, validationError);
    }
}
exports.validateGetRoomInfoByRoomIdParams = validateGetRoomInfoByRoomIdParams;
function validateCreatePublicChannelParams(params) {
    (0, validators_1.assertTypeEquality)();
    try {
        validators_1.zodCreatePublicChannelValidator.parse(params);
    }
    catch (validationError) {
        throw new types_1.RestClientError(lib_1.ErrorCode.InvalidArguments, validationError);
    }
}
exports.validateCreatePublicChannelParams = validateCreatePublicChannelParams;
function validateCreateChannelParams(isPrivate) {
    (0, validators_1.assertTypeEquality)();
    try {
        validators_1.zodCreateChannelValidator.parse({ isPrivate });
    }
    catch (validationError) {
        throw new types_1.RestClientError(lib_1.ErrorCode.InvalidArguments, validationError);
    }
}
exports.validateCreateChannelParams = validateCreateChannelParams;
function validateCreatePrivateChannelParams(params) {
    (0, validators_1.assertTypeEquality)();
    try {
        validators_1.zodCreatePrivateChannelValidator.parse(params);
    }
    catch (validationError) {
        throw new types_1.RestClientError(lib_1.ErrorCode.InvalidArguments, validationError);
    }
}
exports.validateCreatePrivateChannelParams = validateCreatePrivateChannelParams;
function validateSaveRoomSettingsParams(params) {
    (0, validators_1.assertTypeEquality)();
    try {
        validators_1.zodSaveRoomSettingsValidator.parse(params);
    }
    catch (validationError) {
        throw new types_1.RestClientError(lib_1.ErrorCode.InvalidArguments, validationError);
    }
}
exports.validateSaveRoomSettingsParams = validateSaveRoomSettingsParams;
function validateUsernameParam(username) {
    (0, validators_1.assertTypeEquality)();
    try {
        validators_1.zodUsernameValidator.parse(username);
    }
    catch (validationError) {
        throw new types_1.RestClientError(lib_1.ErrorCode.InvalidArguments, validationError);
    }
}
exports.validateUsernameParam = validateUsernameParam;
function validateSetUserRoleParams(params) {
    (0, validators_1.assertTypeEquality)();
    try {
        validators_1.zodSetUserRoleValidator.parse(params);
    }
    catch (validationError) {
        throw new types_1.RestClientError(lib_1.ErrorCode.InvalidArguments, validationError);
    }
}
exports.validateSetUserRoleParams = validateSetUserRoleParams;
function validateRemoveUserFromChannelParams(params) {
    (0, validators_1.assertTypeEquality)();
    try {
        validators_1.zodRemoveUserFromChannelValidator.parse(params);
    }
    catch (validationError) {
        throw new types_1.RestClientError(lib_1.ErrorCode.InvalidArguments, validationError);
    }
}
exports.validateRemoveUserFromChannelParams = validateRemoveUserFromChannelParams;
function validateSendMessageByRidParams(params) {
    (0, validators_1.assertTypeEquality)();
    try {
        validators_1.zodSendMessageByRidValidator.parse(params);
    }
    catch (validationError) {
        throw new types_1.RestClientError(lib_1.ErrorCode.InvalidArguments, validationError);
    }
}
exports.validateSendMessageByRidParams = validateSendMessageByRidParams;
function validateSendMessageToThread(params) {
    (0, validators_1.assertTypeEquality)();
    try {
        validators_1.zodSendMessageToThreadValidator.parse(params);
    }
    catch (validationError) {
        throw new types_1.RestClientError(lib_1.ErrorCode.InvalidArguments, validationError);
    }
}
exports.validateSendMessageToThread = validateSendMessageToThread;
function validateSendAttachmentParams(params) {
    (0, validators_1.assertTypeEquality)();
    try {
        validators_1.zodSendAttachmentValidator.parse(params);
    }
    catch (validationError) {
        throw new types_1.RestClientError(lib_1.ErrorCode.InvalidArguments, validationError);
    }
}
exports.validateSendAttachmentParams = validateSendAttachmentParams;
function validateGetSettingsParam(settings) {
    (0, validators_1.assertTypeEquality)();
    try {
        validators_1.zodGetSettingsValidator.parse(settings);
    }
    catch (validationError) {
        throw new types_1.RestClientError(lib_1.ErrorCode.InvalidArguments, validationError);
    }
}
exports.validateGetSettingsParam = validateGetSettingsParam;
function validateOnMessageParams(params) {
    (0, validators_1.assertTypeEquality)();
    try {
        validators_1.zodOnMessageValidator.parse(params);
    }
    catch (validationError) {
        throw new types_1.RestClientError(lib_1.ErrorCode.InvalidArguments, validationError);
    }
}
exports.validateOnMessageParams = validateOnMessageParams;
function validateOnRoomChangeParams(params) {
    (0, validators_1.assertTypeEquality)();
    try {
        validators_1.zodOnRoomChangeValidator.parse(params);
    }
    catch (validationError) {
        throw new types_1.RestClientError(lib_1.ErrorCode.InvalidArguments, validationError);
    }
}
exports.validateOnRoomChangeParams = validateOnRoomChangeParams;
function validateOnReactionParams(params) {
    (0, validators_1.assertTypeEquality)();
    try {
        validators_1.zodOnReactionValidator.parse(params);
    }
    catch (validationError) {
        throw new types_1.RestClientError(lib_1.ErrorCode.InvalidArguments, validationError);
    }
}
exports.validateOnReactionParams = validateOnReactionParams;
function validateOnEventParams(cb) {
    (0, validators_1.assertTypeEquality)();
    try {
        validators_1.zodOnEventValidator.parse(cb);
    }
    catch (validationError) {
        throw new types_1.RestClientError(lib_1.ErrorCode.InvalidArguments, validationError);
    }
}
exports.validateOnEventParams = validateOnEventParams;
function validateSubscribeParams(params) {
    (0, validators_1.assertTypeEquality)();
    try {
        validators_1.zodSubscribeValidator.parse(params);
    }
    catch (validationError) {
        throw new types_1.RestClientError(lib_1.ErrorCode.InvalidArguments, validationError);
    }
}
exports.validateSubscribeParams = validateSubscribeParams;
function validateUnsubscribeParams(id) {
    (0, validators_1.assertTypeEquality)();
    try {
        validators_1.zodUnsubscribeValidator.parse(id);
    }
    catch (validationError) {
        throw new types_1.RestClientError(lib_1.ErrorCode.InvalidArguments, validationError);
    }
}
exports.validateUnsubscribeParams = validateUnsubscribeParams;
function validateReadThreadParam(parentMessageId) {
    (0, validators_1.assertTypeEquality)();
    try {
        validators_1.zodReadThreadValidator.parse(parentMessageId);
    }
    catch (validationError) {
        throw new types_1.RestClientError(lib_1.ErrorCode.InvalidArguments, validationError);
    }
}
exports.validateReadThreadParam = validateReadThreadParam;
function newLastMessageFilter(userId, data) {
    if ((0, utils_1.isRoomsChangedEvent)(data)) {
        const msg = data.fields.args[1]?.lastMessage;
        const isNewLastMessage = msg?.u?._id !== userId && msg?.unread;
        return Boolean(isNewLastMessage);
    }
    return false;
}
exports.newLastMessageFilter = newLastMessageFilter;
const roomEventsFilter = (data) => {
    if ('collection' in data) {
        const { collection } = data;
        return (collection === types_1.Collections.StreamRoomMessages ||
            collection === types_1.Collections.StreamNotifyRoom);
    }
    else {
        return false;
    }
};
exports.roomEventsFilter = roomEventsFilter;
const ridFilter = (rid, data) => {
    const eventName = data.fields.eventName;
    return eventName.includes(rid);
};
exports.ridFilter = ridFilter;
const messageEventFilter = (data) => {
    const collection = data.collection;
    return collection === types_1.Collections.StreamRoomMessages;
};
exports.messageEventFilter = messageEventFilter;
const msgIdFilter = (msgId, data) => {
    const message = data.fields.args[0];
    return msgId === message._id;
};
exports.msgIdFilter = msgIdFilter;
const isPathValid = (attachmentPath, allowedPath) => {
    const allowedAbsolutePath = (0, exports.convertRelativeToAbsolute)(allowedPath);
    const attachmentAbsolutePath = (0, exports.convertRelativeToAbsolute)(attachmentPath);
    return attachmentAbsolutePath.startsWith(allowedAbsolutePath);
};
exports.isPathValid = isPathValid;
const convertRelativeToAbsolute = (pathToConvert) => {
    if (path.isAbsolute(pathToConvert)) {
        return pathToConvert;
    }
    return path.resolve(process.cwd(), pathToConvert);
};
exports.convertRelativeToAbsolute = convertRelativeToAbsolute;
//# sourceMappingURL=index.js.map