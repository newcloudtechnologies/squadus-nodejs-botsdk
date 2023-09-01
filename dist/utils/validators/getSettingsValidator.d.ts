import { z } from 'zod';
import { SettingsName } from '../../lib/types';
export declare const zodGetSettingsValidator: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof SettingsName>, "many">>;
export type ZodGetSettingsValidatorType = z.infer<typeof zodGetSettingsValidator>;
