# Phase 0 — Foundations

**Status:** Draft complete — fill clinic-specific blanks and get legal/medical review before soft launch.  
**Exit criteria:** Clinic can legally and operationally accept a patient request and respond by phone.

> These documents are **operational templates**, not legal advice. Have a qualified doctor and lawyer review before treating real patients.

## Deliverables

| # | Deliverable | File | Status |
|---|-------------|------|--------|
| 1 | Who provides care | [01-care-provider.md](./01-care-provider.md) | Template — fill blanks |
| 2 | Telemedicine / home-visit compliance | [02-compliance-checklist.md](./02-compliance-checklist.md) | Checklist ready |
| 3 | Consent (data + consultation) | [03-consent.md](./03-consent.md) | Draft copy ready |
| 4 | Privacy / medical-record policy | [04-privacy-policy.md](./04-privacy-policy.md) | Draft copy ready |
| 5 | Emergency disclaimer | [05-emergency-disclaimer.md](./05-emergency-disclaimer.md) | Draft copy ready |
| 6 | Clinic ops + pricing | [06-clinic-operations.md](./06-clinic-operations.md) | Draft — fill blanks |
| 7 | MVP service decision | [07-mvp-decisions.md](./07-mvp-decisions.md) | **Decided** |

## Recommended order to complete blanks

1. Fill doctor/clinic identity in `01` and `06`
2. Walk through `02` with the doctor
3. Paste `03`, `04`, `05` into the product (Phase 1 UI)
4. Confirm `07` before coding Phase 1

## Phase 0 → Phase 1 handoff

When blanks are filled and checklists signed off:

- Build patient intake + admin dashboard only
- Show emergency disclaimer on intake + success screens
- Require consent checkbox before submit
- MVP service = **phone consultation only**
- No AI diagnosis, no autonomous prescribing
