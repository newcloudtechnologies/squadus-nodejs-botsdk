/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */

import { z } from 'zod';

import { SystemMessages } from '../../lib/types';

export const zodSaveRoomSettingsValidator = z.object({
    rid: z.string().min(1),
    roomName: z.string().min(1).optional(),
    roomDescription: z.string().min(1).optional(),
    roomTopic: z.string().min(1).optional(),
    roomAnnouncement: z.string().min(1).optional(),
    systemMessages: z.array(z.nativeEnum(SystemMessages)).optional(),
    isPrivate: z.boolean().optional(),
    readOnly: z.boolean().optional(),
    reactWhenReadOnly: z.boolean().optional(),
    joinCode: z.string().min(1).optional(),
    encrypted: z.boolean().optional(),
});

export type ZodSaveRoomSettingsValidatorType = z.infer<
    typeof zodSaveRoomSettingsValidator
>;
