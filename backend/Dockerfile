FROM node:16

WORKDIR /usr/src/app

COPY . .

# Install app dependencies
RUN npm install

RUN npm run build

EXPOSE 8080
CMD ["npm start"]