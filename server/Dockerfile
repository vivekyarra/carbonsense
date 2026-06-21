FROM node:20-alpine

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Install build tools for better-sqlite3
RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm ci --omit=dev && \
    npm cache clean --force

COPY . .

# Initialize the database schema
RUN node src/models/db.js
# Seed the database
RUN node src/utils/seed.js

# Remove build tools to reduce attack surface
RUN apk del python3 make g++

# Set proper ownership
RUN chown -R appuser:appgroup /app

ENV NODE_ENV=production
# Cloud Run sets the PORT env variable
ENV PORT=8080
EXPOSE 8080

# Run as non-root user
USER appuser

CMD ["npm", "start"]
