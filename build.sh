#!/usr/bin/env bash

cd frontend
npm run build
cd ..
python manage.py migrate --noinput
python manage.py collectstatic --noinput
