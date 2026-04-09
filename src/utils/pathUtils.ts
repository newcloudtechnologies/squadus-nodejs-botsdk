/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2026
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */

import * as path from 'path';

export const isPathValid = (
    attachmentPath: string,
    allowedPath: string,
): boolean => {
    const allowedAbsolutePath = convertRelativeToAbsolute(allowedPath);
    const attachmentAbsolutePath = convertRelativeToAbsolute(attachmentPath);
    const relative = path.relative(allowedAbsolutePath, attachmentAbsolutePath);
    return !relative.startsWith('..') && !path.isAbsolute(relative);
};

export const convertRelativeToAbsolute = (pathToConvert: string): string => {
    return path.resolve(process.cwd(), pathToConvert);
};
