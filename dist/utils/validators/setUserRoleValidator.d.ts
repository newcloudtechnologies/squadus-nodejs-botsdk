import { z } from 'zod';
import { RoleName } from '../../lib/types';
export declare const zodSetUserRoleValidator: z.ZodObject<{
    roomId: z.ZodString;
    userId: z.ZodString;
    roleName: z.ZodNativeEnum<typeof RoleName>;
    roleValue: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    roomId: string;
    userId: string;
    roleName: RoleName;
    roleValue: boolean;
}, {
    roomId: string;
    userId: string;
    roleName: RoleName;
    roleValue: boolean;
}>;
export type ZodSetUserRoleValidatorType = z.infer<typeof zodSetUserRoleValidator>;
