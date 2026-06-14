# Stage 1: Build & Install dependencies
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# Stage 2: Production runtime environment
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY . .

EXPOSE 5000
CMD ["node", "server.js"]
