/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */

import { randomUUID } from 'crypto';

export const NEW_PUBLIC_CHANNEL_NAME = `PUBLIC_CHANNEL_NAME_${randomUUID()}`;
export const NEW_PRIVATE_CHANNEL_NAME = `PRIVATE_CHANNEL_NAME_${randomUUID()}`;
export const TARGET_CHANNEL_NAME = `TARGET_CHANNEL_NAME_${randomUUID()}`;
export const MESSAGE_TEXT = 'Hi!';
export const REPLY_TEXT = 'Hi in thread!';
export const SUCCESS_FG_COLOR = '\x1b[32m';
export const FAIL_COLOR = '\x1b[31m';
export const RESET_COLOR = '\x1b[0m';
