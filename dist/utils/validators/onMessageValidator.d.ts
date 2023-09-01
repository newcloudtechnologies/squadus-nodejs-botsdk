import { z } from 'zod';
export declare const zodOnMessageValidator: z.ZodObject<{
    cb: z.ZodFunction<z.ZodTuple<[z.ZodAny], z.ZodUnknown>, z.ZodVoid>;
    rid: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    cb: (args_0: any, ...args_1: unknown[]) => void;
    rid?: string | undefined;
}, {
    cb: (args_0: any, ...args_1: unknown[]) => void;
    rid?: string | undefined;
}>;
export type ZodOnMessageValidatorType = z.infer<typeof zodOnMessageValidator>;
