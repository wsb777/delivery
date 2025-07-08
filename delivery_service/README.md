# Бекэнд часть Delivery
## Создание базы данных
При разработки на windows я пользовался pgAdmin4.

Нам нужно:

1. Создать суперпользователя

2. Создать базу данных и сделать владельцем нашего пользователя
## Запуск delivery_service
При разработке я использовал Python 3.12.6
1. Создаем виртуальное окружение "python -m venv venv"

2. Активируем виртуальное окружение через "./venv/Scripts/activate"

3. Скачиваем нужные библиотеки командой "pip install -r requirements.txt"

4. Создаем и заполняем файл .env, по примеру .env.example

5. Далее команды по списку:
    + "python manage.py makemigrations"
    + "python manage.py migrate" 
    + "python manage.py collectstatic"
    + "python manage.py createsuperuser" - заполняем нужны поля
    + "python manage.py runserver" - заполняем нужны поля

6. Теперь можно перейти на "localhost:8000/admin"


## Работа с фронтом
Чтобы сайт работал вместе с фронтом нам нужно правильно настроить NGINX для разработки. Пример указан в файле "nginx.conf.example".