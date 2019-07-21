FROM node:10.16.0-alpine AS builder

RUN mkdir /app
WORKDIR /app

COPY dist/package.json /app/package.json
COPY dist/package-lock.json /app/package-lock.json
RUN npm install -D

COPY . /app

RUN npm run build

#
FROM node:10.16.0-alpine

RUN mkdir /app
WORKDIR /app

COPY --from=builder /app/dist/package.json /app/package.json
COPY --from=builder /app/dist/package-lock.json /app/package-lock.json

RUN npm install --production

COPY --from=builder /app/dist/ /app

ENV STORE_FILES /rawfiles
VOLUME /rawfiles

CMD npm run --production start
