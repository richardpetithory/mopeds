FROM python:3.13-alpine

ENV PYTHONUNBUFFERED 1

# Install system dependencies
RUN apk update && apk add netcat-openbsd bash nodejs npm

WORKDIR /backend

COPY . /backend/

RUN pip install --root-user-action ignore --upgrade pip
RUN pip install --root-user-action ignore -r requirements.txt

ENTRYPOINT ["./entrypoint.sh"]
