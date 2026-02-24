# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies
RUN npm ci --workspace=@aidevblogs/shared --workspace=@aidevblogs/backend

# Copy source code
COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend
COPY tsconfig.base.json ./

# Build shared package
RUN npm run build --workspace=@aidevblogs/shared

# Build backend
RUN npm run build --workspace=@aidevblogs/backend

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY packages/shared/package*.json ./packages/shared/

# Install production dependencies only
RUN npm ci --workspace=@aidevblogs/shared --workspace=@aidevblogs/backend --omit=dev

# Copy built files
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "apps/backend/dist/main.js"]
