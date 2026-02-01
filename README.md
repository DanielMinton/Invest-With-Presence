# Bastion

Private wealth management platform.

## Structure

```
bastion/
├── frontend/    # Next.js + TypeScript
└── backend/     # Django + DRF
```

## Setup

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

## Environment

Copy `.env.example` to `.env` and configure for your environment.
