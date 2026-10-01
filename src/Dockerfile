# Stage 1: Node.js Front-end Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copies package manifests and installs dependencies
COPY package*.json ./
RUN npm ci

# Copies the source code and compiles the application
COPY . .
RUN npm run build

# Stage 2: Nginx web server for static files
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copies the compiled React files
COPY --from=builder /app/dist .

# Copies the Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]