# the client Platform - Project Brief

## One-Page Summary

**Client:** the client (Private Wealth and Equity)
**Implementer:** Daniel Minton
**Date:** February 2026
**Status:** Discovery Phase

---

## What We're Building

A security-first digital experience layer for a private wealth advisor transitioning to independence. Three surfaces:

1. **Public Site** - Brand, philosophy, credibility, secure contact
2. **Members Vault** - Client documents, briefings, reports, meeting packs
3. **the client Hub** - Internal operations, risk workflow, client management

---

## Why It Matters

the client has demonstrated exceptional returns for clients. The platform amplifies this by:

- Reducing operational drag and email chaos
- Creating consistent, audit-ready client communications
- Building trust through transparency and provenance
- Protecting the firm with institutional-grade security

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js + TypeScript + Tailwind |
| API | Django + Django REST Framework |
| Worker | Python (Celery/Django-Q) |
| Database | SQLite (dev) → PostgreSQL (prod) |
| Storage | S3-compatible (encrypted) |

---

## Delivery Phases

| Phase | Focus | Key Deliverables |
|-------|-------|------------------|
| **0** | Workflow Truth | Operating model, friction map, artifact templates |
| **1** | Vault MVP | Auth + MFA, vault, briefings, audit trail |
| **2** | Advisor Console | Dashboard, tasks, approvals |
| **3** | Integrations | Fidelity data sync, CRM |
| **4** | Hardening | Security depth, compliance exports |

---

## Current Priority

**Phase 0: Capture Workflow Truth**

- [ ] Complete workflow discovery worksheet
- [ ] Inventory current screens and friction points
- [ ] Align on artifact formats and language
- [ ] Document data sources and trust levels
- [ ] Sign off on MVP scope

---

## Key Principles

1. **Security as product** - Not overhead, a feature clients feel
2. **Provenance-first** - Every number traceable to source
3. **Workflow truth** - Build from reality, not generic dashboards
4. **Incremental value** - Each phase delivers usable capability

---

## Success Metrics (MVP)

- Client adoption within 30 days
- Reduction in email attachments
- Faster meeting prep
- Clean audit logs, zero critical vulnerabilities

---

## Contacts

| Role | Name | Contact |
|------|------|---------|
| Principal | the client | |
| Implementer | Daniel Minton | |
| Compliance Counsel | TBD | |

---

## Next Steps

1. Schedule workflow discovery session with the client
2. Complete discovery worksheet
3. Review and sign off on Phase 0 deliverables
4. Begin MVP build

---

*This document is confidential and should be shared only with trusted decision makers.*
