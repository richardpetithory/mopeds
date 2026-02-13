FROM python:3.13-alpine

ENV PYTHONUNBUFFERED 1

# Install system dependencies
RUN apk update && apk add netcat-openbsd bash

WORKDIR /backend

COPY . /backend/

#RUN apk add --update --no-cache postgresql-dev gcc python3-dev musl-dev

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

#CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]
CMD ["bash", "startup.sh"]
