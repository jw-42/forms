# Multi-stage build for optimized production image
FROM oven/bun:1-alpine AS base

# Install system dependencies
RUN apk add --no-cache openssl

WORKDIR /app

# Install dependencies stage
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Build stage
FROM base AS builder
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN bunx prisma generate

# Production stage
FROM base AS production

# Use existing bun user (already exists in oven/bun:1-alpine)
# No need to create new user

# Copy dependencies from deps stage
COPY --from=deps --chown=bun:bun /app/node_modules ./node_modules

# Copy Prisma schema and generated client
COPY --from=builder --chown=bun:bun /app/prisma ./prisma
COPY --from=builder --chown=bun:bun /app/node_modules/.prisma ./node_modules/.prisma

# Copy source code
COPY --from=builder --chown=bun:bun /app/src ./src
COPY --from=builder --chown=bun:bun /app/tsconfig.json ./

# Switch to non-root user
USER bun

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun run --version || exit 1

# Start application with migration and generation
CMD ["sh", "-c", "bunx prisma migrate deploy && bunx prisma generate && bun run src/app.ts"] 