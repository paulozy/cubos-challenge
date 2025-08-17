# Development stage
FROM node:22-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

# Production stage
FROM node:22-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN npm run build

CMD ["node", "dist/main"]
