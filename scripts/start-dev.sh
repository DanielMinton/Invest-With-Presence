#!/bin/bash
# Bastion Development Startup Script
# Run this to start both backend and frontend servers

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

echo "========================================="
echo "  Bastion Development Environment"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if servers are already running
if lsof -i :8000 >/dev/null 2>&1; then
    echo -e "${BLUE}Backend already running on port 8000${NC}"
else
    echo -e "${GREEN}Starting backend server...${NC}"
    cd "$PROJECT_DIR/backend"
    source venv/bin/activate
    python manage.py runserver &
    BACKEND_PID=$!
    echo "Backend PID: $BACKEND_PID"
fi

if lsof -i :3000 >/dev/null 2>&1; then
    echo -e "${BLUE}Frontend already running on port 3000${NC}"
else
    echo -e "${GREEN}Starting frontend server...${NC}"
    cd "$PROJECT_DIR/frontend"
    npm run dev &
    FRONTEND_PID=$!
    echo "Frontend PID: $FRONTEND_PID"
fi

echo ""
echo "========================================="
echo "  Servers Running"
echo "========================================="
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8000"
echo "  API:      http://localhost:8000/api/"
echo ""
echo "  Press Ctrl+C to stop all servers"
echo "========================================="

# Wait for interrupt
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM
wait
