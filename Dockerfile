FROM node:lts-alpine
WORKDIR /usr/src/app
EXPOSE 80

COPY package.json ./
RUN npm install --production
COPY . .

CMD ["npm", "start"]