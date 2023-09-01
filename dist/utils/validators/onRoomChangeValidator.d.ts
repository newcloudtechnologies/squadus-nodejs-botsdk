import { z } from 'zod';
export declare const zodOnRoomChangeValidator: z.ZodObject<{
    cb: z.ZodFunction<z.ZodTuple<[z.ZodAny], z.ZodUnknown>, z.ZodVoid>;
    rid: z.ZodString;
}, "strip", z.ZodTypeAny, {
    rid: string;
    cb: (args_0: any, ...args_1: unknown[]) => void;
}, {
    rid: string;
    cb: (args_0: any, ...args_1: unknown[]) => void;
}>;
export type ZodOnRoomChangeValidatorType = z.infer<typeof zodOnRoomChangeValidator>;
