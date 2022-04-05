FROM node:alpine3.14

RUN mkdir /app

COPY . /app

WORKDIR /app

RUN npm install

EXPOSE 5200

CMD npm run start-prod