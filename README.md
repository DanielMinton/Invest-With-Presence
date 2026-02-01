# Bastion

Private wealth management platform.

## Repository Structure

This repository follows **Core vs Context** separation:

```
bastion/
├── frontend/      # CORE: Next.js + TypeScript
├── backend/       # CORE: Django + DRF
├── docs/          # CONTEXT: Architecture, compliance, specs
├── assets/        # CONTEXT: Brand, mockups, design exports
└── scripts/       # CONTEXT: CI helpers, setup automation
```

**Core** = Required for the application to function
**Context** = Documentation, design, project management

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Documentation

- [Architecture Overview](docs/architecture/overview.md)
- [Security Baseline](docs/security/baseline.md)
- [Compliance Requirements](docs/compliance/overview.md)
- [Phase Tracker](docs/milestones/phase-tracker.md)

## Environment

Copy `.env.example` to `.env` and configure for your environment.
