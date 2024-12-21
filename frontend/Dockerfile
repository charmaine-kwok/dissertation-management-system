# Stage 0: Build
FROM node:18 AS builder
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml to leverage Docker caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application files
COPY . ./

# Build the application
RUN pnpm run build

# Stage 1: Serve
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy the built files from the builder stage
COPY --from=builder /app/dist .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
