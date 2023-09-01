/*
 * Copyright (c) New Cloud Technologies, Ltd., 2013-2023
 *
 * You can not use the contents of the file in any way without New Cloud Technologies, Ltd. written permission.
 * To obtain such a permit, you should contact New Cloud Technologies, Ltd. at http://ncloudtech.com/contact.html
 *
 */

export * from './createPublicChannelValidator';
export * from './saveRoomSettingsValidator';
export * from './setUserRoleValidator';
export * from './addUsersToRoomValidator';
export * from './createChannelValidator';
export * from './usernameValidator';
export * from './createPrivateChannelValidator';
export * from './removeUserFromChannelValidator';
export * from './addUsersToRoomValidator';
export * from './getRoomInfoByRoomIdValidator';
export * from './sendMessageByRidValidator';
export * from './sendAttachmentValidator';
export * from './getSettingsValidator';
export * from './onMessageValidator';
export * from './onRoomChangeValidator';
export * from './onReactionValidator';
export * from './onEventValidator';
export * from './subscribeValidator';
export * from './unsubscribeValidator';
export * from './sendMessageToThread';
export * from './readThreadValidator';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
export function assertTypeEquality<T extends never>() {}
export type TypeEqualityGuard<A, B> = Exclude<A, B> | Exclude<B, A>;
