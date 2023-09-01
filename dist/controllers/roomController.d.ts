import { SquadusClient } from '../client';
import { RestResponse, CreatePublicChannelResponseData, CreatePrivateChannelResponseData, GetRoomInfoByRoomIdRequestParams, GetRoomInfoResponseData, DirectRoomResponseData, SaveRoomSettingsResponseData, SaveRoomSettingsSDKParams, AddUsersToRoomRequestParams, SetUserRoleResponseData, SetUserRoleSDKParams, RemoveUserFromChannelResponseData, CreatePublicChannelSDKParams, CreatePrivateChannelSDKParams, RemoveUserFromChannelSDKParams } from '../lib/types';
export declare class RoomController {
    private squadusClient;
    constructor(params: {
        squadusClient: SquadusClient;
    });
    readThread(parentMessageId: string): Promise<void>;
    createChannel(params: CreatePublicChannelSDKParams | CreatePrivateChannelSDKParams): RestResponse<CreatePublicChannelResponseData | CreatePrivateChannelResponseData>;
    private createPublicChannel;
    private createPrivateChannel;
    getRoomInfoByRoomId(params: GetRoomInfoByRoomIdRequestParams): RestResponse<GetRoomInfoResponseData>;
    createDirectRoom(username: string): Promise<DirectRoomResponseData | undefined>;
    saveRoomSettings: (params: SaveRoomSettingsSDKParams) => RestResponse<SaveRoomSettingsResponseData>;
    addUsersToRoom(params: AddUsersToRoomRequestParams): RestResponse<boolean>;
    setUserRole(params: SetUserRoleSDKParams): RestResponse<SetUserRoleResponseData>;
    removeUserFromChannel(params: RemoveUserFromChannelSDKParams): RestResponse<RemoveUserFromChannelResponseData>;
}
