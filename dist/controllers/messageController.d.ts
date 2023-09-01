import { SendAttachmentSDKParams, SendMessageByRidSDKParams, MessageResponseData, SendMessageToThreadSDKParams } from '../lib/types';
import { SquadusClient } from '../client';
export declare class MessageController {
    private squadusClient;
    private readonly allowedAttachmentsPath;
    constructor(params: {
        squadusClient: SquadusClient;
        allowedAttachmentsPath: string;
    });
    sendMessageByRid(params: SendMessageByRidSDKParams): Promise<MessageResponseData>;
    sendMessageToThread(params: SendMessageToThreadSDKParams): Promise<MessageResponseData>;
    sendAttachment(params: SendAttachmentSDKParams): Promise<MessageResponseData>;
}
