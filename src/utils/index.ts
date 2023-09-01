/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */

import * as path from 'path';

import { isRoomsChangedEvent } from '@squadus/core/dist/wsClient/utils';

import { ErrorCode } from '../lib';
import {
    AddUsersToRoomRequestParams,
    CreatePrivateChannelSDKParams,
    CreatePublicChannelSDKParams,
    RestClientError,
    SaveRoomSettingsSDKParams,
    SetUserRoleSDKParams,
    WsData,
    RoomsChangedEvent,
    RoomEvent,
    Collections,
    RoomMessageEvent,
    ErrorData,
    GetRoomInfoByRoomIdRequestParams,
    IsPrivateType,
    RemoveUserFromChannelSDKParams,
    SendMessageByRidSDKParams,
    SendAttachmentSDKParams,
    SettingsName,
    ValidateOnRoomChangeParams,
    ValidateOnMessageParams,
    ValidateSubscribeParams,
    ValidateOnReactionParams,
    SendMessageToThreadSDKParams,
} from '../lib/types';
import {
    assertTypeEquality,
    TypeEqualityGuard,
    zodCreatePublicChannelValidator,
    ZodCreatePublicChannelValidatorType,
    zodSaveRoomSettingsValidator,
    ZodSaveRoomSettingsValidatorType,
    zodSetUserRoleValidator,
    ZodSetUserRoleValidatorType,
    zodAddUsersToRoomValidator,
    ZodAddUsersToRoomValidatorType,
    zodCreateChannelValidator,
    ZodCreateChannelValidatorType,
    ZodUsernameType,
    zodUsernameValidator,
    zodCreatePrivateChannelValidator,
    ZodCreatePrivateChannelValidatorType,
    zodGetRoomInfoByRoomIdValidator,
    ZodGetRoomInfoByRoomIdValidatorType,
    zodRemoveUserFromChannelValidator,
    ZodRemoveUserFromChannelValidatorType,
    zodSendMessageByRidValidator,
    ZodSendMessageByRidValidatorType,
    zodSendAttachmentValidator,
    ZodSendAttachmentValidatorType,
    ZodGetSettingsValidatorType,
    zodGetSettingsValidator,
    zodOnMessageValidator,
    ZodOnMessageValidatorType,
    ZodOnRoomChangeValidatorType,
    zodOnRoomChangeValidator,
    zodOnReactionValidator,
    ZodOnReactionValidatorType,
    zodOnEventValidator,
    ZodOnEventValidatorType,
    zodSubscribeValidator,
    ZodSubscribeValidatorType,
    ZodUnsubscribeValidatorType,
    zodUnsubscribeValidator,
    zodSendMessageToThreadValidator,
    ZodSendMessageToThreadValidatorType,
    zodReadThreadValidator,
    ZodReadThreadValidatorType,
} from './validators';

export const validateAddUseToRoomParams = (
    params: AddUsersToRoomRequestParams,
): void => {
    assertTypeEquality<
        TypeEqualityGuard<
            ZodAddUsersToRoomValidatorType,
            AddUsersToRoomRequestParams
        >
    >();
    try {
        zodAddUsersToRoomValidator.parse(params);
    } catch (validationError) {
        throw new RestClientError(ErrorCode.InvalidArguments, validationError);
    }
};

export function validateGetRoomInfoByRoomIdParams(
    params: GetRoomInfoByRoomIdRequestParams,
): void {
    assertTypeEquality<
        TypeEqualityGuard<
            ZodGetRoomInfoByRoomIdValidatorType,
            GetRoomInfoByRoomIdRequestParams
        >
    >();
    try {
        zodGetRoomInfoByRoomIdValidator.parse(params);
    } catch (validationError) {
        throw new RestClientError(ErrorCode.InvalidArguments, validationError);
    }
}

export function validateCreatePublicChannelParams(
    params: CreatePublicChannelSDKParams,
): void {
    assertTypeEquality<
        TypeEqualityGuard<
            ZodCreatePublicChannelValidatorType,
            CreatePublicChannelSDKParams
        >
    >();
    try {
        zodCreatePublicChannelValidator.parse(params);
    } catch (validationError) {
        throw new RestClientError(ErrorCode.InvalidArguments, validationError);
    }
}

export function validateCreateChannelParams(isPrivate: IsPrivateType): void {
    assertTypeEquality<
        TypeEqualityGuard<ZodCreateChannelValidatorType, IsPrivateType>
    >();
    try {
        zodCreateChannelValidator.parse({ isPrivate });
    } catch (validationError) {
        throw new RestClientError(ErrorCode.InvalidArguments, validationError);
    }
}

export function validateCreatePrivateChannelParams(
    params: CreatePrivateChannelSDKParams,
): void {
    assertTypeEquality<
        TypeEqualityGuard<
            ZodCreatePrivateChannelValidatorType,
            CreatePrivateChannelSDKParams
        >
    >();
    try {
        zodCreatePrivateChannelValidator.parse(params);
    } catch (validationError) {
        throw new RestClientError(ErrorCode.InvalidArguments, validationError);
    }
}

export function validateSaveRoomSettingsParams(
    params: SaveRoomSettingsSDKParams,
): void {
    assertTypeEquality<
        TypeEqualityGuard<
            ZodSaveRoomSettingsValidatorType,
            SaveRoomSettingsSDKParams
        >
    >();
    try {
        zodSaveRoomSettingsValidator.parse(params);
    } catch (validationError) {
        throw new RestClientError(ErrorCode.InvalidArguments, validationError);
    }
}

export function validateUsernameParam(username: string): void {
    assertTypeEquality<TypeEqualityGuard<ZodUsernameType, string>>();
    try {
        zodUsernameValidator.parse(username);
    } catch (validationError) {
        throw new RestClientError(ErrorCode.InvalidArguments, validationError);
    }
}

export function validateSetUserRoleParams(params: SetUserRoleSDKParams): void {
    assertTypeEquality<
        TypeEqualityGuard<ZodSetUserRoleValidatorType, SetUserRoleSDKParams>
    >();
    try {
        zodSetUserRoleValidator.parse(params);
    } catch (validationError) {
        throw new RestClientError(ErrorCode.InvalidArguments, validationError);
    }
}

export function validateRemoveUserFromChannelParams(
    params: RemoveUserFromChannelSDKParams,
): void {
    assertTypeEquality<
        TypeEqualityGuard<
            ZodRemoveUserFromChannelValidatorType,
            RemoveUserFromChannelSDKParams
        >
    >();
    try {
        zodRemoveUserFromChannelValidator.parse(params);
    } catch (validationError) {
        throw new RestClientError(ErrorCode.InvalidArguments, validationError);
    }
}

export function validateSendMessageByRidParams(
    params: SendMessageByRidSDKParams,
): void {
    assertTypeEquality<
        TypeEqualityGuard<
            ZodSendMessageByRidValidatorType,
            SendMessageByRidSDKParams
        >
    >();
    try {
        zodSendMessageByRidValidator.parse(params);
    } catch (validationError) {
        throw new RestClientError(ErrorCode.InvalidArguments, validationError);
    }
}

export function validateSendMessageToThread(
    params: SendMessageToThreadSDKParams,
): void {
    assertTypeEquality<
        TypeEqualityGuard<
            ZodSendMessageToThreadValidatorType,
            SendMessageToThreadSDKParams
        >
    >();
    try {
        zodSendMessageToThreadValidator.parse(params);
    } catch (validationError) {
        throw new RestClientError(ErrorCode.InvalidArguments, validationError);
    }
}

export function validateSendAttachmentParams(
    params: SendAttachmentSDKParams,
): void {
    assertTypeEquality<
        TypeEqualityGuard<
            ZodSendAttachmentValidatorType,
            SendAttachmentSDKParams
        >
    >();
    try {
        zodSendAttachmentValidator.parse(params);
    } catch (validationError) {
        throw new RestClientError(ErrorCode.InvalidArguments, validationError);
    }
}

export function validateGetSettingsParam(settings?: Array<SettingsName>): void {
    assertTypeEquality<
        TypeEqualityGuard<
            ZodGetSettingsValidatorType,
            Array<SettingsName> | undefined
        >
    >();
    try {
        zodGetSettingsValidator.parse(settings);
    } catch (validationError) {
        throw new RestClientError(ErrorCode.InvalidArguments, validationError);
    }
}

export function validateOnMessageParams(params: ValidateOnMessageParams): void {
    assertTypeEquality<
        TypeEqualityGuard<ZodOnMessageValidatorType, ValidateOnMessageParams>
    >();
    try {
        zodOnMessageValidator.parse(params);
    } catch (validationError) {
        throw new RestClientError(
            ErrorCode.InvalidArguments,
            validationError as ErrorData,
        );
    }
}

export function validateOnRoomChangeParams(
    params: ValidateOnRoomChangeParams,
): void {
    assertTypeEquality<
        TypeEqualityGuard<
            ZodOnRoomChangeValidatorType,
            ValidateOnRoomChangeParams
        >
    >();
    try {
        zodOnRoomChangeValidator.parse(params);
    } catch (validationError) {
        throw new RestClientError(
            ErrorCode.InvalidArguments,
            validationError as ErrorData,
        );
    }
}

export function validateOnReactionParams(
    params: ValidateOnReactionParams,
): void {
    assertTypeEquality<
        TypeEqualityGuard<ZodOnReactionValidatorType, ValidateOnReactionParams>
    >();
    try {
        zodOnReactionValidator.parse(params);
    } catch (validationError) {
        throw new RestClientError(
            ErrorCode.InvalidArguments,
            validationError as ErrorData,
        );
    }
}

export function validateOnEventParams(cb: (event: WsData) => void): void {
    assertTypeEquality<
        TypeEqualityGuard<ZodOnEventValidatorType, (event: WsData) => void>
    >();
    try {
        zodOnEventValidator.parse(cb);
    } catch (validationError) {
        throw new RestClientError(
            ErrorCode.InvalidArguments,
            validationError as ErrorData,
        );
    }
}

export function validateSubscribeParams(params: ValidateSubscribeParams): void {
    assertTypeEquality<
        TypeEqualityGuard<ZodSubscribeValidatorType, ValidateSubscribeParams>
    >();
    try {
        zodSubscribeValidator.parse(params);
    } catch (validationError) {
        throw new RestClientError(
            ErrorCode.InvalidArguments,
            validationError as ErrorData,
        );
    }
}

export function validateUnsubscribeParams(id: string): void {
    assertTypeEquality<
        TypeEqualityGuard<ZodUnsubscribeValidatorType, string>
    >();
    try {
        zodUnsubscribeValidator.parse(id);
    } catch (validationError) {
        throw new RestClientError(
            ErrorCode.InvalidArguments,
            validationError as ErrorData,
        );
    }
}

export function validateReadThreadParam(parentMessageId: string): void {
    assertTypeEquality<TypeEqualityGuard<ZodReadThreadValidatorType, string>>();
    try {
        zodReadThreadValidator.parse(parentMessageId);
    } catch (validationError) {
        throw new RestClientError(
            ErrorCode.InvalidArguments,
            validationError as ErrorData,
        );
    }
}

export function newLastMessageFilter(
    userId: string,
    data: WsData,
): data is RoomsChangedEvent {
    if (isRoomsChangedEvent(data)) {
        const msg = data.fields.args[1]?.lastMessage;
        const isNewLastMessage = msg?.u?._id !== userId && msg?.unread;
        return Boolean(isNewLastMessage);
    }
    return false;
}

export const roomEventsFilter = (data: WsData): data is RoomEvent => {
    if ('collection' in data) {
        const { collection } = data;
        return (
            collection === Collections.StreamRoomMessages ||
            collection === Collections.StreamNotifyRoom
        );
    } else {
        return false;
    }
};

export const ridFilter = (rid: string, data: RoomEvent): boolean => {
    const eventName = data.fields.eventName;
    return eventName.includes(rid);
};

export const messageEventFilter = (
    data: RoomEvent,
): data is RoomMessageEvent => {
    const collection = data.collection as string;
    return collection === Collections.StreamRoomMessages;
};

export const msgIdFilter = (msgId: string, data: RoomMessageEvent): boolean => {
    const message = data.fields.args[0];
    return msgId === message._id;
};

export const isPathValid = (
    attachmentPath: string,
    allowedPath: string,
): boolean => {
    const allowedAbsolutePath = convertRelativeToAbsolute(allowedPath);
    const attachmentAbsolutePath = convertRelativeToAbsolute(attachmentPath);
    return attachmentAbsolutePath.startsWith(allowedAbsolutePath);
};

export const convertRelativeToAbsolute = (pathToConvert: string): string => {
    if (path.isAbsolute(pathToConvert)) {
        return pathToConvert;
    }
    return path.resolve(process.cwd(), pathToConvert);
};
