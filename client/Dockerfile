# Stage 1: Build the React App
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci && \
    npm cache clean --force

COPY . .

RUN npm run build

# Stage 2: Serve with NGINX
FROM nginx:1.27-alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
