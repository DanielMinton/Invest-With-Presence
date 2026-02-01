# Bastion

Private wealth management platform with security-first architecture.

## Repository Structure

```
bastion/
├── frontend/      # Next.js 14 + TypeScript + Tailwind
├── backend/       # Django 5 + Django REST Framework
├── docs/          # Architecture, compliance, discovery docs
├── assets/        # Brand assets, mockups
└── scripts/       # CI helpers, setup automation
```

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seeddata  # Optional: load test data
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local  # Configure API URL
npm run dev
```

### Default Test User
After running `seeddata`:
- Email: `admin@bastion.local`
- Password: `admin123`

## Architecture

| Component | Port | Technology |
|-----------|------|------------|
| Frontend | 3000 | Next.js 14, TypeScript, Tailwind |
| Backend API | 8000 | Django 5, DRF, SimpleJWT |
| Database | - | SQLite (dev) / PostgreSQL (prod) |

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/auth/` | Authentication (login, logout, refresh) |
| `/api/clients/` | Client management |
| `/api/households/` | Household management |
| `/api/accounts/` | Account management |
| `/api/documents/` | Document vault |
| `/api/briefings/` | Client briefings workflow |
| `/api/dashboard/` | Dashboard stats and activity |
| `/api/audit-logs/` | Compliance audit logs |
| `/api/users/` | User management (admin) |
| `/api/settings/` | System settings |

## Frontend Routes

| Route | Description |
|-------|-------------|
| `/hub` | Advisor dashboard |
| `/hub/clients` | Client list |
| `/hub/clients/[id]` | Client detail |
| `/hub/documents` | Document vault |
| `/hub/briefings` | Briefings management |
| `/hub/audit` | Audit log viewer |
| `/hub/settings` | System settings |
| `/hub/users` | User management |

## Documentation

- [CLAUDE.md](CLAUDE.md) - Project knowledge for AI assistants
- [Architecture Overview](docs/architecture/overview.md)
- [Security Baseline](docs/security/baseline.md)
- [Compliance Requirements](docs/compliance/overview.md)
- [Project Brief](docs/PROJECT_BRIEF.md)

## Development

```bash
# Run both servers (use separate terminals)
./scripts/start-dev.sh

# TypeScript check
cd frontend && npx tsc --noEmit

# Django shell
cd backend && python manage.py shell
```

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Backend (.env)
```
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```
