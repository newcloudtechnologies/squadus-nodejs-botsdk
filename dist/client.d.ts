import { RestClient, WSClient } from '@squadus/core';
import { MessageController, RoomController, SubscriptionController } from './controllers';
import { ClientParams, RestResponse, Settings, SettingsResponseData, SettingsName, UserResponseData } from './lib/types';
export declare class SquadusClient {
    restClient: RestClient;
    wsClient: WSClient;
    token: string;
    settings: Settings;
    room: RoomController;
    message: MessageController;
    subscription: SubscriptionController;
    private readonly allowedAttachmentsPath;
    constructor(params: ClientParams);
    connect(): Promise<void>;
    getUserInfoByUsername(username: string): RestResponse<UserResponseData>;
    getSettings(settings?: Array<SettingsName>): RestResponse<SettingsResponseData>;
}
