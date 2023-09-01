/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */

import { SquadusClient } from '../client';
import { ErrorCode } from '../lib/constants';
import {
    RestResponse,
    CreatePublicChannelResponseData,
    CreatePrivateChannelResponseData,
    GetRoomInfoByRoomIdRequestParams,
    GetRoomInfoResponseData,
    DirectRoomResponseData,
    RoomType,
    SaveRoomSettingsResponseData,
    SaveRoomSettingsRequestParams,
    SaveRoomSettingsSDKParams,
    AddUsersToRoomRequestParams,
    SetUserRoleRequestParams,
    RoomTypeForApi,
    SetUserRoleResponseData,
    SetUserRoleSDKParams,
    RemoveUserFromChannelResponseData,
    CreatePublicChannelSDKParams,
    CreatePrivateChannelSDKParams,
    CreatePublicChannelRequestParams,
    CreatePrivateChannelRequestParams,
    ChannelRoomType,
    IsPrivateType,
    RemoveUserFromChannelSDKParams,
    RestClientError,
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
    validateReadThreadParam,
} from '../utils';

export class RoomController {
    private squadusClient: SquadusClient;

    constructor(params: { squadusClient: SquadusClient }) {
        this.squadusClient = params.squadusClient;
    }

    async readThread(parentMessageId: string): Promise<void> {
        validateReadThreadParam(parentMessageId);
        return await this.squadusClient.restClient.readThread(parentMessageId);
    }

    async createChannel(
        params: CreatePublicChannelSDKParams | CreatePrivateChannelSDKParams,
    ): RestResponse<
        CreatePublicChannelResponseData | CreatePrivateChannelResponseData
    > {
        const { isPrivate } = params;
        const isPrivateParam = isPrivate as unknown as IsPrivateType;
        // only validates isPrivate parameter
        // other fields will be validated inside nested methods
        validateCreateChannelParams(isPrivateParam);
        if (isPrivate) {
            return await this.createPrivateChannel(params);
        }
        return await this.createPublicChannel(params);
    }

    private async createPublicChannel(
        params: CreatePublicChannelSDKParams,
    ): RestResponse<CreatePublicChannelResponseData> {
        validateCreatePublicChannelParams(params);
        const { name, readOnly = false, members = [], teamId } = params;
        const data: CreatePublicChannelRequestParams = {
            name,
            readOnly,
            members,
            teamId,
        };
        return await this.squadusClient.restClient.createChannel(data);
    }

    private async createPrivateChannel(
        params: CreatePrivateChannelSDKParams,
    ): RestResponse<CreatePrivateChannelResponseData> {
        validateCreatePrivateChannelParams(params);
        const {
            name,
            readOnly = false,
            members = [],
            teamId,
            encrypted = false,
        } = params;

        const data: CreatePrivateChannelRequestParams = {
            name,
            readOnly,
            encrypted,
            members,
            teamId,
        };
        return await this.squadusClient.restClient.createGroup(data);
    }

    async getRoomInfoByRoomId(
        params: GetRoomInfoByRoomIdRequestParams,
    ): RestResponse<GetRoomInfoResponseData> {
        validateGetRoomInfoByRoomIdParams(params);
        return await this.squadusClient.restClient.getRoomInfoByRoomId(params);
    }

    async createDirectRoom(
        username: string,
    ): Promise<DirectRoomResponseData | undefined> {
        validateUsernameParam(username);
        const response = await this.squadusClient.restClient.createDirectRoom(
            username,
        );
        return response?.data.room;
    }

    saveRoomSettings = async (
        params: SaveRoomSettingsSDKParams,
    ): RestResponse<SaveRoomSettingsResponseData> => {
        validateSaveRoomSettingsParams(params);
        const {
            rid,
            roomName,
            roomDescription,
            roomTopic,
            roomAnnouncement,
            isPrivate,
            readOnly,
            systemMessages,
            joinCode,
            reactWhenReadOnly,
            encrypted,
        } = params;
        const data: SaveRoomSettingsRequestParams = {
            rid,
            roomName,
            roomDescription,
            roomTopic,
            roomAnnouncement,
            roomType: isPrivate ? RoomType.Group : RoomType.PublicChannel,
            readOnly,
            systemMessages,
            joinCode,
            reactWhenReadOnly,
            encrypted,
        };
        return await this.squadusClient.restClient.saveRoomSettings(data);
    };

    async addUsersToRoom(
        params: AddUsersToRoomRequestParams,
    ): RestResponse<boolean> {
        validateAddUseToRoomParams(params);

        return await this.squadusClient.restClient.addUsersToRoom([params]);
    }

    async setUserRole(
        params: SetUserRoleSDKParams,
    ): RestResponse<SetUserRoleResponseData> {
        validateSetUserRoleParams(params);
        const { roomId, roleName, roleValue, userId } = params;
        const roomInfo = await this.getRoomInfoByRoomId({
            rid: roomId,
        });

        if (!roomInfo) {
            throw new RestClientError(ErrorCode.RoomNotFound, {});
        }

        const roomType = roomInfo?.data.room.t;
        const data: SetUserRoleRequestParams = {
            roomId,
            roleName,
            roleValue,
            t: roomType as RoomTypeForApi,
            userId,
        };
        return await this.squadusClient.restClient.setUserRole(data);
    }

    // delete from cannel or discussion
    async removeUserFromChannel(
        params: RemoveUserFromChannelSDKParams,
    ): RestResponse<RemoveUserFromChannelResponseData> {
        validateRemoveUserFromChannelParams(params);
        const { rid, username } = params;
        const roomInfo = await this.getRoomInfoByRoomId({ rid }).catch(
            (error) => {
                throw error;
            },
        );

        if (!roomInfo) {
            throw new RestClientError(ErrorCode.RoomNotFound, {});
        }

        const roomType = roomInfo?.data.room.t as ChannelRoomType;
        return await this.squadusClient.restClient.removeUserFromChannel({
            rid,
            username,
            roomType,
        });
    }
}
