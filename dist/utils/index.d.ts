import { AddUsersToRoomRequestParams, CreatePrivateChannelSDKParams, CreatePublicChannelSDKParams, SaveRoomSettingsSDKParams, SetUserRoleSDKParams, WsData, RoomsChangedEvent, RoomEvent, RoomMessageEvent, GetRoomInfoByRoomIdRequestParams, IsPrivateType, RemoveUserFromChannelSDKParams, SendMessageByRidSDKParams, SendAttachmentSDKParams, SettingsName, ValidateOnRoomChangeParams, ValidateOnMessageParams, ValidateSubscribeParams, ValidateOnReactionParams, SendMessageToThreadSDKParams } from '../lib/types';
export declare const validateAddUseToRoomParams: (params: AddUsersToRoomRequestParams) => void;
export declare function validateGetRoomInfoByRoomIdParams(params: GetRoomInfoByRoomIdRequestParams): void;
export declare function validateCreatePublicChannelParams(params: CreatePublicChannelSDKParams): void;
export declare function validateCreateChannelParams(isPrivate: IsPrivateType): void;
export declare function validateCreatePrivateChannelParams(params: CreatePrivateChannelSDKParams): void;
export declare function validateSaveRoomSettingsParams(params: SaveRoomSettingsSDKParams): void;
export declare function validateUsernameParam(username: string): void;
export declare function validateSetUserRoleParams(params: SetUserRoleSDKParams): void;
export declare function validateRemoveUserFromChannelParams(params: RemoveUserFromChannelSDKParams): void;
export declare function validateSendMessageByRidParams(params: SendMessageByRidSDKParams): void;
export declare function validateSendMessageToThread(params: SendMessageToThreadSDKParams): void;
export declare function validateSendAttachmentParams(params: SendAttachmentSDKParams): void;
export declare function validateGetSettingsParam(settings?: Array<SettingsName>): void;
export declare function validateOnMessageParams(params: ValidateOnMessageParams): void;
export declare function validateOnRoomChangeParams(params: ValidateOnRoomChangeParams): void;
export declare function validateOnReactionParams(params: ValidateOnReactionParams): void;
export declare function validateOnEventParams(cb: (event: WsData) => void): void;
export declare function validateSubscribeParams(params: ValidateSubscribeParams): void;
export declare function validateUnsubscribeParams(id: string): void;
export declare function validateReadThreadParam(parentMessageId: string): void;
export declare function newLastMessageFilter(userId: string, data: WsData): data is RoomsChangedEvent;
export declare const roomEventsFilter: (data: WsData) => data is RoomEvent;
export declare const ridFilter: (rid: string, data: RoomEvent) => boolean;
export declare const messageEventFilter: (data: RoomEvent) => data is RoomMessageEvent;
export declare const msgIdFilter: (msgId: string, data: RoomMessageEvent) => boolean;
export declare const isPathValid: (attachmentPath: string, allowedPath: string) => boolean;
export declare const convertRelativeToAbsolute: (pathToConvert: string) => string;
