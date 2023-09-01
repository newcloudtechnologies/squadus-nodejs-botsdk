/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */

import { z } from 'zod';

import { RoleName } from '../../lib/types';

export const zodSetUserRoleValidator = z.object({
    roomId: z.string().min(1),
    userId: z.string().min(1),
    roleName: z.nativeEnum(RoleName),
    roleValue: z.boolean(),
});

export type ZodSetUserRoleValidatorType = z.infer<
    typeof zodSetUserRoleValidator
>;
