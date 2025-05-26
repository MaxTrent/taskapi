# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/config/config.cjs ./config/config.cjs
COPY --from=builder /app/.sequelizerc ./.sequelizerc

RUN npm ci --only=production && npm install sequelize-cli

EXPOSE 4000

CMD ["sh", "-c", "npx sequelize-cli db:migrate --config config/config.cjs && node dist/app.js"]