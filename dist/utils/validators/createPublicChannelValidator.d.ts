import { z } from 'zod';
export declare const zodCreatePublicChannelValidator: z.ZodObject<{
    name: z.ZodString;
    members: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    readOnly: z.ZodOptional<z.ZodBoolean>;
    isPrivate: z.ZodOptional<z.ZodLiteral<false>>;
    teamId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    members?: string[] | undefined;
    readOnly?: boolean | undefined;
    isPrivate?: false | undefined;
    teamId?: string | undefined;
}, {
    name: string;
    members?: string[] | undefined;
    readOnly?: boolean | undefined;
    isPrivate?: false | undefined;
    teamId?: string | undefined;
}>;
export type ZodCreatePublicChannelValidatorType = z.infer<typeof zodCreatePublicChannelValidator>;
