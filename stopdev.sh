#!/bin/bash

# AIDevBlogs Development Stop Script
# This script stops all development services and kills running ports

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Stopping AIDevBlogs Development     ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Ports used by the development environment
PORTS=(3000 3001 5173 5174)

# Function to kill processes on a specific port
kill_port() {
    local port=$1
    local pids=$(lsof -ti:$port 2>/dev/null)

    if [ -n "$pids" ]; then
        echo -e "${YELLOW}Killing processes on port $port...${NC}"
        echo "$pids" | xargs kill -9 2>/dev/null
        echo -e "${GREEN}  ✓ Port $port cleared${NC}"
        return 0
    else
        echo -e "  Port $port is already free"
        return 1
    fi
}

# Kill processes on all development ports
echo -e "${YELLOW}Stopping services on development ports...${NC}"
killed_any=false

for port in "${PORTS[@]}"; do
    if kill_port $port; then
        killed_any=true
    fi
done

echo ""

# Kill any node processes related to the project
echo -e "${YELLOW}Checking for related Node.js processes...${NC}"
node_pids=$(pgrep -f "node.*AIDevBlogs" 2>/dev/null || true)

if [ -n "$node_pids" ]; then
    echo -e "${YELLOW}Killing related Node.js processes...${NC}"
    echo "$node_pids" | xargs kill -9 2>/dev/null || true
    echo -e "${GREEN}  ✓ Node.js processes stopped${NC}"
    killed_any=true
else
    echo -e "  No related Node.js processes found"
fi

echo ""

# Option to stop Docker containers
echo -e "${YELLOW}Checking Docker containers...${NC}"
if docker compose -f "$PROJECT_ROOT/docker-compose.yml" ps --services --filter "status=running" 2>/dev/null | grep -q .; then
    echo -e "${BLUE}Docker containers are running.${NC}"
    read -p "Do you want to stop Docker containers (PostgreSQL)? [y/N]: " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Stopping Docker containers...${NC}"
        docker compose -f "$PROJECT_ROOT/docker-compose.yml" down
        echo -e "${GREEN}  ✓ Docker containers stopped${NC}"
    else
        echo -e "  Docker containers left running"
    fi
else
    echo -e "  No Docker containers running"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Development Environment Stopped     ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Summary
echo -e "${BLUE}Summary:${NC}"
echo -e "  • Ports checked: ${PORTS[*]}"
if [ "$killed_any" = true ]; then
    echo -e "  • ${GREEN}Services have been stopped${NC}"
else
    echo -e "  • No running services found"
fi
echo ""
