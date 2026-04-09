/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2026
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */

import { z } from 'zod';

export const zodCreatePrivateChannelValidator = z.object({
    encrypted: z.boolean().optional(),
    isPrivate: z.literal(true),
    members: z.array(z.string().min(1)).optional(),
    name: z.string().min(1),
    readOnly: z.boolean().optional(),
    teamId: z.string().min(1).optional(),
});

export type ZodCreatePrivateChannelValidatorType = z.infer<
    typeof zodCreatePrivateChannelValidator
>;
