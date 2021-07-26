FROM node:alpine

WORKDIR /usr/src/api

COPY ./package*.json ./

USER root

RUN yarn

COPY --chown=node:node . .

EXPOSE 3000

CMD ["yarn", "start"]