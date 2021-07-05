FROM node:14
WORKDIR /usr/src/faye
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "node", "faye.js" ]