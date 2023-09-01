import { z } from 'zod';
export declare const zodAddUsersToRoomValidator: z.ZodObject<{
    rid: z.ZodString;
    users: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    users: string[];
    rid: string;
}, {
    users: string[];
    rid: string;
}>;
export type ZodAddUsersToRoomValidatorType = z.infer<typeof zodAddUsersToRoomValidator>;
