#!/bin/bash

# AIDevBlogs Development Startup Script
# This script sets up and runs the entire development environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   AIDevBlogs Development Environment  ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to wait for PostgreSQL to be ready
wait_for_postgres() {
    echo -e "${YELLOW}Waiting for PostgreSQL to be ready...${NC}"
    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if docker compose -f "$PROJECT_ROOT/docker-compose.yml" exec -T postgres pg_isready -U postgres >/dev/null 2>&1; then
            echo -e "${GREEN}PostgreSQL is ready!${NC}"
            return 0
        fi
        echo -e "  Attempt $attempt/$max_attempts..."
        sleep 1
        ((attempt++))
    done

    echo -e "${RED}PostgreSQL failed to start within timeout${NC}"
    return 1
}

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command_exists docker; then
    echo -e "${RED}Error: Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! command_exists node; then
    echo -e "${RED}Error: Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}Error: npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${GREEN}All prerequisites met!${NC}"
echo ""

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Start PostgreSQL using Docker Compose
echo -e "${YELLOW}Starting PostgreSQL with Docker Compose...${NC}"
cd "$PROJECT_ROOT"
docker compose up -d postgres

# Wait for PostgreSQL to be ready
wait_for_postgres

echo -e "${GREEN}Database 'personal_website' is ready${NC}"
echo ""

# Install dependencies if needed
echo -e "${YELLOW}Checking dependencies...${NC}"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
else
    echo -e "${GREEN}Dependencies already installed${NC}"
fi

# Build shared package
echo -e "${YELLOW}Building shared package...${NC}"
cd "$PROJECT_ROOT/packages/shared"
npm run build
echo -e "${GREEN}Shared package built${NC}"
echo ""

# Create .env files if they don't exist
echo -e "${YELLOW}Checking environment files...${NC}"

if [ ! -f "$PROJECT_ROOT/apps/backend/.env" ]; then
    echo -e "${YELLOW}Creating backend .env file...${NC}"
    cat > "$PROJECT_ROOT/apps/backend/.env" << 'EOF'
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=personal_website

# JWT
JWT_SECRET=dev-secret-key-change-in-production-abc123
JWT_REFRESH_SECRET=dev-refresh-secret-key-change-in-production-xyz789
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:5174

# Email (placeholder - configure for production)
# SENDGRID_API_KEY=your-sendgrid-api-key

# File uploads (placeholder - configure for production)
# CLOUDINARY_URL=cloudinary://...
# CV_URL=/uploads/cv/resume.pdf
EOF
    echo -e "${GREEN}Backend .env created${NC}"
else
    echo -e "${GREEN}Backend .env already exists${NC}"
fi

if [ ! -f "$PROJECT_ROOT/apps/frontend/.env" ]; then
    echo -e "${YELLOW}Creating frontend .env file...${NC}"
    cat > "$PROJECT_ROOT/apps/frontend/.env" << 'EOF'
VITE_API_URL=http://localhost:3000/api
# VITE_GA_TRACKING_ID=G-XXXXXXXXXX
EOF
    echo -e "${GREEN}Frontend .env created${NC}"
else
    echo -e "${GREEN}Frontend .env already exists${NC}"
fi
echo ""

# Seed admin user if not exists
echo -e "${YELLOW}Checking admin user...${NC}"
cd "$PROJECT_ROOT/apps/backend"
npm run seed:admin 2>/dev/null || echo -e "${GREEN}Admin user already exists${NC}"
echo ""

# Start the applications
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}      Starting Development Servers     ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    echo -e "${GREEN}Development servers stopped${NC}"
    echo -e "${YELLOW}Note: PostgreSQL container is still running. To stop it:${NC}"
    echo -e "  docker compose down"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend
echo -e "${YELLOW}Starting backend server...${NC}"
cd "$PROJECT_ROOT/apps/backend"
npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend
echo -e "${YELLOW}Starting frontend server...${NC}"
cd "$PROJECT_ROOT/apps/frontend"
npm run dev &
FRONTEND_PID=$!

# Wait a bit for frontend to start
sleep 3

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Development Environment is Ready!   ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "  ${BLUE}Frontend:${NC}  http://localhost:5173"
echo -e "  ${BLUE}Backend:${NC}   http://localhost:3000/api"
echo -e "  ${BLUE}Health:${NC}    http://localhost:3000/api/health"
echo -e "  ${BLUE}Database:${NC}  localhost:5432 (personal_website)"
echo ""
echo -e "  ${BLUE}Admin Login:${NC}"
echo -e "    URL:      http://localhost:5173/admin"
echo -e "    Email:    admin@aidevblogs.com"
echo -e "    Password: admin123"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
