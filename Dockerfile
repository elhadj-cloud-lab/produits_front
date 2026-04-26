FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .
RUN npm run build -- --configuration production

# Servir avec serveur static Node.js
FROM node:20-alpine
RUN npm install -g serve
COPY --from=builder /app/dist /dist
EXPOSE 3000
CMD ["sh", "-c", "serve -s /dist/* -l 3000"]
