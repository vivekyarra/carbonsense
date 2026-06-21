# Stage 1: Build the React App
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci && \
    npm cache clean --force

COPY . .

ARG VITE_API_URL=https://carbonsense-api-806649223406.us-central1.run.app/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Serve with NGINX
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html

ARG API_ORIGIN=https://carbonsense-api-806649223406.us-central1.run.app

# Set permissions for an unprivileged runtime.
RUN sed -i "s|__API_ORIGIN__|${API_ORIGIN}|g" /etc/nginx/nginx.conf && \
    chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/run /run /var/log/nginx && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 8080

USER nginx

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1:8080/ >/dev/null || exit 1

ENTRYPOINT []
CMD ["nginx", "-g", "daemon off;"]
