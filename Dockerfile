FROM node:16.14.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3009

RUN npm run build

CMD [ "npm", "start" ]