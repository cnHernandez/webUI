# Etapa de build

FROM node:22-slim AS builder
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --frozen-lockfile || npm install
COPY . .
RUN npm run build

# Etapa de producción
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html
RUN apk update && apk upgrade --no-cache
COPY --from=builder /app/dist .
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
