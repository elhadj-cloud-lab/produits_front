FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install -g npm@11.7.0 && npm ci && npm cache clean --force
COPY . .
RUN npm run build -- --configuration production

# Angular 21 (@angular/build:application) génère les fichiers dans dist/<projet>/browser/
FROM node:22-alpine
RUN npm install -g serve
COPY --from=builder /app/dist/Produits_front/browser /dist
EXPOSE 80
CMD ["serve", "-s", "/dist", "-l", "80"]
