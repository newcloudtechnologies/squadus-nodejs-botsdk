"use strict";
/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SDKErrors = exports.ErrorCode = exports.RoomEventNames = exports.SettingsName = void 0;
var core_1 = require("@squadus/core");
Object.defineProperty(exports, "SettingsName", { enumerable: true, get: function () { return core_1.SettingsName; } });
Object.defineProperty(exports, "RoomEventNames", { enumerable: true, get: function () { return core_1.RoomEventNames; } });
var core_2 = require("@squadus/core");
Object.defineProperty(exports, "ErrorCode", { enumerable: true, get: function () { return core_2.Errors; } });
var SDKErrors;
(function (SDKErrors) {
    SDKErrors["RoomSubscriptionError"] = "room-subscription-error";
})(SDKErrors = exports.SDKErrors || (exports.SDKErrors = {}));
//# sourceMappingURL=constants.js.map