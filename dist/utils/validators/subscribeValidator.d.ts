import { z } from 'zod';
import { Collections } from '../../lib';
export declare const zodSubscribeValidator: z.ZodObject<{
    collection: z.ZodNativeEnum<typeof Collections>;
    event: z.ZodString;
}, "strip", z.ZodTypeAny, {
    event: string;
    collection: Collections;
}, {
    event: string;
    collection: Collections;
}>;
export type ZodSubscribeValidatorType = z.infer<typeof zodSubscribeValidator>;
