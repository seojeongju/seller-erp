# Multi-stage build for NestJS API (Monorepo)
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

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
RUN pnpm build

# Debug: Check build output
RUN echo "=== Build output ===" && \
    ls -la dist/ && \
    echo "=== Files in dist ===" && \
    find dist -type f

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

# Copy packages (including Prisma schema)
COPY --from=base /app/packages ./packages

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Generate Prisma Client in production
WORKDIR /app/packages/db
RUN pnpm db:generate

# Go back to root
WORKDIR /app

# Copy built application
COPY --from=base /app/apps/api/dist ./apps/api/dist

# Expose port (Railway will set PORT env var)
EXPOSE 3001

# Start the application (from /app root)
CMD ["node", "apps/api/dist/main"]
