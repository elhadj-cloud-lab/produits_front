FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .
RUN npm run build -- --configuration production

# Angular 21 (@angular/build:application) génère les fichiers dans dist/<projet>/browser/
FROM node:20-alpine
RUN npm install -g serve
COPY --from=builder /app/dist/Produits_front/browser /dist
EXPOSE 80
CMD ["serve", "-s", "/dist", "-l", "80"]
