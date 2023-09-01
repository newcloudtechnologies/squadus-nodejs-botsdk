import { z } from 'zod';
export declare const zodUsernameValidator: z.ZodString;
export type ZodUsernameType = z.infer<typeof zodUsernameValidator>;
