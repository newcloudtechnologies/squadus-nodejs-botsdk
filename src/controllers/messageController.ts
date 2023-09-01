/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */

import fs from 'fs';

import FormData from 'form-data';

import {
    SendAttachmentSDKParams,
    SendMessageByRidSDKParams,
    MessageResponseData,
    SendMessageToThreadSDKParams,
    RestClientError,
} from '../lib/types';
import { SquadusClient } from '../client';
import { ErrorCode } from '../lib/constants';
import {
    isPathValid,
    validateSendAttachmentParams,
    validateSendMessageByRidParams,
    validateSendMessageToThread,
} from '../utils';

export class MessageController {
    private squadusClient: SquadusClient;
    private readonly allowedAttachmentsPath: string;

    constructor(params: {
        squadusClient: SquadusClient;
        allowedAttachmentsPath: string;
    }) {
        const { squadusClient, allowedAttachmentsPath } = params;
        this.squadusClient = squadusClient;
        this.allowedAttachmentsPath = allowedAttachmentsPath;
    }

    async sendMessageByRid(
        params: SendMessageByRidSDKParams,
    ): Promise<MessageResponseData> {
        validateSendMessageByRidParams(params);
        return await this.squadusClient.restClient.sendMessage({
            message: params,
        });
    }

    async sendMessageToThread(
        params: SendMessageToThreadSDKParams,
    ): Promise<MessageResponseData> {
        validateSendMessageToThread(params);
        const { parentMessageId, msg } = params;
        return await this.squadusClient.restClient.sendMessage({
            message: {
                tmid: parentMessageId,
                msg,
            },
        });
    }

    async sendAttachment(
        params: SendAttachmentSDKParams,
    ): Promise<MessageResponseData> {
        validateSendAttachmentParams(params);
        const { path, msg, rid } = params || {};

        if (!isPathValid(path, this.allowedAttachmentsPath)) {
            throw new RestClientError(ErrorCode.InvalidPathToAttachment, {});
        }

        const form = new FormData();
        if (!fs.existsSync(path)) {
            throw new RestClientError(ErrorCode.NoSuchFileOrDirectory, {});
        }
        const fileStream = fs.createReadStream(path);
        form.append('file', fileStream);
        if (msg) {
            form.append('description', msg);
        }
        return await this.squadusClient.restClient.sendAttachment({
            form,
            rid,
        });
    }
}
