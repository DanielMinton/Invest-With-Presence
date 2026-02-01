# Compliance and Recordkeeping Overview

> "Compliance is not a UI. It is evidence."

**Disclaimer:** This document is a design guide, not legal advice. Final requirements must be confirmed with compliance counsel.

---

## Regulatory Context

### Regulation S-P (Privacy and Safeguarding)

**What it requires:**
- Written policies and procedures for safeguarding customer information
- Incident response: detection, containment, assessment, notification
- Service provider oversight with expectations, reporting, and contractual controls
- Documentation of compliance activities and decisions

**Platform support:**
| Requirement | How the platform helps |
|-------------|----------------------|
| Safeguarding policies | Document storage with access controls |
| Incident response | Audit events enable detection and investigation |
| Service provider oversight | Vendor integration tracking and documentation |
| Compliance documentation | Immutable audit trail, exportable records |

### Rule 204-2 (Investment Adviser Recordkeeping)

**What it requires:**
- Maintain true, accurate, and current records relating to advisory business
- Retention periods: plan for multi-year retention with quick retrieval
- Electronic storage: ensure integrity, accessibility, and reproducibility

**Platform support:**
| Requirement | How the platform helps |
|-------------|----------------------|
| True, accurate records | Provenance tracking, version history |
| Retention | Configurable retention policies, archival |
| Quick retrieval | Queryable audit events, document search |
| Integrity | Append-only events, version immutability |
| Reproducibility | Snapshots, data source linking |

---

## Records the Platform Maintains

### Audit Events (Append-Only)

| Event Type | What's captured | Retention |
|------------|-----------------|-----------|
| Authentication | Login, logout, MFA challenges, failures | 7 years |
| Document access | View, download, share, delete | 7 years |
| Client communication | Briefing delivery, meeting pack access | 7 years |
| Data changes | Create, update, delete with before/after | 7 years |
| Administrative | Permission changes, user management | 7 years |

### Documents

| Category | Examples | Retention Policy |
|----------|----------|------------------|
| Client agreements | IPS, advisory agreements | Permanent |
| Regulatory filings | Form ADV, disclosures | Per regulation |
| Client communications | Briefings, reports, meeting notes | 7 years |
| Tax documents | 1099s, K-1s, statements | 7 years |
| Operational | Trade confirmations, reconciliation | 7 years |

### Data Provenance

For every report, briefing, or derived view:
- Source data identifiers
- Source timestamps
- Transformation/calculation methods
- Manual overrides with explanations

---

## Exam Readiness

### Common Exam Requests

| Request | How to fulfill |
|---------|---------------|
| "Show all communications with Client X" | Filter audit events + document access by client |
| "Provide trade history for Account Y" | Integration sync logs + reconciliation records |
| "Demonstrate safeguarding procedures" | Export security baseline + audit trail |
| "Show access control evidence" | Permission configuration + access events |
| "Provide all briefings from Q3" | Document query by type + date range |

### Export Capabilities

The platform should support:
- [ ] Full audit event export (CSV, JSON)
- [ ] Document manifest with metadata
- [ ] Client communication timeline
- [ ] Access control configuration snapshot
- [ ] Data provenance chain for any output

---

## Incident Response Framework

### Detection
- Anomalous login patterns
- Unusual data access patterns
- Failed authentication spikes
- Integration errors or sync failures

### Containment
- Session invalidation capability
- Account lockout
- Access revocation
- Integration pause

### Assessment
- Audit event analysis
- Data access scope determination
- Client impact assessment

### Notification
- 30-day notification requirement (Reg S-P amendments)
- Client notification workflow
- Regulatory notification if required
- Documentation of decisions and actions

---

## Service Provider Oversight

### For Each Integration/Vendor

Document:
- [ ] Security posture (SOC 2, equivalent)
- [ ] Data handling practices
- [ ] Breach notification terms
- [ ] Data ownership and retention
- [ ] Exit/termination procedures

Track:
- [ ] Contract terms and renewal dates
- [ ] Security review dates
- [ ] Incident history
- [ ] Performance against SLAs

---

## Annual Review Checklist

- [ ] Review and update safeguarding policies
- [ ] Test incident response procedures
- [ ] Verify backup and restore capability
- [ ] Review access permissions (least privilege)
- [ ] Update vendor oversight documentation
- [ ] Confirm retention policies are enforced
- [ ] Test export and retrieval capabilities
- [ ] Document review completion

---

## Contacts

| Role | Name | Contact |
|------|------|---------|
| Compliance Counsel | | |
| CCO (if applicable) | | |
| Privacy Officer | | |

---

*This document should be reviewed annually and updated as regulations change.*
