# MySquadus bot SDK

Пакет `@squadus/botsdk` содержит HTTP-клиент для осуществления запросов к серверу MySquadus. Используется для разработки ботов, работающих с мессенджером MySquadus.

# 📚 Документация

* [Требования](#требования)
* [Установка](#установка)
* [Использование](#использование)
* [Обработка ошибок](#обработка-ошибок)
* [API](#api)
* [Примеры](#примеры)

## Требования

### Node.js

Пакет `@squadus/botsdk` поддерживается Node v14 и выше. Рекомендуется использовать [последнюю версию
Node](https://github.com/nodejs/Release#release-schedule).

## Установка

Для установки @squadus/botsdk выполните команду:

```shell
$ npm install @squadus/botsdk
```

## Использование

### Инициализация клиента

Пакет `@squadus/botsdk` экспортирует класс `MySquadusClient`. Для использования нужно создать экземпляр класса, передав в конструктор адрес сервера, токен и разрешенный путь до папки с файлами, которые разрешено прикреплять к сообщениям, а затем вызвать `connect`.

```javascript
import { MySquadusClient } from '@squadus/botsdk';

// Создание клиента
const mySquadusClient = new MySquadusClient({
    token: 'a89cDxjI1l',
    server: 'https://im.example.ru/',
    allowedAttachmentsPath: './',
});
await mySquadusClient.connect();
```

Токен для авторизации можно сгенерировать вручную в веб- или настольном клиенте MySquadus. Для этого необходимо:
1. Войти в учетную запись бота.
2. Перейти на странице «Настройки» в раздел «Токены личного доступа».
3. На открывшейся странице ввести название токена.
4. Установить флажок «Игнорировать двухфакторную аутентификацию».
5. Нажать «Добавить».

---

### Вызов метода

Каждый из методов `MySquadusClient` относится к одной из сущностей:
- `room`;
- `message`;
- `subscription`.

Например, метод `sendMessageByRid` используется для отправки сообщения.
Чтобы его вызвать, необходимо обратиться к нему следующим образом: `mySquadusClient.message.sendMessageByRid()`, где
- `mySquadusClient` – инстанс класса `MySquadusClient`;
- `message` – сущность, которая содержит в себе методы для совершения операций над комнатами;
- `sendMessageByRid` – метод для отправки сообщений.

```javascript
// При известном ID комнаты (канала, команды или прямого диалога с пользователем)
const roomId = '...';

(async () => {
    const result = await mySquadusClient.message.sendMessageByRid({
        msg: 'Hello world!',
        rid: roomId,
    });

    console.log('Message is sent successfully');
})();
```

##### Примечание: 
Некоторые методы, такие как `connect`, `getSettings`, не относятся ни к одной из сущностей. Такие методы можно вызвать напрямую из инстанса класса `MySquadusClient`.

---

Так же возможно использовать имя метода в виде строки, чтобы:
- динамически определять вызываемый метод,
- вызывать методы, которые недоступны в используемой версии клиента.

Для этого можно воспользоваться конструкцией: `mySquadusClient.restClient.post(im.create, [options])`.

Приведенный выше метод может быть использован следующим образом:

```javascript
(async () => {
    const response = await mySquadusClient.restClient.post('im.create', {
        username: 'new_user',
    });
})();
```

---

## Обработка ошибок

Ошибки могут возникать по нескольким причинам: пользователь не имеет прав вызывать метод или передан неверный аргумент. В таких случаях возвращенный промис будет отклонен с ошибкой. Необходимо обработать ошибку и использовать содержащуюся в ней информацию, чтобы решить, как приложение, использующее пакет `@squadus/botsdk`, будет функционировать дальше.


```javascript
// Import ErrorCode from the package
import { MySquadusClient, ErrorCode } from '@squadus/botsdk';

const { TOKEN, SERVER } = process.env;

const mySquadusClient = new MySquadusClient({
    token: TOKEN || '',
    server: SERVER || '',
});

(async () => {
    try {
        await mySquadusClient.connect();
    } catch (error) {
        if (error === ErrorCode.AuthorizationError) {
            console.log('Authorization error');
        }
    }
})();
```

<details>
<summary markdown="span">
<strong><i>Типы ошибок</i></strong>
</summary>

Есть несколько типов ошибок из `ErrorCode`, с которыми можно столкнуться:

-   `ErrorCode.AuthorizationError`: запрос не может быть отправлен из-за ошибки в авторизации. Основная причина – непройденная авторизация или истекший токен.

-   `ErrorCode.NoSuchFileOrDirectory`: нет такого файла или директории. Ошибка может возникнуть при отправке файлов, если был неверно передан путь к файлу.

-   `ErrorCode.EmptyResult`: нет результата отправки. Если сообщение было отправлено с ошибочным id комнаты (`rid`), то в ответе не будет сообщения. Значит сообщение не было доставлено.

-   `ErrorCode.InvalidUser`: ошибочный пользователь. Если производилась попытка создать комнату с пользователем, которого нет, комната создана не будет.

-   `ErrorCode.RoomNotFound`: комната не найдена. Если при добавлении или удалении пользователя используется неверный `rid`, возникнет такая ошибка.

-   `ErrorCode.CommonError`: общая ошибка. Если не было установлено причин ошибки, будет возвращена `CommonError` ошибка.

-   `ErrorCode.ChannelNameExists`: канал с указанным названием уже существует.

-   `ErrorCode.FileToLarge`: отправляемый файл привышает допустимый размер.

-   `ErrorCode.MessageSizeExceeded`: количество символов в отправляемом сообщении привышает установленный на сервере лимит.

-   `ErrorCode.MessageSizeExceeded`: количество символов в отправляемом сообщении привышает установленный на сервере лимит.

</details>

---

## Методы API
В таблице представлены описание методов, их аргументов и возвращаемых ими значений.

| Метод                           | Группа    | Аргументы                                           | Ответ                                         | Описание                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|---------------------------------|-----------|-----------------------------------------------------|-----------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `connect()`|     -      | - | `Promise<void>` | Выполняет авторизацию |
| `getSettings({ settings, server })` | - | `settings?: Array<SettingsName>, server?: string` | `RestResponse<SettingsResponseData>` | Возвращает значения настроек для указанного сервера, имена которых были переданы в метод. Если не передавать имена, будут возвращены все настройки |
| `sendMessageByRid(params)` | `message` | `params: SendMessageByRidParams` | `Promise<MessageResponseData>` | Выполняет отправку сообщения по идентификатору комнаты |
| `sendAttachment(params)` | `message` | `params: SendAttachmentSDKParams` | `Promise<MessageResponseData>` | Выполняет отправку вложения по идентификатору комнаты |
| `createDirectRoom(username)` | `room` | `username: string` | `Promise<DirectRoomResponseData \| undefined>` | Создает личную переписку с пользователем, имя которого было передано в качестве аргумента |
| `addUsersToRoom(params)` | `room` | `params: AddUsersToRoomParams` | `RestResponse<boolean>` | Добавляет пользователя в существующую комнату |
| `removeUserFromChannel(params)` | `room` | `params: RemoveUserFromChannelParams` | `RestResponse<RemoveUserFromChannelResponseData>` | Удаляет пользователя из комнаты, в которой он состоит |
| `createChannel(params)` | `room` | `params: CreateChannelSDKParams` | `RestResponse<ChannelData>` | Создает комнату с переданными параметрами |
| `setUserRole(params)` | `room` | `params: CreatePublicChannelSDKParams \| CreatePrivateChannelSDKParams` | `RestResponse<CreatePublicChannelResponseData \| CreatePrivateChannelResponseData>` | Изменяет роль пользователя в комнате |
| `saveRoomSettings(params)` | `room` | `params: SaveRoomSettingsSDKParams` | `RestResponse<SaveRoomSettingsData>` | Изменяет настройки комнаты по ее идентификатору |
| `onMessage(callback[, rid])` | `subscription` | `callback: (msg: LastMessage) => void, rid?: string` | `Promise<OnMessagesResponse>` | Вызывает переданную функцию с новым полученным сообщением в определенном чате `rid` или во всех. Поддерживает автоматическую подписку на новые чаты и получение сообщений из тредов |
| `onRoomChange(rid, callback)` | `subscription` | `rid: string, callback: (data: RoomEvent) => void` | `Promise<OnRoomChangeResponse>` | Вызывает переданную функцию с каждым событием в чате |
| `onReaction(rid, msgId, callback)` | `subscription` | `rid: string, msgId: string, callback: (message: Message) => void` | `Promise<onReactionResponse>` | Вызывает переданную функцию с сообщением при изменении его реакций |
| `onEvent(callback)` | `subscription` | `callback: (data: WsData) => void` | `Subscription` | Вызывает переданную функцию со всеми событиями, полученными по протоколу WebSocket |
| `subscribe(collection, event)` | `subscription` | `collection: Collections, event: string` | `Promise<WsSubscription>` | Позволяет произвольно подписаться на события, которые будут получены через `onEvent` |
| `close()` | `subscription` | - | `Promise<void>` | Закрывает соединение |
| `reopen()` | `subscription` | - | `Promise<void>` | Переоткрывает соединение |
| `subscribeNotifyUser()` | `subscription` | - | `Promise<(WsSubscription)[]>` | Осуществляет подписку на WebSocket-события, связанные с текущим пользователем |
| `subscribeLoggedNotify()` | `subscription` | - | `Promise<(WsSubscription)[]>` | Осуществляет подписку на WebSocket-события об изменениях авторизованных пользователей |
| `subscribeNotifyAll()` | `subscription` | - | `Promise<(WsSubscription)[]>` | Осуществляет подписку на общие для всех пользователей WebSocket-события|
| `unsubscribe(id)` | `subscription` | `id: string` | `Promise<UnsubscribeResponseData>` | Позволяет отписываться от WebSocket-событий по id. Эти id молжно получить при подписке |
| `getUserInfoByUsername(username)` | - | `username: string` | `RestResponse<UserResponseData>` | Запрашивает информацию о пользователе по его имени |
| `sendMessageToThread(params)` | `message` | `params: SendMessageToThreadSDKParams` | `Promise<MessageResponseData>` | Отправляет сообщение в цепочку ответов |
| `readThread(parentMessageId)` | `room` | `parentMessageId: string` | `Promise<void>` | Помечает все сообщения внутри цепочки ответов с переданным `parentMessageId` как прочитанные |


## Примеры

> **Примеры вынесены в отдельный репозиторий:** [squadus-nodejs-botsdk-examples](https://github.com/newcloudtechnologies/squadus-nodejs-botsdk-examples)

Репозиторий с примерами содержит проект с несколькими сценариями использования методов SDK.

Чтобы выполнить примеры, необходимо:

1. Клонировать репозиторий с примерами и установить зависимости: `yarn`.
2. Внести токен пользователя (бота), от чьего имени будут осуществляться действия, адрес сервера и имя собеседника в файл `.env`.

```javascript
SERVER="https://******"
TOKEN="******"
PARTNER_NAME="yourPartnerName"
```
3. Запустите пример `yarn create-direct`. Если токен и адрес сервера указаны верно, а также пользователь, с которым создается диалог, существует, в консоль будет выведено сообщение `Direct dialog with ${partner_name} was created successfully`.

Примеры, которые помогут начать пользоваться `@squadus/botsdk`: 
### 1. connect.ts: `yarn connect`
Будет произведена авторизация.
### 2. getSettings.ts `yarn get-settings`
Будут получены значения настроек с сервера для `Accounts_AllowRealNameChange` и `Accounts_AddGuestsToChats`.
### 3. createDirectRoom.ts `yarn create-direct`
Будет создан диалог с собеседником, указанным в файле `.env`, если такой пользователь существует.
### 4. sendMessage.ts `yarn send-message`
С собеседником, указанным в файле `.env`, если такой пользователь существует, будет создан диалог. Затем ему будет отправлено сообщение с текстом `Hi`.
### 5. sendAttachment.ts `yarn send-attachment`
С собеседником, указанным в файле `.env`, если такой пользователь существует, будет создан диалог. Затем ему будет отправлено изображение `example.png` из проекта с сообщением `Image with logo`. Если изображение будет заменено на файл с размером, превышающим допустимый, в консоли появится сообщение об ошибке: `File is too large`. Также файл должен находиться по пути, который соответствует параметру `allowedAttachmentsPath`, указанному  при создании `mySquadusClient`.
### 6. addRemoveChannelUser.ts `yarn add-remove-channel-user`
Собеседник, указанный в файле `.env`, если такой пользователь существует, будет добавлен в указанный канал. Затем он будет удален из него.
### 7. createPrivateChannel.ts `yarn create-channel:private`
Будет создан приватный канал с именем, указанным в константе `PRIVATE_CHANNEL_NAME`.
### 8. createPrivateChannel.ts `yarn create-channel:public`
Будет создан открытый канал с именем, указанным в константе `PUBLIC_CHANNEL_NAME`.
### 9. changeUserRole.ts `yarn change-role`
Будет создан открытый канал c пользователем. Затем пользователю будет назначена роль «Модератор».
### 10. editChannel.ts `yarn edit-channel`
Будет создан канал, затем имя канала будет изменено.
### 11. subscribeMessages.ts `yarn subscribe-messages`
Ботом будет выполнена подписка на все новые сообщения, а также отдельная подписка на новые личные сообщения от пользователя, имя которого указано в переменной окружения `PARTNER_NAME`. При получении ботом сообщения _«Hi»_ от пользователя `PARTNER_NAME`, будет отправлен ответ _«Hello»_. При получении ботом сообщения _«Bye»_ из любого чата, будет отправлен ответ _«Bye»_. Через 20 секунд произойдет отписка от сообщений _«Hi»_, через 40 секунд произойдет отписка от сообщений _«Bye»_.
### 12. subscribeReaction.ts `yarn subscribe-reaction`
Ботом будет выполнена подписка на все новые сообщения.
После получения ботом сообщения _«start»_, бот отправит ответное сообщение, на реакции которого произойдет подписка ботом. 
Если поставить реакцию с эмоджи :clap: на это сообщение любым пользователем, в тот же чат бот отправит сообщение, содержащее эмоджи :sunrise_over_mountains:, если будет реакция с :grinning:, то сообщение с эмоджи :soccer:. 
После отправки ботом сообщения на реакцию, бот отпишется от реакций на это сообщение.
### 13. subscribeRoom.ts `yarn subscribe-room`
Ботом будет выполнена подписка на события в личных сообщениях с пользователем, имя которого указано в переменной окружения `PARTNER_NAME`.
Если пользователь `PARTNER_NAME` или сам бот начал или прекратил печатать сообщение в этом чате, в консоль будет выведено сообщение об этом.
### 14. sendMessageToThread.ts `yarn send-message:thread`
Будет отправлено сообщение, на основании идентификатора которого будет создана цепочка ответов. 
### 15. readThread.ts `yarn read-thread`
Будет отправлено сообщение, на основании идентификатора которого будет создана цепочка ответов. Цепочка ответов будет отмечена как прочитанная пользователем, имя и токен которого указаны в переменных окружения `PARTNER_NAME` и `PARTNER_TOKEN` соответственно.
### 16. getUserInfoByEmail.ts `yarn get-user-info-by-email`
Будет выполнен запрос информации о пользователе по его email, который указан в переменной окружения `PARTNER_EMAIL`.
### 17. subscribeMessagesThread.ts `yarn subscribe-messages-thread`
Бот создаст личный диалог с пользователем `PARTNER_NAME`, отправит родительское сообщение и создаст тред. Затем будет выполнена подписка на все новые сообщения через `subscription.onMessage()`. Если пользователь ответит в этом треде сообщением _«Hi»_, бот получит сообщение из цепочки ответов и отправит _«Test passed :white_check_mark:»_ в тот же тред. Этот пример проверяет получение сообщений из тредов в уже существующей комнате.
### 18. subscribeMessagesAutoResubscribe.ts `yarn subscribe-messages-auto-resubscribe`
Ботом будет выполнена подписка на все новые сообщения через `subscription.onMessage()`. После этого бот создаст новый приватный чат, добавит в него пользователя `PARTNER_NAME` и отправит туда инструкцию. Если пользователь ответит в этом новом чате сообщением _«Hi»_, бот получит сообщение без ручной переподписки на `rooms-changed` и отправит ответ _«Test case is passed :white_check_mark:»_. Для чистой проверки удобно использовать пользователя, с которым у бота ещё нет активного чата.
### 19. subscribeMessagesAutoResubscribeDirect.ts `yarn subscribe-messages-auto-resubscribe-direct`
Ботом будет выполнена подписка на все новые сообщения через `subscription.onMessage()`. После этого бот создаст новый личный диалог с пользователем `PARTNER_NAME` и отправит туда инструкцию. Если пользователь ответит в этом новом личном диалоге сообщением _«Hi»_, бот получит сообщение без ручной переподписки на `rooms-changed` и отправит ответ _«Test case is passed :white_check_mark:»_. Для чистой проверки удобно использовать пользователя, с которым у бота ещё нет активного личного диалога.
### 20. subscribeMessagesAutoResubscribeThread.ts `yarn subscribe-messages-auto-resubscribe-thread`
Ботом будет выполнена подписка на все новые сообщения через `subscription.onMessage()`. После этого бот создаст новый личный диалог с пользователем `PARTNER_NAME`, отправит туда родительское сообщение и создаст новый тред. Если пользователь ответит в этом новом треде сообщением _«Hi»_, бот получит сообщение без ручной переподписки и отправит ответ _«Test case is passed :white_check_mark:»_ в тот же тред.
### 21. connectViaProxy.ts: `yarn connect:proxy`
Будет произведена авторизация на сервере через узказанный в окружении `PROXY_URL`.
