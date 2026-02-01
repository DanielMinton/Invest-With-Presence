#!/bin/bash
# ======================
# Local Development Setup
# ======================

set -e

echo "=== Bastion Local Setup ==="

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "Node.js required. Install via: brew install node"; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "Python 3 required. Install via: brew install python@3.12"; exit 1; }

# Frontend setup
echo ""
echo "=== Frontend Setup ==="
cd frontend
cp .env.example .env 2>/dev/null || true
npm install
echo "Frontend ready. Run: cd frontend && npm run dev"

# Backend setup
echo ""
echo "=== Backend Setup ==="
cd ../backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
cp .env.example .env 2>/dev/null || true
python manage.py migrate
echo "Backend ready. Run: cd backend && source venv/bin/activate && python manage.py runserver"

echo ""
echo "=== Setup Complete ==="
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000"
