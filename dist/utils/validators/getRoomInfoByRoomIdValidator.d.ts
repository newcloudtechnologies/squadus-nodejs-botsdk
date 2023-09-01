import { z } from 'zod';
export declare const zodGetRoomInfoByRoomIdValidator: z.ZodObject<{
    rid: z.ZodString;
}, "strip", z.ZodTypeAny, {
    rid: string;
}, {
    rid: string;
}>;
export type ZodGetRoomInfoByRoomIdValidatorType = z.infer<typeof zodGetRoomInfoByRoomIdValidator>;
