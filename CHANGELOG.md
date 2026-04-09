# Changelog

## [0.0.2]

### Added
- Поддержка новых Bearer заголовков авторизации WebSocket (для серверов >= 26.1.0)
- Автоматическая переподписка на новые комнаты в `onMessage` (auto-resubscribe)
- Поддержка прокси (HTTP/HTTPS/SOCKS4/SOCKS5) через параметр `proxyUrl` в конструкторе клиента
- Обновлены внешние библиотеки с актуальными патчами безопасности
- Добавлен метод SDK `getUserInfoByEmail(email)` для получения информации о пользователе по email
- Добавлен метод SDK `getRoomInfoByRoomId(params)` для получения информации о комнате по идентификатору
- Добавлена опция `includeThreadMessages` в `onMessage` для получения сообщений из тредов
- Валидация входных параметров всех методов SDK с помощью Zod
- Валидация пути к вложениям (`allowedAttachmentsPath`) при отправке файлов
- Проверка совместимости версии сервера при подключении (`MIN_SUPPORT_VERSION`)
- Автоматическое переподключение WebSocket с экспоненциальной задержкой (`reconnectWS`)
- Цветной вывод сообщений SDK в консоль

### Changed
- Примеры NodeJS Bot SDK вынесены в отдельный пакет `@squadus/botsdkexamples`
- Конфигурация ESLint вынесена в общий пакет `@squadus/eslint-config`
- Улучшена типизация для всех публичных методов SDK
- Рефакторинг контроллеров (message, room, subscription)

## [0.0.1]

### Added
- Первая версия SDK
- HTTP-клиент для взаимодействия с сервером MySquadus
- WebSocket-клиент для получения событий в реальном времени
- Контроллер сообщений: `sendMessageByRid`, `sendAttachment`, `sendMessageToThread`
- Контроллер комнат: `createChannel`, `createDirectRoom`, `addUsersToRoom`, `removeUserFromChannel`, `setUserRole`, `saveRoomSettings`, `readThread`
- Контроллер подписок: `onMessage`, `onRoomChange`, `onReaction`, `onEvent`, `subscribe`, `unsubscribe`
- Авторизация по токену личного доступа
- Обработка ошибок с типизированными кодами (`ErrorCode`)
