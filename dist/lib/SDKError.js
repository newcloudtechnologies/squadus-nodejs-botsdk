"use strict";
/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SDKError = void 0;
class SDKError extends Error {
    constructor(code, error) {
        super();
        this.code = code;
        this.error = error;
    }
}
exports.SDKError = SDKError;
//# sourceMappingURL=SDKError.js.map