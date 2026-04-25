FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY . .
RUN npm run build --prod

# Servir avec serveur static Node.js
FROM node:20-alpine
RUN npm install -g serve
COPY --from=builder /app/dist /app
EXPOSE 3000
CMD ["serve", "-s", "/app", "-l", "3000"]
