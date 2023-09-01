"use strict";
/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodCreateChannelValidator = void 0;
const zod_1 = require("zod");
exports.zodCreateChannelValidator = zod_1.z.object({
    isPrivate: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=createChannelValidator.js.map