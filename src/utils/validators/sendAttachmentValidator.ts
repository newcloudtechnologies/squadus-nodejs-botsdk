/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */

import { z } from 'zod';

export const zodSendAttachmentValidator = z.object({
    rid: z.string().min(1),
    msg: z.string().min(1).optional(),
    path: z.string().min(1),
});

export type ZodSendAttachmentValidatorType = z.infer<
    typeof zodSendAttachmentValidator
>;
