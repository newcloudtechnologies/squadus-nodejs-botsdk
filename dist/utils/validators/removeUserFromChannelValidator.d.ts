import { z } from 'zod';
export declare const zodRemoveUserFromChannelValidator: z.ZodObject<{
    rid: z.ZodString;
    username: z.ZodString;
}, "strip", z.ZodTypeAny, {
    rid: string;
    username: string;
}, {
    rid: string;
    username: string;
}>;
export type ZodRemoveUserFromChannelValidatorType = z.infer<typeof zodRemoveUserFromChannelValidator>;
