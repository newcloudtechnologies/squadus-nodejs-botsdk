"use strict";
/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodSetUserRoleValidator = void 0;
const zod_1 = require("zod");
const types_1 = require("../../lib/types");
exports.zodSetUserRoleValidator = zod_1.z.object({
    roomId: zod_1.z.string().min(1),
    userId: zod_1.z.string().min(1),
    roleName: zod_1.z.nativeEnum(types_1.RoleName),
    roleValue: zod_1.z.boolean(),
});
//# sourceMappingURL=setUserRoleValidator.js.map