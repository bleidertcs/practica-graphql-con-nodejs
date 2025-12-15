# ---- Base ----
FROM node:20-alpine AS base
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# ---- Dependencies ----
FROM base AS dependencies
RUN pnpm install --frozen-lockfile --prod

# ---- Build ----
FROM base AS build
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# ---- Release ----
FROM node:20-alpine AS release
WORKDIR /app

# Create migrations directory
RUN mkdir -p migrations

# Copy production dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy built application
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./

# Copy migrations & knexfile for database updates (ONLY JavaScript versions)
COPY --from=build /app/knexfile.mjs ./
COPY --from=build /app/migrations/*.mjs ./migrations/

# Set environment
ENV NODE_ENV=production

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/ || exit 1

# Start application
CMD ["node", "dist/index.js"]
