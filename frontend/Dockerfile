# Etapa 1: Construcción de la SPA con Vite
FROM node:20-alpine AS builder

WORKDIR /app

# Variable para permitir URLs relativas o personalizadas en compilación
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm ci || npm install

COPY . .
RUN npm run build

# Etapa 2: Servidor Nginx de producción
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./* /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
