"use strict";
/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertTypeEquality = void 0;
__exportStar(require("./createPublicChannelValidator"), exports);
__exportStar(require("./saveRoomSettingsValidator"), exports);
__exportStar(require("./setUserRoleValidator"), exports);
__exportStar(require("./addUsersToRoomValidator"), exports);
__exportStar(require("./createChannelValidator"), exports);
__exportStar(require("./usernameValidator"), exports);
__exportStar(require("./createPrivateChannelValidator"), exports);
__exportStar(require("./removeUserFromChannelValidator"), exports);
__exportStar(require("./addUsersToRoomValidator"), exports);
__exportStar(require("./getRoomInfoByRoomIdValidator"), exports);
__exportStar(require("./sendMessageByRidValidator"), exports);
__exportStar(require("./sendAttachmentValidator"), exports);
__exportStar(require("./getSettingsValidator"), exports);
__exportStar(require("./onMessageValidator"), exports);
__exportStar(require("./onRoomChangeValidator"), exports);
__exportStar(require("./onReactionValidator"), exports);
__exportStar(require("./onEventValidator"), exports);
__exportStar(require("./subscribeValidator"), exports);
__exportStar(require("./unsubscribeValidator"), exports);
__exportStar(require("./sendMessageToThread"), exports);
__exportStar(require("./readThreadValidator"), exports);
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
function assertTypeEquality() { }
exports.assertTypeEquality = assertTypeEquality;
//# sourceMappingURL=index.js.map