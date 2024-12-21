# Stage 1: Base image
FROM node:18 AS base
WORKDIR /usr/src/app

# Copy package.json and pnpm-lock.yaml to leverage caching
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application files
COPY . ./

# Ensure sqlite3 is installed
RUN apt-get update && apt-get install -y sqlite3 && rm -rf /var/lib/apt/lists/*

# Expose the application port
EXPOSE 3000

# Set environment variables for production
ENV NODE_ENV=production

# Add a healthcheck to ensure the service is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s CMD curl -f http://localhost:3000/health || exit 1

# Start the application with conditional database initialization
CMD sh -c "[ ! -f /usr/src/app/database/dissertation.db ] && sqlite3 /usr/src/app/database/dissertation.db < /usr/src/app/database/schema.sql || echo 'Database exists'; node server.js"
