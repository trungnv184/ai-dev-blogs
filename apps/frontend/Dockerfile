# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/frontend/package*.json ./apps/frontend/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies
RUN npm ci --workspace=@shared --workspace=@aidevblogs/frontend

# Copy source code
COPY packages/shared ./packages/shared
COPY apps/frontend ./apps/frontend
COPY tsconfig.base.json ./

# Build shared package
RUN npm run build --workspace=@shared

# Build frontend
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build --workspace=@aidevblogs/frontend

# Production stage
FROM nginx:alpine AS production

# Copy nginx config
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
