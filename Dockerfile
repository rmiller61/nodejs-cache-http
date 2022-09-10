FROM node:16.0.0

WORKDIR /var/www/app

COPY package*.json ./

RUN yarn install

COPY . .

ENV PORT=8080

EXPOSE 8080

CMD [ "yarn", "start" ]