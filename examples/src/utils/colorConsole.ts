/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */

import { FAIL_COLOR, RESET_COLOR, SUCCESS_FG_COLOR } from './constants';

const mapOutputToString = (messages: any) => {
    const output = messages.map((element: any) => {
        if (typeof element === 'object') {
            return JSON.stringify(element);
        }
        return element;
    });
    return output;
};

export const consoleLog = (...messages: any) => {
    const output = mapOutputToString(messages);
    console.log(SUCCESS_FG_COLOR, ...output, RESET_COLOR);
};

export const consoleError = (...messages: any) => {
    const output = mapOutputToString(messages);
    console.error(FAIL_COLOR, ...output, RESET_COLOR);
};
