FROM node:8.6.0-alpine

RUN mkdir /app
WORKDIR /app


COPY dist/package.json /app/package.json
COPY dist/package-lock.json /app/package-lock.json

RUN npm install --production

COPY dist/ /app

CMD node /app/src/server.js
