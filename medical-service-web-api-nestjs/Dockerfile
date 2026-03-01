FROM node:20-slim

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npm ci && npm cache clean --force

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]