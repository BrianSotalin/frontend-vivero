# Etapa 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Etapa 2: Correr con Node
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist/vivero-frontend ./dist/vivero-frontend
EXPOSE 4000
CMD ["node", "dist/vivero-frontend/server/server.mjs"]