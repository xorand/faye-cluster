FROM node:14
WORKDIR /usr/src/faye_client
COPY package*.json ./
RUN npm install
COPY *.js ./
CMD [ "node", "faye_client.js" ]