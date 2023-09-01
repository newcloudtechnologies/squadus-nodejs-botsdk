"use strict";
/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodSendAttachmentValidator = void 0;
const zod_1 = require("zod");
exports.zodSendAttachmentValidator = zod_1.z.object({
    rid: zod_1.z.string().min(1),
    msg: zod_1.z.string().min(1).optional(),
    path: zod_1.z.string().min(1),
});
//# sourceMappingURL=sendAttachmentValidator.js.map