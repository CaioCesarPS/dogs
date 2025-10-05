FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production
RUN npm install @nestjs/cli -g
RUN npm run build

COPY . .

EXPOSE 3000
CMD ["node", "dist/main.js"]