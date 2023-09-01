"use strict";
/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodCreatePublicChannelValidator = void 0;
const zod_1 = require("zod");
exports.zodCreatePublicChannelValidator = zod_1.z.object({
    name: zod_1.z.string().min(1),
    members: zod_1.z.array(zod_1.z.string().min(1)).optional(),
    readOnly: zod_1.z.boolean().optional(),
    isPrivate: zod_1.z.literal(false).optional(),
    teamId: zod_1.z.string().min(1).optional(),
});
//# sourceMappingURL=createPublicChannelValidator.js.map