# Claude Project Initialization

Use this prompt when starting a new Claude session on the Bastion project:

---

## Quick Start Prompt

Copy and paste this to Claude:

```
I'm working on the Bastion project - a private wealth management platform. Please read the project knowledge file and key source files to get up to speed:

1. Read /Users/TheModernOpossum/Projects/bastion/CLAUDE.md for project overview, current state, and known issues

2. Key backend files:
   - /Users/TheModernOpossum/Projects/bastion/backend/bastion/core/models.py
   - /Users/TheModernOpossum/Projects/bastion/backend/bastion/api/urls.py

3. Key frontend files:
   - /Users/TheModernOpossum/Projects/bastion/frontend/src/lib/api/client.ts
   - /Users/TheModernOpossum/Projects/bastion/frontend/src/lib/auth-context.tsx

After reading these, you'll understand the architecture and current state.
```

---

## Full Context Prompt (for complex work)

```
I'm continuing work on Bastion, a security-first private wealth management platform.

Project structure:
- frontend/ - Next.js 14 + TypeScript + Tailwind
- backend/ - Django 5 + DRF + SimpleJWT

Please read these files to understand the project:

CORE KNOWLEDGE:
- /Users/TheModernOpossum/Projects/bastion/CLAUDE.md

BACKEND:
- /Users/TheModernOpossum/Projects/bastion/backend/bastion/core/models.py
- /Users/TheModernOpossum/Projects/bastion/backend/bastion/documents/models.py
- /Users/TheModernOpossum/Projects/bastion/backend/bastion/briefings/models.py
- /Users/TheModernOpossum/Projects/bastion/backend/bastion/api/urls.py
- /Users/TheModernOpossum/Projects/bastion/backend/bastion/api/views/__init__.py

FRONTEND:
- /Users/TheModernOpossum/Projects/bastion/frontend/src/lib/api/client.ts
- /Users/TheModernOpossum/Projects/bastion/frontend/src/lib/api/index.ts
- /Users/TheModernOpossum/Projects/bastion/frontend/src/lib/auth-context.tsx
- /Users/TheModernOpossum/Projects/bastion/frontend/src/components/hub/hub-sidebar.tsx

KNOWN ISSUES TO FIX:
1. Login redirect not working properly
2. Member login button navigates to wrong page
3. Servers may need restart

Start servers with: ./scripts/start-dev.sh
```

---

## Working Directories

When using Claude Code, set these as working directories:
- /Users/TheModernOpossum/Projects/bastion
- /Users/TheModernOpossum/Projects/bastion/frontend
- /Users/TheModernOpossum/Projects/bastion/backend

---

## Test Credentials

After running `python manage.py seeddata`:
- Email: admin@bastion.local
- Password: admin123

---

## Common Tasks

### Start Development
```bash
./scripts/start-dev.sh
```

### Run Migrations
```bash
cd backend && source venv/bin/activate && python manage.py migrate
```

### Seed Test Data
```bash
cd backend && source venv/bin/activate && python manage.py seeddata
```

### TypeScript Check
```bash
cd frontend && npx tsc --noEmit
```

### Build Frontend
```bash
cd frontend && npm run build
```
