import { z } from 'zod';
export declare const zodOnEventValidator: z.ZodFunction<z.ZodTuple<[z.ZodAny], z.ZodUnknown>, z.ZodVoid>;
export type ZodOnEventValidatorType = z.infer<typeof zodOnEventValidator>;
