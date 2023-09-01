"use strict";
/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const constants_1 = require("../lib/constants");
const types_1 = require("../lib/types");
const utils_1 = require("../utils");
class RoomController {
    constructor(params) {
        this.saveRoomSettings = async (params) => {
            (0, utils_1.validateSaveRoomSettingsParams)(params);
            const { rid, roomName, roomDescription, roomTopic, roomAnnouncement, isPrivate, readOnly, systemMessages, joinCode, reactWhenReadOnly, encrypted, } = params;
            const data = {
                rid,
                roomName,
                roomDescription,
                roomTopic,
                roomAnnouncement,
                roomType: isPrivate ? types_1.RoomType.Group : types_1.RoomType.PublicChannel,
                readOnly,
                systemMessages,
                joinCode,
                reactWhenReadOnly,
                encrypted,
            };
            return await this.squadusClient.restClient.saveRoomSettings(data);
        };
        this.squadusClient = params.squadusClient;
    }
    async readThread(parentMessageId) {
        (0, utils_1.validateReadThreadParam)(parentMessageId);
        return await this.squadusClient.restClient.readThread(parentMessageId);
    }
    async createChannel(params) {
        const { isPrivate } = params;
        const isPrivateParam = isPrivate;
        // only validates isPrivate parameter
        // other fields will be validated inside nested methods
        (0, utils_1.validateCreateChannelParams)(isPrivateParam);
        if (isPrivate) {
            return await this.createPrivateChannel(params);
        }
        return await this.createPublicChannel(params);
    }
    async createPublicChannel(params) {
        (0, utils_1.validateCreatePublicChannelParams)(params);
        const { name, readOnly = false, members = [], teamId } = params;
        const data = {
            name,
            readOnly,
            members,
            teamId,
        };
        return await this.squadusClient.restClient.createChannel(data);
    }
    async createPrivateChannel(params) {
        (0, utils_1.validateCreatePrivateChannelParams)(params);
        const { name, readOnly = false, members = [], teamId, encrypted = false, } = params;
        const data = {
            name,
            readOnly,
            encrypted,
            members,
            teamId,
        };
        return await this.squadusClient.restClient.createGroup(data);
    }
    async getRoomInfoByRoomId(params) {
        (0, utils_1.validateGetRoomInfoByRoomIdParams)(params);
        return await this.squadusClient.restClient.getRoomInfoByRoomId(params);
    }
    async createDirectRoom(username) {
        (0, utils_1.validateUsernameParam)(username);
        const response = await this.squadusClient.restClient.createDirectRoom(username);
        return response?.data.room;
    }
    async addUsersToRoom(params) {
        (0, utils_1.validateAddUseToRoomParams)(params);
        return await this.squadusClient.restClient.addUsersToRoom([params]);
    }
    async setUserRole(params) {
        (0, utils_1.validateSetUserRoleParams)(params);
        const { roomId, roleName, roleValue, userId } = params;
        const roomInfo = await this.getRoomInfoByRoomId({
            rid: roomId,
        });
        if (!roomInfo) {
            throw new types_1.RestClientError(constants_1.ErrorCode.RoomNotFound, {});
        }
        const roomType = roomInfo?.data.room.t;
        const data = {
            roomId,
            roleName,
            roleValue,
            t: roomType,
            userId,
        };
        return await this.squadusClient.restClient.setUserRole(data);
    }
    // delete from cannel or discussion
    async removeUserFromChannel(params) {
        (0, utils_1.validateRemoveUserFromChannelParams)(params);
        const { rid, username } = params;
        const roomInfo = await this.getRoomInfoByRoomId({ rid }).catch((error) => {
            throw error;
        });
        if (!roomInfo) {
            throw new types_1.RestClientError(constants_1.ErrorCode.RoomNotFound, {});
        }
        const roomType = roomInfo?.data.room.t;
        return await this.squadusClient.restClient.removeUserFromChannel({
            rid,
            username,
            roomType,
        });
    }
}
exports.RoomController = RoomController;
//# sourceMappingURL=roomController.js.map