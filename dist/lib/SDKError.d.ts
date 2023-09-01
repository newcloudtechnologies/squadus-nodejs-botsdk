import { SDKErrors } from '.';
export declare class SDKError extends Error {
    code: string;
    error: unknown;
    constructor(code: SDKErrors, error: unknown);
}
