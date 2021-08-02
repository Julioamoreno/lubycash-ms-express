FROM node:alpine

WORKDIR /usr/src/api

COPY ./package*.json ./

USER root

RUN yarn

COPY --chown=node:node . .

EXPOSE 3000

ADD start.sh /
RUN chmod +x /start.sh

CMD ["/start.sh"]