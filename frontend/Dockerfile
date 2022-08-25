FROM node:18 as dev

RUN mkdir -p /usr/src/frontend

WORKDIR /usr/src/frontend

COPY . .

RUN npm install

RUN npm run build
