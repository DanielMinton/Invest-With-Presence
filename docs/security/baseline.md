# Security Baseline

> "Security is a product feature. For a wealth and equity firm, privacy and integrity are non-negotiable."

---

## Day One Controls

### Authentication
- [ ] Strong password requirements (min 12 chars, complexity)
- [ ] MFA required for all users (TOTP or WebAuthn)
- [ ] Device tracking and session controls
- [ ] Session timeout (configurable, default 30 min idle)
- [ ] Secure session storage (httpOnly, secure, sameSite)

### Authorization
- [ ] Role-based access control (RBAC)
- [ ] Least privilege by default
- [ ] Explicit permission scopes per role
- [ ] Per-client data isolation

### Encryption
- [ ] TLS 1.3 for all traffic (no fallback)
- [ ] Database encryption at rest
- [ ] Object storage encryption (S3 SSE or equivalent)
- [ ] Secrets encrypted and rotated

### Audit
- [ ] Append-only audit event stream
- [ ] All sensitive actions logged
- [ ] Data access events captured
- [ ] Events queryable and exportable

### Environment
- [ ] Strict separation: dev / staging / production
- [ ] No production data in non-prod environments
- [ ] Separate keys per environment
- [ ] Infrastructure as code

### Dependencies
- [ ] Lockfile integrity verified
- [ ] Regular dependency scanning
- [ ] Patch cadence defined (critical: 24h, high: 7d)
- [ ] Dependency review process

---

## Threat Model Focus Areas

### Account Takeover
**Threat:** Attacker gains access to client or admin account

| Control | Status | Notes |
|---------|--------|-------|
| MFA enforcement | [ ] | |
| Abnormal login detection | [ ] | |
| Session hardening | [ ] | |
| Password breach checking | [ ] | |
| Account lockout policy | [ ] | |

### Data Exfiltration
**Threat:** Unauthorized access to or export of client data

| Control | Status | Notes |
|---------|--------|-------|
| Strict permissions | [ ] | |
| Encrypted storage | [ ] | |
| Egress monitoring | [ ] | |
| Download logging | [ ] | |
| Rate limiting on exports | [ ] | |

### Insider Risk
**Threat:** Authorized user misuses access

| Control | Status | Notes |
|---------|--------|-------|
| Audit visibility | [ ] | |
| Approval workflows | [ ] | |
| Separation of duties | [ ] | |
| Access reviews | [ ] | |

### Supply Chain
**Threat:** Compromised dependency or build process

| Control | Status | Notes |
|---------|--------|-------|
| Lockfile integrity | [ ] | |
| Package signing | [ ] | |
| Dependency review | [ ] | |
| Build reproducibility | [ ] | |

---

## Operational Security

### Secrets Management
- [ ] No secrets in code or version control
- [ ] Environment-based secret injection
- [ ] Rotation schedule defined
- [ ] Access to secrets audited

### Backups
- [ ] Automated backup schedule
- [ ] Backups encrypted
- [ ] Restore testing schedule
- [ ] Offsite/cross-region copies

### Incident Response
- [ ] Detection mechanisms defined
- [ ] Containment procedures documented
- [ ] Assessment criteria established
- [ ] Notification workflows (30-day requirement)
- [ ] Post-incident review process

### Change Management
- [ ] Tagged releases
- [ ] Rollback procedures
- [ ] Config changes audited
- [ ] Deployment approvals

---

## Compliance Alignment

### Regulation S-P (Privacy)
- [ ] Written safeguarding policies
- [ ] Incident response procedures
- [ ] Service provider oversight
- [ ] Documentation of compliance activities

### Rule 204-2 (Recordkeeping)
- [ ] True, accurate, current records
- [ ] Multi-year retention capability
- [ ] Quick retrieval mechanisms
- [ ] Integrity and reproducibility

---

## Security Review Schedule

| Review | Frequency | Last Completed | Next Due |
|--------|-----------|----------------|----------|
| Dependency scan | Weekly | | |
| Access review | Monthly | | |
| Penetration test | Annually | | |
| Backup restore test | Quarterly | | |
| Incident drill | Quarterly | | |

---

## Security Contacts

| Role | Name | Contact |
|------|------|---------|
| Security Lead | | |
| Incident Commander | | |
| Compliance Counsel | | |

---

*This document is a baseline. Final security requirements must be confirmed with compliance counsel.*
