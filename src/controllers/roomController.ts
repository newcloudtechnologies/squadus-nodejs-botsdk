/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2026
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */

import { MySquadusClient } from '../client';
import { ErrorCode } from '../lib/constants';
import {
    AddUsersToRoomRequestParams,
    ChannelRoomType,
    CreatePrivateChannelRequestParams,
    CreatePrivateChannelResponseData,
    CreatePrivateChannelSDKParams,
    CreatePublicChannelRequestParams,
    CreatePublicChannelResponseData,
    CreatePublicChannelSDKParams,
    DirectRoomResponseData,
    GetRoomInfoByRoomIdRequestParams,
    GetRoomInfoResponseData,
    IsPrivateType,
    RemoveUserFromChannelResponseData,
    RemoveUserFromChannelSDKParams,
    RestClientError,
    RestResponse,
    RoomType,
    RoomTypeForApi,
    SaveRoomSettingsRequestParams,
    SaveRoomSettingsResponseData,
    SaveRoomSettingsSDKParams,
    SetUserRoleRequestParams,
    SetUserRoleResponseData,
    SetUserRoleSDKParams,
} from '../lib/types';
import {
    validateAddUsersToRoomParams,
    validateCreateChannelParams,
    validateCreatePrivateChannelParams,
    validateCreatePublicChannelParams,
    validateGetRoomInfoByRoomIdParams,
    validateReadThreadParam,
    validateRemoveUserFromChannelParams,
    validateSaveRoomSettingsParams,
    validateSetUserRoleParams,
    validateUsernameParam,
} from '../utils';

export class RoomController {
    private mySquadusClient: MySquadusClient;

    constructor(params: { mySquadusClient: MySquadusClient }) {
        this.mySquadusClient = params.mySquadusClient;
    }

    async readThread(parentMessageId: string): Promise<void> {
        validateReadThreadParam(parentMessageId);

        //Need this call because method.call/readThreads doesn't return any error
        //when thread doesn't exist
        await this.mySquadusClient.restClient.getThreadMessages(
            parentMessageId,
        );

        return await this.mySquadusClient.restClient.readThread(
            parentMessageId,
        );
    }

    async createChannel(
        params: CreatePublicChannelSDKParams | CreatePrivateChannelSDKParams,
    ): Promise<
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
    ): Promise<CreatePublicChannelResponseData> {
        validateCreatePublicChannelParams(params);
        const { name, readOnly = false, members = [], teamId } = params;
        const data: CreatePublicChannelRequestParams = {
            name,
            readOnly,
            members,
            teamId,
        };
        return await this.mySquadusClient.restClient.createChannel(data);
    }

    private async createPrivateChannel(
        params: CreatePrivateChannelSDKParams,
    ): Promise<CreatePrivateChannelResponseData> {
        validateCreatePrivateChannelParams(params);
        const {
            name,
            readOnly = false,
            members = [],
            teamId,
            encrypted = false,
        } = params;

        const data: CreatePrivateChannelRequestParams = {
            encrypted,
            members,
            name,
            readOnly,
            teamId,
        };
        return await this.mySquadusClient.restClient.createGroup(data);
    }

    async getRoomInfoByRoomId(
        params: GetRoomInfoByRoomIdRequestParams,
    ): RestResponse<GetRoomInfoResponseData> {
        validateGetRoomInfoByRoomIdParams(params);
        return await this.mySquadusClient.restClient.getRoomInfoByRoomId(
            params,
        );
    }

    async createDirectRoom(
        username: string,
    ): Promise<DirectRoomResponseData | undefined> {
        validateUsernameParam(username);
        return await this.mySquadusClient.restClient.createDirectRoom(username);
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
            encrypted,
            joinCode,
            reactWhenReadOnly,
            readOnly,
            rid,
            roomAnnouncement,
            roomDescription,
            roomName,
            roomTopic,
            roomType: isPrivate ? RoomType.Group : RoomType.PublicChannel,
            systemMessages,
        };
        return await this.mySquadusClient.restClient.saveRoomSettings(data);
    };

    async addUsersToRoom(
        params: AddUsersToRoomRequestParams,
    ): RestResponse<boolean> {
        validateAddUsersToRoomParams(params);

        return await this.mySquadusClient.restClient.addUsersToRoom([params]);
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
            roleName,
            roleValue,
            roomId,
            t: roomType as RoomTypeForApi,
            userId,
        };
        return await this.mySquadusClient.restClient.setUserRole(data);
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
        return await this.mySquadusClient.restClient.removeUserFromChannel({
            rid,
            username,
            roomType,
        });
    }
}
