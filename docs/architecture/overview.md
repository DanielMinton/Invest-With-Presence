# Technical Architecture Overview

## System Design Principles

1. **Clear boundaries** - Presentation, business logic, and background work are separate
2. **Audit-first** - Permissions and events centered in API, not scattered
3. **Provenance** - Every derived view links to source data and timestamps
4. **Integration-aware** - Third-party data treated as imperfect inputs requiring reconciliation

---

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENTS                                   │
│                                                                     │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐            │
│   │   Browser   │    │   Mobile    │    │   Admin     │            │
│   │  (Public)   │    │  (Future)   │    │  (Hub)      │            │
│   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘            │
└──────────┼──────────────────┼──────────────────┼────────────────────┘
           │                  │                  │
           ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                    │
│                    Next.js + TypeScript                             │
│                                                                     │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐            │
│   │   Public    │    │   Members   │    │    Hub      │            │
│   │    Site     │    │    Vault    │    │  (Internal) │            │
│   └─────────────┘    └─────────────┘    └─────────────┘            │
│                                                                     │
│   Tailwind CSS • Framer Motion • Three.js (visualizations)         │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS / REST
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          API LAYER                                  │
│                     Django + DRF                                    │
│                                                                     │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐            │
│   │    Auth     │    │   Domain    │    │   Audit     │            │
│   │  Boundary   │    │   Logic     │    │   Events    │            │
│   └─────────────┘    └─────────────┘    └─────────────┘            │
│                                                                     │
│   Permissions • Serialization • Validation • Rate Limiting         │
└─────────────────────────────────────────────────────────────────────┘
           │                  │                  │
           ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                   │
│                                                                     │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐            │
│   │  Database   │    │   Object    │    │   Cache     │            │
│   │  (Postgres) │    │   Storage   │    │  (Redis)    │            │
│   └─────────────┘    └─────────────┘    └─────────────┘            │
│                                                                     │
│   SQLite (dev) → PostgreSQL (prod)                                 │
│   S3-compatible encrypted storage                                   │
└─────────────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         WORKER                                      │
│                   Python (Celery / Django-Q)                        │
│                                                                     │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐            │
│   │  Ingestion  │    │   Report    │    │  Scheduled  │            │
│   │   Jobs      │    │  Rendering  │    │    Jobs     │            │
│   └─────────────┘    └─────────────┘    └─────────────┘            │
│                                                                     │
│   Reconciliation • Notifications • Cleanup                         │
└─────────────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      INTEGRATIONS                                   │
│                                                                     │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐            │
│   │  Custodian  │    │    CRM      │    │  Reporting  │            │
│   │  (Fidelity) │    │   (TBD)     │    │  Provider   │            │
│   └─────────────┘    └─────────────┘    └─────────────┘            │
│                                                                     │
│   Read-first • Normalize • Reconcile • Scoped tokens              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Core Data Model

### Entities

| Entity | Description | Key relationships |
|--------|-------------|-------------------|
| **User** | Authentication identity | Has roles, belongs to organization |
| **Client** | Investor/member | Has accounts, households |
| **Household** | Client grouping | Contains clients, accounts |
| **Account** | Custody account | Belongs to client/household |
| **Document** | File with metadata | Has versions, permissions, classifications |
| **Briefing** | Generated report | Links to data snapshot, has versions |
| **RiskSnapshot** | Point-in-time state | Timestamped, immutable |
| **DecisionNote** | Human narrative | Links to evidence |
| **AuditEvent** | System event | Append-only, queryable |
| **IntegrationSource** | External provider | Tracks sync state |
| **AccessPolicy** | Permission rules | Defines roles/scopes |

### Provenance Rules

1. Every derived view stores source identifiers and timestamps
2. Every manual override requires explanation + audit event
3. Data reconciliation is explicit: conflicts visible and resolvable

---

## API Design

### Authentication Flow
```
POST /api/auth/login          → Session token
POST /api/auth/mfa/verify     → MFA challenge
POST /api/auth/logout         → Session invalidation
GET  /api/auth/session        → Current session info
```

### Member Endpoints
```
GET  /api/members/dashboard   → Dashboard state
GET  /api/members/briefings   → List briefings
GET  /api/members/briefings/:id → Single briefing
GET  /api/members/documents   → Document list
GET  /api/members/documents/:id → Document download
GET  /api/members/meetings    → Meeting packs
```

### Hub Endpoints (Internal)
```
GET  /api/hub/clients         → Client overview
GET  /api/hub/risk            → Risk console data
POST /api/hub/tasks           → Create task
GET  /api/hub/audit           → Audit event query
POST /api/hub/approvals       → Submit approval
```

---

## Security Layers

```
Request → Rate Limit → Auth → Permissions → Validation → Handler → Audit
```

1. **Rate limiting** - Per-IP and per-user limits
2. **Authentication** - Session validation, MFA check
3. **Permissions** - Role + scope verification
4. **Validation** - Input sanitization and schema validation
5. **Handler** - Business logic execution
6. **Audit** - Event logging for sensitive actions

---

## Deployment Architecture

### Environments

| Environment | Purpose | Data | Access |
|-------------|---------|------|--------|
| Development | Local dev | Synthetic | Developer |
| Staging | Integration testing | Synthetic | Team |
| Production | Live system | Real | Restricted |

### Infrastructure (Target)

```
┌─────────────────────────────────────────────────────┐
│                    CDN / WAF                        │
└─────────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────────┐
│              Load Balancer (HTTPS)                  │
└─────────────────────────────────────────────────────┘
         │                              │
┌────────┴────────┐          ┌─────────┴─────────┐
│    Frontend     │          │       API         │
│   (Vercel /     │          │   (Container)     │
│    Static)      │          │                   │
└─────────────────┘          └─────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
             ┌──────┴──────┐   ┌──────┴──────┐   ┌──────┴──────┐
             │  Database   │   │   Object    │   │   Worker    │
             │  (Managed)  │   │   Storage   │   │ (Container) │
             └─────────────┘   └─────────────┘   └─────────────┘
```

---

## Decision Log

| Date | Decision | Rationale | Alternatives Considered |
|------|----------|-----------|------------------------|
| | Next.js for frontend | SSR, TypeScript, ecosystem | SvelteKit, Remix |
| | Django for API | Python ecosystem, DRF maturity | FastAPI, Node |
| | SQLite → Postgres | Simple start, clear migration | Postgres from day 1 |
| | | | |
