"use strict";
/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const fs_1 = __importDefault(require("fs"));
const form_data_1 = __importDefault(require("form-data"));
const types_1 = require("../lib/types");
const constants_1 = require("../lib/constants");
const utils_1 = require("../utils");
class MessageController {
    constructor(params) {
        const { squadusClient, allowedAttachmentsPath } = params;
        this.squadusClient = squadusClient;
        this.allowedAttachmentsPath = allowedAttachmentsPath;
    }
    async sendMessageByRid(params) {
        (0, utils_1.validateSendMessageByRidParams)(params);
        return await this.squadusClient.restClient.sendMessage({
            message: params,
        });
    }
    async sendMessageToThread(params) {
        (0, utils_1.validateSendMessageToThread)(params);
        const { parentMessageId, msg } = params;
        return await this.squadusClient.restClient.sendMessage({
            message: {
                tmid: parentMessageId,
                msg,
            },
        });
    }
    async sendAttachment(params) {
        (0, utils_1.validateSendAttachmentParams)(params);
        const { path, msg, rid } = params || {};
        if (!(0, utils_1.isPathValid)(path, this.allowedAttachmentsPath)) {
            throw new types_1.RestClientError(constants_1.ErrorCode.InvalidPathToAttachment, {});
        }
        const form = new form_data_1.default();
        if (!fs_1.default.existsSync(path)) {
            throw new types_1.RestClientError(constants_1.ErrorCode.NoSuchFileOrDirectory, {});
        }
        const fileStream = fs_1.default.createReadStream(path);
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
exports.MessageController = MessageController;
//# sourceMappingURL=messageController.js.map