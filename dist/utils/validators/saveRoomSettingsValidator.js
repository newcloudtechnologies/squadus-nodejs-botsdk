"use strict";
/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodSaveRoomSettingsValidator = void 0;
const zod_1 = require("zod");
const types_1 = require("../../lib/types");
exports.zodSaveRoomSettingsValidator = zod_1.z.object({
    rid: zod_1.z.string().min(1),
    roomName: zod_1.z.string().min(1).optional(),
    roomDescription: zod_1.z.string().min(1).optional(),
    roomTopic: zod_1.z.string().min(1).optional(),
    roomAnnouncement: zod_1.z.string().min(1).optional(),
    systemMessages: zod_1.z.array(zod_1.z.nativeEnum(types_1.SystemMessages)).optional(),
    isPrivate: zod_1.z.boolean().optional(),
    readOnly: zod_1.z.boolean().optional(),
    reactWhenReadOnly: zod_1.z.boolean().optional(),
    joinCode: zod_1.z.string().min(1).optional(),
    encrypted: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=saveRoomSettingsValidator.js.map