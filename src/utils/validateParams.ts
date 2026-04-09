/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2026
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */

import { ErrorCode } from '../lib/constants';
import {
    AddUsersToRoomRequestParams,
    CreatePrivateChannelSDKParams,
    CreatePublicChannelSDKParams,
    RestClientError,
    SaveRoomSettingsSDKParams,
    SetUserRoleSDKParams,
    WsData,
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
    ZodEmailType,
    zodEmailValidator,
} from './validators';

export function validateAddUsersToRoomParams(
    params: AddUsersToRoomRequestParams,
): void {
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
}

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

export function validateEmailParam(email: string): void {
    assertTypeEquality<TypeEqualityGuard<ZodEmailType, string>>();
    try {
        zodEmailValidator.parse(email);
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

export function validateGetSettingsParam(
    settings?: Array<SettingsName>,
    server?: string,
): void {
    assertTypeEquality<
        TypeEqualityGuard<
            ZodGetSettingsValidatorType,
            { settings?: Array<SettingsName>; server?: string }
        >
    >();
    try {
        zodGetSettingsValidator.parse({ settings, server });
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
        throw new RestClientError(ErrorCode.InvalidArguments, validationError);
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
        throw new RestClientError(ErrorCode.InvalidArguments, validationError);
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
        throw new RestClientError(ErrorCode.InvalidArguments, validationError);
    }
}

export function validateOnEventParams(cb: (event: WsData) => void): void {
    assertTypeEquality<
        TypeEqualityGuard<ZodOnEventValidatorType, (event: WsData) => void>
    >();
    try {
        zodOnEventValidator.parse(cb);
    } catch (validationError) {
        throw new RestClientError(ErrorCode.InvalidArguments, validationError);
    }
}

export function validateSubscribeParams(params: ValidateSubscribeParams): void {
    assertTypeEquality<
        TypeEqualityGuard<ZodSubscribeValidatorType, ValidateSubscribeParams>
    >();
    try {
        zodSubscribeValidator.parse(params);
    } catch (validationError) {
        throw new RestClientError(ErrorCode.InvalidArguments, validationError);
    }
}

export function validateUnsubscribeParams(id: string): void {
    assertTypeEquality<
        TypeEqualityGuard<ZodUnsubscribeValidatorType, string>
    >();
    try {
        zodUnsubscribeValidator.parse(id);
    } catch (validationError) {
        throw new RestClientError(ErrorCode.InvalidArguments, validationError);
    }
}

export function validateReadThreadParam(parentMessageId: string): void {
    assertTypeEquality<TypeEqualityGuard<ZodReadThreadValidatorType, string>>();
    try {
        zodReadThreadValidator.parse(parentMessageId);
    } catch (validationError) {
        throw new RestClientError(ErrorCode.InvalidArguments, validationError);
    }
}
