import { z } from 'zod';
export declare const zodCreateChannelValidator: z.ZodObject<{
    isPrivate: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    isPrivate?: boolean | undefined;
}, {
    isPrivate?: boolean | undefined;
}>;
export type ZodCreateChannelValidatorType = z.infer<typeof zodCreateChannelValidator>;
