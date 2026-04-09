/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2026
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */

import parse from 'url-parse';
import { coerce, gte, SemVer, valid } from 'semver';
import { distinctUntilChanged, filter, skip } from 'rxjs';

import {
    Errors,
    LoginRequestParams,
    RestClient,
    SettingsParams,
    Status,
    UserData,
    WSClient,
} from '@squadus/core';

import { ErrorCode } from './lib/constants';
import {
    MessageController,
    RoomController,
    SubscriptionController,
} from './controllers';
import {
    ClientParams,
    RestClientError,
    RestResponse,
    ServerInfoResponse,
    Settings,
    SettingsName,
    SettingsResponseData,
    UserResponseData,
} from './lib/types';
import {
    validateEmailParam,
    validateGetSettingsParam,
    validateUsernameParam,
    getProxyAgent,
} from './utils';
import { consoleError, consoleLog } from './lib/colorConsole';

const SDKVersion = process.env.SDK_VERSION || '0.0.2'; // has to be passed via CD
const USER_AGENT_HEADER = `MySquadus JS SDK; v${SDKVersion}`;
const protocolRegexp = new RegExp('^https?://', 'i');

export const MAX_RETRY_DELAY = 5000;
export const RECONNECT_COUNT_UP_TIMEOUT = 500;
export const MIN_SUPPORT_VERSION = '1.0.0';

export class MySquadusClient {
    restClient: RestClient;
    wsClient: WSClient;
    token: string;
    wsToken: string | undefined;
    server: string;
    settings: Settings;
    room: RoomController;
    message: MessageController;
    subscription: SubscriptionController;
    isWsConnecting = false;
    isReconnecting = false;
    serverVersion = coerce(MIN_SUPPORT_VERSION) as SemVer;
    // eslint-disable-next-line no-undef
    private reconnectTimeout: NodeJS.Timeout | null = null;
    private wsReconnectRetries = 1;
    private readonly allowedAttachmentsPath: string;

    constructor(params: ClientParams) {
        const { token, allowedAttachmentsPath = './' } = params || {};

        const agent = getProxyAgent(params);

        let rawServerUrl = params.server;
        if (!protocolRegexp.test(rawServerUrl)) {
            rawServerUrl = `https://${rawServerUrl}`;
        }
        const { host, protocol } = parse(rawServerUrl);
        const server = `${protocol}//${host}`;
        const isParamsTypeCorrect =
            typeof server === 'string' &&
            typeof token === 'string' &&
            server &&
            token;
        if (!isParamsTypeCorrect) {
            throw new RestClientError(ErrorCode.InvalidArguments, {});
        }
        this.token = token;
        this.server = server;
        this.allowedAttachmentsPath = allowedAttachmentsPath;
        this.wsClient = new WSClient({
            host: server,
            requestArgs: {
                headers: { 'User-Agent': USER_AGENT_HEADER },
                ...(agent && { agent }),
            },
        });
        this.restClient = new RestClient(
            server,
            USER_AGENT_HEADER,
            agent,
        ) as RestClient;
        this.room = new RoomController({
            mySquadusClient: this,
        });
        this.message = new MessageController({
            mySquadusClient: this,
            allowedAttachmentsPath: this.allowedAttachmentsPath,
        });
        this.subscription = new SubscriptionController({
            mySquadusClient: this,
        });
        this.settings = {};

        this.wsClient.status$
            .pipe(
                distinctUntilChanged(),
                filter(
                    (status) =>
                        status === Status.Closed && !this.isWsConnecting,
                ),
                skip(1), // prevent execute when service instance created
            )
            .subscribe(async () => {
                try {
                    await this.wsClient.close();
                    await this.connect();
                } catch (error) {
                    console.error(
                        '[SquadusBotSDK] reconnect wsClient failed with error:',
                        error,
                    );
                }
            });
    }

    private updateServerVersion(version: string | undefined): undefined {
        if (!version) {
            return;
        }
        // this is hack, need to discuss with backend team or find another semver library
        if (version && version.split('.').length === 2) {
            version += '.0';
        }
        if (valid(version)) {
            this.serverVersion = coerce(version) as SemVer;
        }
    }

    private calculateReconnectDelay(): number {
        return Math.min(
            MAX_RETRY_DELAY,
            this.wsReconnectRetries * RECONNECT_COUNT_UP_TIMEOUT,
        );
    }

    private async loadSettings(): Promise<Settings> {
        const response = await this.restClient.getSettings({
            server: this.server,
        });

        const settings = response?.data.settings;
        if (settings === undefined) {
            throw new RestClientError(ErrorCode.AuthorizationError, response);
        }

        const settingsMap = {};
        for (const setting of settings) {
            const { _id, value } = setting;
            // @ts-expect-error settings is empty by default
            settingsMap[_id as SettingsName] = value;
        }
        return settingsMap;
    }

    getIsBearerSupported(): boolean {
        return gte(this.serverVersion, '26.1.0');
    }

    private async innerConnect(): Promise<void> {
        // Note: Chatbots use authentication with User Token.
        // Works only for Squadus users with role "Bot"
        await this.fetchAndUpdateServerVersion();
        const isBearerSupported = this.getIsBearerSupported();
        const params = {
            token: this.token,
            isBotSDK: true,
            isBearerSupported,
        } as unknown as LoginRequestParams;

        const { authToken } = await this.restClient.login(params, this.server);

        if (authToken) {
            this.token = authToken;
        }

        this.settings = await this.loadSettings();
        await this.connectWS();
    }

    async connect(onError?: (err: unknown) => void): Promise<void> {
        const attempt = async (): Promise<void> => {
            try {
                await this.innerConnect();
                return;
            } catch (err) {
                const errorCode = (err as Record<string, unknown>)?.code;
                if (errorCode === Errors.WrongServerAddress) {
                    console.error(
                        `[SquadusBotSDK] connect() failed. Unable to reach server: "${this.server}". Network unavailable or host not found.`,
                    );
                } else {
                    console.error(
                        '[SquadusBotSDK] connect() error. Error:',
                        err,
                    );
                }
                onError?.(err);
                setTimeout(attempt, MAX_RETRY_DELAY);
            }
        };

        return attempt();
    }

    async connectWS(): Promise<void> {
        if (this.isWsConnecting) {
            return;
        }

        this.isWsConnecting = true;
        try {
            const isBearerSupported = this.getIsBearerSupported();
            let wsLoginParams;
            if (isBearerSupported) {
                const resp = await this.restClient.resumeJwt(this.server);
                const wsToken = resp.data.wsToken;
                wsLoginParams = {
                    wsToken,
                };
            } else {
                wsLoginParams = {
                    resume: this.token,
                };
            }

            await this.wsClient.open();
            await this.wsClient.login(wsLoginParams);
            consoleLog('[SquadusBotSDK] connectWS() connected successfully');
        } catch (e) {
            consoleError('[SquadusBotSDK] connectWS() method error: ', e);
            throw e;
        } finally {
            this.isWsConnecting = false;
        }
    }

    async reconnectWS(): Promise<void> {
        this.isReconnecting = true;
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        consoleLog(
            `[SquadusBotSDK] Start reconnect attempt: #${this.wsReconnectRetries}`,
        );
        const delay = this.calculateReconnectDelay();

        this.reconnectTimeout = setTimeout(async () => {
            try {
                await this.connectWS();
                this.wsReconnectRetries = 1;
            } catch (error) {
                consoleError(
                    '[SquadusBotSDK] reconnectWS() error, trying next attempt...',
                );
                this.wsReconnectRetries += 1;
                await this.reconnectWS();
            } finally {
                this.isReconnecting = false;
            }
        }, delay);
    }

    async getSettings({
        settings,
        server,
    }: SettingsParams = {}): RestResponse<SettingsResponseData> {
        validateGetSettingsParam(settings, server);
        return await this.restClient.getSettings({ settings, server });
    }

    async getUserInfoByUsername(
        username: string,
    ): RestResponse<UserResponseData> {
        validateUsernameParam(username);
        return await this.restClient.getUserInfoByUsername(username);
    }

    async getUserInfoByEmail(email: string): Promise<UserData | null> {
        validateEmailParam(email);
        return await this.restClient.getUserInfoByEmail(email);
    }

    async getServerInfo(server: string): Promise<ServerInfoResponse> {
        return this.restClient.getServerInfo(server);
    }
    async fetchAndUpdateServerVersion(): Promise<undefined> {
        const serverInfo = await this.getServerInfo(this.server);
        this.updateServerVersion(serverInfo.release);
    }
}
