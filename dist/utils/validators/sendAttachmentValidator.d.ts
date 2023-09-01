import { z } from 'zod';
export declare const zodSendAttachmentValidator: z.ZodObject<{
    rid: z.ZodString;
    msg: z.ZodOptional<z.ZodString>;
    path: z.ZodString;
}, "strip", z.ZodTypeAny, {
    path: string;
    rid: string;
    msg?: string | undefined;
}, {
    path: string;
    rid: string;
    msg?: string | undefined;
}>;
export type ZodSendAttachmentValidatorType = z.infer<typeof zodSendAttachmentValidator>;
