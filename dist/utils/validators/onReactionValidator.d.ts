import { z } from 'zod';
export declare const zodOnReactionValidator: z.ZodObject<{
    cb: z.ZodFunction<z.ZodTuple<[z.ZodAny], z.ZodUnknown>, z.ZodVoid>;
    rid: z.ZodString;
    msgId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    rid: string;
    cb: (args_0: any, ...args_1: unknown[]) => void;
    msgId: string;
}, {
    rid: string;
    cb: (args_0: any, ...args_1: unknown[]) => void;
    msgId: string;
}>;
export type ZodOnReactionValidatorType = z.infer<typeof zodOnReactionValidator>;
