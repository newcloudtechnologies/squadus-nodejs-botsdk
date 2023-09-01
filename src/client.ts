/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */

import { RestClient, WSClient } from '@squadus/core';

import { ErrorCode } from './lib/constants';
import {
    MessageController,
    RoomController,
    SubscriptionController,
} from './controllers';
import {
    ClientParams,
    RestResponse,
    Settings,
    SettingsResponseData,
    SettingsName,
    Status,
    RestClientError,
    UserResponseData,
} from './lib/types';
import { validateGetSettingsParam, validateUsernameParam } from './utils';

const SDKVersion = process.env.SDK_VERSION || '0.0.65'; // has to be passed via CD
const USER_AGENT_HEADER = `Squadus JS SDK; v${SDKVersion}`;

export class SquadusClient {
    restClient: RestClient;
    wsClient: WSClient;
    token: string;
    settings: Settings;
    room: RoomController;
    message: MessageController;
    subscription: SubscriptionController;
    private readonly allowedAttachmentsPath: string;

    constructor(params: ClientParams) {
        const { server, token, allowedAttachmentsPath = './' } = params || {};
        const isParamsTypeCorrect =
            typeof server === 'string' &&
            typeof token === 'string' &&
            server &&
            token;
        if (!isParamsTypeCorrect) {
            throw new RestClientError(ErrorCode.InvalidArguments, {});
        }
        this.token = token;
        this.allowedAttachmentsPath = allowedAttachmentsPath;
        this.wsClient = new WSClient(server);
        this.restClient = new RestClient(
            server,
            USER_AGENT_HEADER,
        ) as RestClient;
        this.room = new RoomController({
            squadusClient: this,
        });
        this.message = new MessageController({
            squadusClient: this,
            allowedAttachmentsPath: this.allowedAttachmentsPath,
        });
        this.subscription = new SubscriptionController({
            squadusClient: this,
        });
        this.settings = {};
    }

    async connect(): Promise<void> {
        const params = { token: this.token };
        await this.restClient.login(params);
        const response = await this.restClient.getSettings();

        const settings = response?.data.settings;
        if (settings === undefined) {
            throw new RestClientError(ErrorCode.AuthorizationError, response);
        }

        for (const setting of settings) {
            const { _id, value } = setting;
            // @ts-expect-error settings is empty by default
            this.settings[_id as SettingsName] = value;
        }

        await this.wsClient.open();
        return new Promise((resolve) => {
            this.wsClient.status$.subscribe(async (status: Status) => {
                if (status === Status.Open) {
                    try {
                        await this.wsClient.login({ resume: this.token });
                    } catch (error) {
                        console.error(error);
                    }
                    resolve();
                }
            });
        });
    }

    async getUserInfoByUsername(
        username: string,
    ): RestResponse<UserResponseData> {
        validateUsernameParam(username);
        return await this.restClient.getUserInfoByUsername(username);
    }

    async getSettings(
        settings?: Array<SettingsName>,
    ): RestResponse<SettingsResponseData> {
        validateGetSettingsParam(settings);
        return await this.restClient.getSettings(settings);
    }
}
