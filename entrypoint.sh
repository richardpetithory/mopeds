#!/usr/bin/env bash

if [ "$DEVELOPMENT_MODE" = "True" ]; then
    echo "Waiting for postgres..."
    while ! nc -z db 5432; do
        sleep 0.1
    done
    echo "PostgreSQL started"
fi

python manage.py migrate --noinput
python manage.py collectstatic --noinput

if [ "$DEVELOPMENT_MODE" = "True" ]; then
    python manage.py runserver 0.0.0.0:8000
else
    gunicorn --bind 0.0.0.0:80 mopeds.wsgi:application
fi
