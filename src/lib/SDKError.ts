/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */

import { SDKErrors } from '.';

export class SDKError extends Error {
    code: string;
    error: unknown;
    constructor(code: SDKErrors, error: unknown) {
        super();
        this.code = code;
        this.error = error;
    }
}
