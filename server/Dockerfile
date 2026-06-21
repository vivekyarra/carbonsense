FROM node:24-alpine AS dependencies

WORKDIR /app

# Install build tools for better-sqlite3
RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm ci --omit=dev && \
    npm cache clean --force

FROM node:24-alpine

WORKDIR /app

RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN mkdir -p /app/data && chown -R appuser:appgroup /app

ENV NODE_ENV=production
# Cloud Run sets the PORT env variable
ENV PORT=8080
EXPOSE 8080

USER appuser

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1:8080/health >/dev/null || exit 1

CMD ["npm", "start"]
