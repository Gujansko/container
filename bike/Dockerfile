FROM node

RUN npm install -g nodemon

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 4001

CMD ["npm", "run", "start"]