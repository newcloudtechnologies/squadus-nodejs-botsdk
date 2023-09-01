import { z } from 'zod';
export declare const zodSendMessageByRidValidator: z.ZodObject<{
    rid: z.ZodString;
    msg: z.ZodString;
    tmid: z.ZodOptional<z.ZodNever>;
}, "strip", z.ZodTypeAny, {
    rid: string;
    msg: string;
    tmid?: undefined;
}, {
    rid: string;
    msg: string;
    tmid?: undefined;
}>;
export type ZodSendMessageByRidValidatorType = z.infer<typeof zodSendMessageByRidValidator>;
