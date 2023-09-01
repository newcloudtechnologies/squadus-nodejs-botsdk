"use strict";
/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SquadusClient = void 0;
const core_1 = require("@squadus/core");
const constants_1 = require("./lib/constants");
const controllers_1 = require("./controllers");
const types_1 = require("./lib/types");
const utils_1 = require("./utils");
const SDKVersion = process.env.SDK_VERSION || '0.0.65'; // has to be passed via CD
const USER_AGENT_HEADER = `Squadus JS SDK; v${SDKVersion}`;
class SquadusClient {
    constructor(params) {
        const { server, token, allowedAttachmentsPath = './' } = params || {};
        const isParamsTypeCorrect = typeof server === 'string' &&
            typeof token === 'string' &&
            server &&
            token;
        if (!isParamsTypeCorrect) {
            throw new types_1.RestClientError(constants_1.ErrorCode.InvalidArguments, {});
        }
        this.token = token;
        this.allowedAttachmentsPath = allowedAttachmentsPath;
        this.wsClient = new core_1.WSClient(server);
        this.restClient = new core_1.RestClient(server, USER_AGENT_HEADER);
        this.room = new controllers_1.RoomController({
            squadusClient: this,
        });
        this.message = new controllers_1.MessageController({
            squadusClient: this,
            allowedAttachmentsPath: this.allowedAttachmentsPath,
        });
        this.subscription = new controllers_1.SubscriptionController({
            squadusClient: this,
        });
        this.settings = {};
    }
    async connect() {
        const params = { token: this.token };
        await this.restClient.login(params);
        const response = await this.restClient.getSettings();
        const settings = response?.data.settings;
        if (settings === undefined) {
            throw new types_1.RestClientError(constants_1.ErrorCode.AuthorizationError, response);
        }
        for (const setting of settings) {
            const { _id, value } = setting;
            // @ts-expect-error settings is empty by default
            this.settings[_id] = value;
        }
        await this.wsClient.open();
        return new Promise((resolve) => {
            this.wsClient.status$.subscribe(async (status) => {
                if (status === types_1.Status.Open) {
                    try {
                        await this.wsClient.login({ resume: this.token });
                    }
                    catch (error) {
                        console.error(error);
                    }
                    resolve();
                }
            });
        });
    }
    async getUserInfoByUsername(username) {
        (0, utils_1.validateUsernameParam)(username);
        return await this.restClient.getUserInfoByUsername(username);
    }
    async getSettings(settings) {
        (0, utils_1.validateGetSettingsParam)(settings);
        return await this.restClient.getSettings(settings);
    }
}
exports.SquadusClient = SquadusClient;
//# sourceMappingURL=client.js.map