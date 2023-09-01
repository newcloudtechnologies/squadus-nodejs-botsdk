"use strict";
/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodSubscribeValidator = void 0;
const zod_1 = require("zod");
const lib_1 = require("../../lib");
exports.zodSubscribeValidator = zod_1.z.object({
    collection: zod_1.z.nativeEnum(lib_1.Collections),
    event: zod_1.z.string().min(1),
});
//# sourceMappingURL=subscribeValidator.js.map