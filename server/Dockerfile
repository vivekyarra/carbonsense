FROM node:20-alpine

WORKDIR /app

# Install build tools for better-sqlite3
RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm install --production

COPY . .

# Initialize the database schema
RUN node src/models/db.js
# Seed the database
RUN node src/utils/seed.js

ENV NODE_ENV=production
# Cloud Run sets the PORT env variable
ENV PORT=8080 
EXPOSE 8080

CMD ["npm", "start"]
