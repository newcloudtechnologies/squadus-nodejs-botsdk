# Contributing

1. Сделайте fork проекта
2. Склонируйте репозиторий на свой локальный компьютер
    ```bash
    git clone https://github.com/newcloudtechnologies/squadus-nodejs-botsdk.git
    ``` 
3. Создайте новую ветку для ваших изменений
    ```bash
    git checkout -b branch_name
    ```
4. Добавьте изменения и выполните команды на локальной машине (см. ниже)
    1. Установите зависимости (мы рекомндуем использовать yarn)
     ```
     yarn
     ```
5. Проверьте свой код с помощью тестов и линтеров
   ```bash
   yarn lint
   yarn test
   ```
6. Создайте коммит своих изменений
    ```bash
    git add .
    git commit -m "add new feature"
    ```
7. Отправьте свои изменения на github
    ```bash
    git push
    ```
8. Создайте Pull Request в этот репозиторий
