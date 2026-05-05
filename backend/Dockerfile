FROM node:20-alpine

# Install OpenSSL — required by Prisma
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 5000

CMD ["node", "src/server.js"]