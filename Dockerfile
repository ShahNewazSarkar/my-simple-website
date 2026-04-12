# Use Node.js base image
FROM node:23

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3055

CMD ["node", "server.js"]