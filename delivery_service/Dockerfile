FROM python:3.12.6-slim

# Аргументы для совместимости прав с хостом
ARG USER_ID=1000
ARG GROUP_ID=1000

RUN groupadd -r -g ${GROUP_ID} groupdjango && \
    useradd -r -u ${USER_ID} -g groupdjango userdj

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN pip install --upgrade pip
WORKDIR /app/www/delivery_service

COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

# Создаем правильные директории для статики
RUN mkdir -p /var/www/django_static /var/www/media_files && \
    chown -R userdj:groupdjango /var/www && \
    chmod -R 775 /var/www  # Добавьте эту строку

# Изменяем настройки Django через переменные окружения
ENV STATIC_ROOT=/var/www/django_static
ENV MEDIA_ROOT=/var/www/media_files