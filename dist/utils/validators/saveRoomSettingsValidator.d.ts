import { z } from 'zod';
import { SystemMessages } from '../../lib/types';
export declare const zodSaveRoomSettingsValidator: z.ZodObject<{
    rid: z.ZodString;
    roomName: z.ZodOptional<z.ZodString>;
    roomDescription: z.ZodOptional<z.ZodString>;
    roomTopic: z.ZodOptional<z.ZodString>;
    roomAnnouncement: z.ZodOptional<z.ZodString>;
    systemMessages: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof SystemMessages>, "many">>;
    isPrivate: z.ZodOptional<z.ZodBoolean>;
    readOnly: z.ZodOptional<z.ZodBoolean>;
    reactWhenReadOnly: z.ZodOptional<z.ZodBoolean>;
    joinCode: z.ZodOptional<z.ZodString>;
    encrypted: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    rid: string;
    roomName?: string | undefined;
    roomDescription?: string | undefined;
    roomTopic?: string | undefined;
    roomAnnouncement?: string | undefined;
    systemMessages?: SystemMessages[] | undefined;
    isPrivate?: boolean | undefined;
    readOnly?: boolean | undefined;
    reactWhenReadOnly?: boolean | undefined;
    joinCode?: string | undefined;
    encrypted?: boolean | undefined;
}, {
    rid: string;
    roomName?: string | undefined;
    roomDescription?: string | undefined;
    roomTopic?: string | undefined;
    roomAnnouncement?: string | undefined;
    systemMessages?: SystemMessages[] | undefined;
    isPrivate?: boolean | undefined;
    readOnly?: boolean | undefined;
    reactWhenReadOnly?: boolean | undefined;
    joinCode?: string | undefined;
    encrypted?: boolean | undefined;
}>;
export type ZodSaveRoomSettingsValidatorType = z.infer<typeof zodSaveRoomSettingsValidator>;
