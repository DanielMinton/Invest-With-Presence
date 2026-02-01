# Decision Log

All significant decisions are recorded here with context, rationale, and alternatives considered.

---

## Template

```
### [Decision Title]
**Date:** YYYY-MM-DD
**Decision Maker:** [Name]
**Status:** [ ] Proposed [ ] Approved [ ] Superseded

**Context:**
[Background and why this decision was needed]

**Decision:**
[What was decided]

**Rationale:**
[Why this option was chosen]

**Alternatives Considered:**
1. [Alternative 1] - [Why rejected]
2. [Alternative 2] - [Why rejected]

**Risks and Mitigations:**
- [Risk]: [Mitigation]

**Next Actions:**
- [ ] [Action item]
```

---

## Decisions

### D001: Project Structure and Tech Stack
**Date:** 2026-02-01
**Decision Maker:** Daniel Minton
**Status:** [x] Approved

**Context:**
Need to establish the foundational technology choices for the the client platform.

**Decision:**
- Frontend: Next.js + TypeScript + Tailwind
- Backend: Django + Django REST Framework
- Database: SQLite (dev) → PostgreSQL (prod)
- Worker: Python (Celery or Django-Q)

**Rationale:**
- Next.js provides SSR, TypeScript support, and strong ecosystem
- Django offers mature auth, ORM, and DRF for API development
- Python across backend and worker simplifies ops
- SQLite allows simple local dev with clear migration path

**Alternatives Considered:**
1. FastAPI - Excellent, but DRF admin and ecosystem more mature for this use case
2. Node/Express - Would split team across two languages
3. SvelteKit - Less mature ecosystem for enterprise use

**Risks and Mitigations:**
- Django monolith scaling: Mitigated by clear API boundaries, can extract services later

**Next Actions:**
- [x] Create project scaffold
- [ ] Set up development environment
- [ ] Initialize frontend and backend projects

---

### D002: [Next Decision Title]
**Date:**
**Decision Maker:**
**Status:** [ ] Proposed

**Context:**

**Decision:**

**Rationale:**

**Alternatives Considered:**

**Risks and Mitigations:**

**Next Actions:**

---

## Pending Decisions

| ID | Topic | Owner | Due | Notes |
|----|-------|-------|-----|-------|
| | Custodian integration approach | | | Fidelity API evaluation |
| | CRM selection | | | Needs workflow truth input |
| | Hosting provider | | | Vercel vs. AWS vs. other |
| | Auth provider | | | Auth0 vs. Clerk vs. custom |
| | | | | |

---

## Decision Categories

- **Architecture** - Tech stack, patterns, infrastructure
- **Security** - Auth, encryption, access control
- **Compliance** - Regulatory, recordkeeping, retention
- **Product** - Features, UX, prioritization
- **Operations** - Deployment, monitoring, maintenance
- **Commercial** - Pricing, licensing, contracts
