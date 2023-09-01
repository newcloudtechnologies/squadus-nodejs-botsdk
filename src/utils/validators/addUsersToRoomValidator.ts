/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */

import { z } from 'zod';

export const zodAddUsersToRoomValidator = z.object({
    rid: z.string().min(1),
    users: z.array(z.string().min(1)),
});

export type ZodAddUsersToRoomValidatorType = z.infer<
    typeof zodAddUsersToRoomValidator
>;
