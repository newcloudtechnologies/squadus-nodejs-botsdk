/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */

import {
    CreatePublicChannelRequestParams,
    CreatePrivateChannelRequestParams,
    SetUserRoleRequestParams,
    SaveRoomSettingsRequestParams,
    RemoveUserFromChannelRequestParams,
    SendMessageByRidParams,
    SendMessageToThreadParams,
} from '@squadus/core/dist/restClient/types';
import { LastMessage, Message } from '@squadus/core/dist/models';
import { RoomEvent, WsSubscription } from '@squadus/core/dist/wsClient/types';
import { Collections } from '@squadus/core/dist/wsClient/constants';

export {
    SystemMessages,
    RoomType,
    Settings,
    SettingsName,
} from '@squadus/core/dist/constants';

export { ErrorData } from '@squadus/core/dist/restClient/errorHandlers';

export {
    AddUsersToRoomRequestParams,
    CreatePublicChannelRequestParams,
    CreatePrivateChannelRequestParams,
    CreatePublicChannelResponse as CreatePublicChannelResponseData,
    CreatePrivateChannelResponse as CreatePrivateChannelResponseData,
    DirectRoomData as DirectRoomResponseData,
    GetRoomInfoResponse as GetRoomInfoResponseData,
    GetRoomInfoByRoomIdRequestParams,
    RemoveUserFromChannelRequestParams,
    RemoveUserFromChannelResponse as RemoveUserFromChannelResponseData,
    RestResponse,
    RoomTypeForApi,
    SaveRoomSettingsData as SaveRoomSettingsResponseData,
    SaveRoomSettingsRequestParams,
    SendMessageRequestParams as SendMessageRequestSDKParams,
    SettingsData as SettingsResponseData,
    SetUserRoleRequestParams,
    SetUserRoleResponse as SetUserRoleResponseData,
    RoleName,
    UserResponse as UserResponseData,
    ChannelRoomType,
} from '@squadus/core/dist/restClient/types';

export {
    SubscriptionData,
    RoomsChangedEvent,
    WsData,
    WsSubscription,
    RoomEvent,
    RoomMessageEvent,
    RoomTypingEvent,
    UnsubscribeResponseData,
    LoginParams,
    LoginResult,
} from '@squadus/core/dist/wsClient/types';

export { Collections, Status } from '@squadus/core/dist/wsClient/constants';
export { RestClientError } from '@squadus/core/dist/restClient/errorHandlers';

export type SendAttachmentSDKParams = {
    rid: string;
    path: string;
    msg?: string;
};

type RequiredChannelParams = Pick<CreatePublicChannelRequestParams, 'name'>;

type PublicChannelIsPrivateParameterType = {
    isPrivate?: false;
};

type PrivateChannelIsPrivateParameterType = {
    isPrivate: true;
};

export type IsPrivateType =
    | PublicChannelIsPrivateParameterType
    | PrivateChannelIsPrivateParameterType;

export type CreatePublicChannelSDKParams =
    Partial<CreatePublicChannelRequestParams> &
        RequiredChannelParams &
        PublicChannelIsPrivateParameterType;

export type CreatePrivateChannelSDKParams =
    Partial<CreatePrivateChannelRequestParams> &
        RequiredChannelParams &
        PrivateChannelIsPrivateParameterType;

export type ClientParams = {
    token: string;
    server: string;
    allowedAttachmentsPath?: string;
};

export type SetUserRoleSDKParams = Omit<SetUserRoleRequestParams, 't'>;

export type SaveRoomSettingsSDKParams = Omit<
    SaveRoomSettingsRequestParams,
    'roomType'
> & {
    isPrivate?: boolean;
};

export type SendMessageByRidSDKParams = SendMessageByRidParams;

type Rename<T, K extends keyof T, N extends string> = Pick<
    T,
    Exclude<keyof T, K>
> & { [P in N]: T[K] };

export type SendMessageToThreadSDKParams = Rename<
    SendMessageToThreadParams,
    'tmid',
    'parentMessageId'
>;

export type CreateDirectRoomSDKParams = {
    username: string;
};

export type RemoveUserFromChannelSDKParams = Omit<
    RemoveUserFromChannelRequestParams,
    'roomType'
>;

export type OnMessagesResponse = {
    unsubscribe: () => Promise<void>;
};

export type OnRoomChangeResponse = {
    unsubscribe: () => Promise<void>;
};

export type OnReactionResponse = {
    unsubscribe: () => Promise<void>;
};

export type ValidateOnRoomChangeParams = {
    cb: (event: RoomEvent) => void;
    rid: string;
};

export type ValidateOnMessageParams = {
    cb: (lastMessage: LastMessage) => void;
    rid?: string;
};

export type ValidateSubscribeParams = {
    collection: Collections;
    event: string;
};

export type ValidateOnReactionParams = {
    cb: (message: Message) => void;
    rid: string;
    msgId: string;
};

export type RoomsSubscriptions = {
    [rid: string]: (WsSubscription | undefined)[];
};

export type MessageResponseData = Message;
