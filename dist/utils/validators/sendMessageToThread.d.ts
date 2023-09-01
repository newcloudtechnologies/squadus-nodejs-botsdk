import { z } from 'zod';
export declare const zodSendMessageToThreadValidator: z.ZodObject<{
    rid: z.ZodOptional<z.ZodNever>;
    msg: z.ZodString;
    parentMessageId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    parentMessageId: string;
    msg: string;
    rid?: undefined;
}, {
    parentMessageId: string;
    msg: string;
    rid?: undefined;
}>;
export type ZodSendMessageToThreadValidatorType = z.infer<typeof zodSendMessageToThreadValidator>;
