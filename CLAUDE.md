# Bastion - Claude Project Knowledge

## Project Overview

**Bastion** is a security-first private wealth management platform for an independent wealth advisor. It consists of three surfaces:

1. **Public Site** - Brand presence, philosophy, secure contact
2. **Members Vault** - Client-facing portal for documents, briefings, reports
3. **Bastion Hub** - Internal advisor dashboard for operations, risk workflow, client management

## Repository Structure

```
bastion/
├── frontend/                 # Next.js 14 + TypeScript + Tailwind
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── hub/         # Advisor dashboard (authenticated)
│   │   │   ├── members/     # Client portal (authenticated)
│   │   │   └── public/      # Public pages
│   │   ├── components/      # React components
│   │   │   └── hub/         # Hub-specific components
│   │   └── lib/             # Utilities, API clients, providers
│   │       └── api/         # API client modules
│   └── public/              # Static assets
├── backend/                  # Django 5 + Django REST Framework
│   └── bastion/
│       ├── api/             # DRF views, serializers, URLs
│       │   ├── views/       # ViewSets organized by domain
│       │   └── serializers/ # Serializers organized by domain
│       ├── core/            # User, Household, Client, Account models
│       ├── audit/           # AuditLog model for compliance
│       ├── documents/       # Document vault models
│       └── briefings/       # Briefing and notification models
├── docs/                     # Architecture, compliance, discovery docs
├── assets/                   # Brand assets, mockups
└── scripts/                  # CI/automation scripts
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Django 5, Django REST Framework, SimpleJWT |
| Database | SQLite (dev), PostgreSQL (prod) |
| Auth | JWT with access/refresh tokens, MFA ready |

## Current State (as of Feb 2026)

### Completed Features

**Authentication:**
- JWT-based auth with access/refresh tokens
- Login/logout flows
- Protected routes on frontend

**Backend APIs:**
- `/api/auth/` - Login, logout, refresh, me endpoints
- `/api/households/` - Household CRUD
- `/api/clients/` - Client CRUD with accounts sub-resource
- `/api/accounts/` - Account CRUD
- `/api/documents/` - Document vault with categories
- `/api/briefings/` - Briefing workflow (draft → review → approved → sent)
- `/api/notifications/` - User notifications
- `/api/dashboard/stats/` - Dashboard statistics
- `/api/dashboard/activity/` - Recent activity feed
- `/api/audit-logs/` - Compliance audit logs
- `/api/users/` - User management (admin only)
- `/api/settings/` - System settings

**Frontend Pages:**
- `/hub` - Dashboard with stats, activity, tasks
- `/hub/clients` - Client list with search/filter
- `/hub/clients/[id]` - Client detail with tabs
- `/hub/documents` - Document vault with categories
- `/hub/briefings` - Briefing list with approve/send workflow
- `/hub/audit` - Audit log viewer
- `/hub/settings` - System configuration
- `/hub/users` - User management

### Known Issues

1. **Login redirect** - After login, redirect may not work properly. Check `frontend/src/app/(auth)/login/page.tsx` and the auth context.

2. **Member login button** - Links to incorrect page. Check navigation in public pages.

3. **Servers crash** - May need to restart. Use the startup script.

## Key Files to Know

### Backend
- `backend/bastion/core/models.py` - User, Household, Client, Account, RiskSnapshot
- `backend/bastion/documents/models.py` - Document, DocumentCategory, DocumentAccess
- `backend/bastion/briefings/models.py` - Briefing, BriefingTemplate, Notification
- `backend/bastion/api/urls.py` - All API route registrations
- `backend/bastion/api/views/` - All ViewSets
- `backend/bastion/core/management/commands/seeddata.py` - Test data generator

### Frontend
- `frontend/src/lib/api/client.ts` - Base API client with auth headers
- `frontend/src/lib/api/` - Domain-specific API modules
- `frontend/src/lib/auth-context.tsx` - Auth state management
- `frontend/src/components/hub/` - Hub UI components
- `frontend/src/app/hub/` - Hub page components

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

## Common Commands

```bash
# Start backend
cd backend && source venv/bin/activate && python manage.py runserver

# Start frontend
cd frontend && npm run dev

# Run migrations
cd backend && python manage.py migrate

# Seed test data
cd backend && python manage.py seeddata

# TypeScript check
cd frontend && npx tsc --noEmit
```

## Errors Fixed During Development

1. **ModuleNotFoundError: No module named 'markdown'**
   - Fix: `pip install markdown`

2. **'AuthTokenObtainPairView' missing throttle_scope**
   - Fix: Added `throttle_scope = 'auth'` to view class

3. **authenticate() got unexpected keyword argument 'email'**
   - Fix: Changed to `authenticate(username=email, password=password)`

4. **API URL mismatch (frontend calling /api/v1/ but backend serves /api/)**
   - Fix: Updated `.env.local` to use `NEXT_PUBLIC_API_URL=http://localhost:8000/api`

5. **TypeScript error: 'formatDate' not exported**
   - Fix: Added `formatDate` function to `frontend/src/lib/utils.ts`

6. **TypeScript error: 'smoothTouch' not in LenisOptions**
   - Fix: Removed `smoothTouch` option from Lenis config

7. **TypeScript error: Trend type mismatch**
   - Fix: Added explicit `Trend` type to metrics array in hub-dashboard

## Project Principles

1. **Security as product** - Not overhead, a feature clients feel
2. **Provenance-first** - Every number traceable to source
3. **Workflow truth** - Build from reality, not generic dashboards
4. **Incremental value** - Each phase delivers usable capability

## Next Steps / TODO

- [ ] Fix login redirect flow
- [ ] Fix member login button navigation
- [ ] Add MFA implementation
- [ ] Implement file upload for documents
- [ ] Add real-time notifications
- [ ] Connect to Fidelity data sync
- [ ] Add portfolio performance charts
- [ ] Implement risk console with live data
