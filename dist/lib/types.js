"use strict";
/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestClientError = exports.Status = exports.Collections = exports.RoleName = exports.SettingsName = exports.RoomType = exports.SystemMessages = void 0;
var constants_1 = require("@squadus/core/dist/constants");
Object.defineProperty(exports, "SystemMessages", { enumerable: true, get: function () { return constants_1.SystemMessages; } });
Object.defineProperty(exports, "RoomType", { enumerable: true, get: function () { return constants_1.RoomType; } });
Object.defineProperty(exports, "SettingsName", { enumerable: true, get: function () { return constants_1.SettingsName; } });
var types_1 = require("@squadus/core/dist/restClient/types");
Object.defineProperty(exports, "RoleName", { enumerable: true, get: function () { return types_1.RoleName; } });
var constants_2 = require("@squadus/core/dist/wsClient/constants");
Object.defineProperty(exports, "Collections", { enumerable: true, get: function () { return constants_2.Collections; } });
Object.defineProperty(exports, "Status", { enumerable: true, get: function () { return constants_2.Status; } });
var errorHandlers_1 = require("@squadus/core/dist/restClient/errorHandlers");
Object.defineProperty(exports, "RestClientError", { enumerable: true, get: function () { return errorHandlers_1.RestClientError; } });
//# sourceMappingURL=types.js.map