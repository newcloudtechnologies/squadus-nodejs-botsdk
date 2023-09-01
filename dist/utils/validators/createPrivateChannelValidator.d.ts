import { z } from 'zod';
export declare const zodCreatePrivateChannelValidator: z.ZodObject<{
    name: z.ZodString;
    members: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    encrypted: z.ZodOptional<z.ZodBoolean>;
    readOnly: z.ZodOptional<z.ZodBoolean>;
    isPrivate: z.ZodLiteral<true>;
    teamId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    isPrivate: true;
    members?: string[] | undefined;
    encrypted?: boolean | undefined;
    readOnly?: boolean | undefined;
    teamId?: string | undefined;
}, {
    name: string;
    isPrivate: true;
    members?: string[] | undefined;
    encrypted?: boolean | undefined;
    readOnly?: boolean | undefined;
    teamId?: string | undefined;
}>;
export type ZodCreatePrivateChannelValidatorType = z.infer<typeof zodCreatePrivateChannelValidator>;
