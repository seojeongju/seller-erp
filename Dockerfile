# Multi-stage build for NestJS API (Monorepo)
FROM node:18-alpine AS base

# Cache buster - change this value to force rebuild
ARG CACHEBUST=2

# Install pnpm
RUN echo "Cache bust: $CACHEBUST" && npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./

# Copy all package.json files
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/
COPY packages/types/package.json ./packages/types/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY apps/api ./apps/api
COPY packages ./packages

# Generate Prisma Client
WORKDIR /app/packages/db
RUN pnpm db:generate

# Build the application
WORKDIR /app/apps/api
RUN pnpm build && \
    echo "=== Build completed ===" && \
    echo "=== Current directory: $(pwd) ===" && \
    ls -la && \
    echo "=== dist directory ===" && \
    ls -la dist/ 2>/dev/null || echo "No dist found" && \
    echo "=== All JS files ===" && \
    find . -name "*.js" -type f | head -20

# Production stage
FROM node:18-alpine AS production

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./

# Copy package.json files
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/
COPY packages/types/package.json ./packages/types/

# Copy packages source (needed for workspace resolution and Prisma)
COPY --from=base /app/packages ./packages

# Copy tsconfig for packages/types build
COPY apps/api/tsconfig.json ./apps/api/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Build packages/types
WORKDIR /app/packages/types
RUN pnpm build 2>&1 || echo "Types build completed or no build needed"

# Generate Prisma Client in production
WORKDIR /app/packages/db
RUN pnpm db:generate

# Go back to root
WORKDIR /app

# Copy built application (includes compiled packages in dist)
COPY --from=base /app/apps/api/dist ./apps/api/dist

# Debug: Check what was copied
RUN echo "=== Production stage: Checking copied files ===" && \
    ls -la /app/ && \
    echo "=== apps/api directory ===" && \
    ls -la /app/apps/api/ && \
    echo "=== dist directory ===" && \
    ls -la /app/apps/api/dist/ 2>/dev/null || echo "dist directory not found!" && \
    echo "=== Finding all .js files ===" && \
    find /app/apps -name "*.js" -type f 2>/dev/null || echo "No JS files found"

# Expose port (Railway will set PORT env var)
EXPOSE 3001

# Start the application (from /app root)
CMD ["node", "apps/api/dist/apps/api/src/main"]
