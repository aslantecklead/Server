FROM node:14

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ENV PORT=3003

CMD ["node", "index.js"]
