FROM node:alpine

RUN mkdir -p /usr/src/api

COPY . /usr/src/api

WORKDIR /usr/src/api

RUN npm install --legacy-peer-deps

RUN npm install --quite

EXPOSE 7000

CMD npm run start