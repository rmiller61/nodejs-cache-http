FROM node:16.0.0

WORKDIR /var/www/app

COPY package*.json ./

COPY yarn.lock ./

COPY . .

RUN yarn

ENV PORT=8080

ENV REDIS_URL=redis://db:6379

ENV NODE_ENV=development

EXPOSE 8080

CMD [ "yarn", "start" ]
