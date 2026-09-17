# HomeClinic — Full Project Document

**Product:** Home-based digital clinic + patient intake system  
**Positioning:** “Your Local Doctor, From Your Home.”  
**Principle:** AI = intake + organization + risk flagging. Doctor = diagnosis + treatment.  
**Legal note:** Software must support licensed care, consent, privacy, telemedicine rules, and emergency disclaimers. Never launch as “AI diagnoses patients.”

---

## 1. Vision

Build a system that handles the full patient journey:

```text
Patient → Complaint → Triage → Clinic → Doctor → Appointment → Consultation → Prescription → Follow-up
```

Not just a website form — a complete clinic workflow that starts with one doctor/home clinic and can later scale to a multi-clinic platform.

---

## 2. Goals

### Business goals

- Validate real demand with a small local clinic operation
- Convert online intake into paid consultations (phone / video / home visit / in-clinic)
- Retain patients via digital records and follow-ups
- Later expand to multiple doctors/clinics

### Product goals

- Simple patient submission without heavy account friction
- Fast clinic review and response
- Safe emergency / red-flag handling
- Clean medical record over time
- Optional AI assist that never replaces the doctor

### Non-goals (especially early)

- AI diagnosis or autonomous prescribing
- Replacing emergency services
- Building a full hospital EMR on day one

---

## 3. Users & Roles

| Role | Capabilities |
|------|----------------|
| **Patient** | Submit complaint, upload reports, book (later), view history/prescriptions |
| **Receptionist / Clinic staff** | Register patients, review requests, call patients, schedule, manage status/payments |
| **Doctor** | View assigned patients, notes, prescriptions, follow-ups |
| **Admin** | Full access: users, services, pricing, doctors, settings |

---

## 4. Consultation Types

| Type | Description | Example price (placeholder) |
|------|-------------|----------------------------|
| Phone | Clinic calls patient | ₹199 |
| Video | Online session | ₹299 |
| Home visit | Provider visits patient address | ₹599 |
| Clinic visit | In-person (when physical clinic exists) | TBD |
| Follow-up | Short revisit | ₹149 |

Prices are configurable per clinic.

---

## 5. End-to-End Patient Journey

```text
Patient opens website/app
        ↓
Enter basic details + problem + optional uploads
        ↓
Submit → Consultation / Request ID created
        ↓
Triage / priority (rules → later AI-assisted)
        ↓
Clinic notified → staff reviews dashboard
        ↓
Call / schedule / assign doctor
        ↓
Consultation → notes / prescription / advice
        ↓
Payment (Phase 2+)
        ↓
Follow-up reminder
```

---

## 6. Phase Plan Overview

| Phase | Name | Outcome |
|-------|------|---------|
| **Phase 0** | Foundations | Legal/ops checklist + product decisions |
| **Phase 1** | MVP | Intake + admin dashboard + manual call workflow |
| **Phase 2** | Clinic operations | Accounts, booking, payments, records, doctor view |
| **Phase 3** | AI assist | Structured intake, summaries, smarter red flags |
| **Phase 4** | Scale | Multi-doctor / multi-clinic platform + WhatsApp-first |

---

# Phase 0 — Foundations (before / parallel to coding)

**Duration:** ~1–2 weeks (ongoing thereafter)  
**Goal:** Be safe and operationally ready to see real patients.  
**Docs:** See [`docs/phase-0/`](./docs/phase-0/README.md)

### Deliverables

- [x] Confirm who is legally providing care (doctor / registered professional) → [`01-care-provider.md`](./docs/phase-0/01-care-provider.md) *(fill clinic blanks + sign-off)*
- [x] Telemedicine / home-visit compliance checklist (local jurisdiction) → [`02-compliance-checklist.md`](./docs/phase-0/02-compliance-checklist.md)
- [x] Consent text for data processing + consultation → [`03-consent.md`](./docs/phase-0/03-consent.md)
- [x] Privacy / medical-record handling policy → [`04-privacy-policy.md`](./docs/phase-0/04-privacy-policy.md)
- [x] Emergency disclaimer copy (always visible on intake + confirmation) → [`05-emergency-disclaimer.md`](./docs/phase-0/05-emergency-disclaimer.md)
- [x] Clinic phone, hours, service area, pricing draft → [`06-clinic-operations.md`](./docs/phase-0/06-clinic-operations.md) *(fill placeholders)*
- [x] Decide MVP service: **phone consultation only** → [`07-mvp-decisions.md`](./docs/phase-0/07-mvp-decisions.md)

### Exit criteria

Clinic can legally and operationally accept a patient request and respond by phone.  
**Remaining human steps:** fill doctor/clinic blanks, walk compliance checklist with RMP, legal review recommended, then start Phase 1.

---

# Phase 1 — MVP (Build this first)

**Duration:** ~2–4 weeks  
**Goal:** Prove people submit real problems and the clinic can act on them.  
**Status:** ✅ Implemented — see [`README.md`](./README.md) and code in `backend/` + `frontend/`.

## 1.1 Scope

### In scope

- [x] Patient landing page
- [x] Patient intake form (no heavy account required)
- [x] Consultation / request ID on success
- [x] File upload (prescriptions / reports / photos)
- [x] Database persistence (SQLite default; PostgreSQL optional via `DATABASE_URL`)
- [x] Admin authentication
- [x] Admin dashboard: list + detail
- [x] Status workflow: `New → Contact pending → Scheduled → Completed / Closed`
- [x] Priority: `Normal / Urgent`
- [x] **Rule-based** emergency red-flag detection (keywords)
- [x] Clinic notification on submit (SMTP email if configured; otherwise API log)
- [x] Manual phone call by clinic staff (out of band / `tel:` links)

### Out of scope

- Patient login / accounts
- Online payments
- Video meeting generation
- Doctor multi-user dashboard
- WhatsApp bot
- AI LLM features
- Memberships / family plans
- Multi-clinic

## 1.2 Patient screens

1. **Home** — `/`
2. **Intake form** — `/consult`
3. **Emergency interstitial** — modal on red flags
4. **Success** — `/success?id=CLN-…`

## 1.3 Admin screens

1. Login — `/admin/login`
2. Request list — `/admin`
3. Request detail — `/admin/requests/[id]`

## 1.4 Data model (MVP)

Implemented tables: `users`, `patients`, `consultation_requests`, `attachments`, `request_notes`, `audit_logs`.

## 1.5 APIs (MVP)

- `GET /api/clinic`
- `POST /api/triage/check`
- `POST /api/intake`
- `GET /api/admin/requests`
- `GET /api/admin/requests/{id}`
- `PATCH /api/admin/requests/{id}`
- `POST /api/admin/auth/login`
- `GET /api/admin/auth/me`

## 1.6 Tech stack (recommended)

| Layer | Choice |
|-------|--------|
| Frontend | Next.js (React) |
| Backend | FastAPI |
| DB | SQLite (local default) / PostgreSQL (optional) |
| Auth | JWT for admin |
| Files | Local `backend/uploads` |
| Deploy | Docker Compose optional for Postgres/API |

## 1.7 Success metrics

- Intake submissions per week
- % contacted within X hours
- % converted to actual consultation
- Number of urgent/red-flag cases handled correctly

## 1.8 Exit criteria

A real patient can submit; clinic sees it in dashboard; urgent cases are flagged; clinic calls and updates status.  
**Ready for soft launch** after filling clinic phone/hours in `.env` and Phase 0 doctor sign-off.

---

# Phase 2 — Clinic Operations

**Duration:** ~4–8 weeks after MVP validation  
**Goal:** Turn one-off intake into repeatable clinic operations and revenue.

## 2.1 Scope

### Patient

- Optional account creation after first consultation (OTP-based login recommended for India)
- Patient dashboard: upcoming appointment, history, uploads, contact clinic
- Book consultation type: Phone / Video / Home visit / Clinic
- Address capture for home visit
- View prescriptions & reports
- Follow-up booking

### Clinic / Doctor

- Receptionist vs Doctor vs Admin roles
- Appointment calendar
- Assign doctor
- Clinical notes (structured)
- Prescription entry / PDF upload
- Consultation summary generation (template-based, not AI yet)
- Payment status on request
- Basic invoicing / payment confirmation

### Platform

- Razorpay (or India-capable gateway)
- SMS/email notifications (appointment confirmed, reminder)
- Stronger file storage (S3 / Azure Blob)
- Better audit trail for medical records

## 2.2 New / expanded entities

- `appointments`
- `doctors` / `doctor_availability`
- `prescriptions`
- `payments`
- `patient_accounts` / OTP sessions
- `notifications`

## 2.3 Status model (example)

```text
New → Triaged → Contacted → Appointment booked → In consultation → Completed → Follow-up scheduled
                                      ↘ Cancelled / No-show
Urgent / Escalated parallel flag
```

## 2.4 Exit criteria

Patients can return, book, pay, and see history; doctors can work assigned cases; clinic can run day-to-day without spreadsheets.

---

# Phase 3 — AI Assist (not AI doctor)

**Duration:** ~4–6 weeks  
**Goal:** Speed up intake and triage without diagnosing or prescribing.

## 3.1 Allowed AI features

1. **Structured intake extraction**  
   Free text → JSON (complaint, duration, associated symptoms, triggers)
2. **Clinical summary for doctor**  
   Short non-diagnostic summary of what patient reported
3. **Improved red-flag detection**  
   LLM + rules; always show emergency CTA; never recommend treatment
4. **Document organization**  
   Classify uploads (lab / Rx / imaging); extract labels/dates only where safe
5. **Draft follow-up message**  
   Staff-approved before send

## 3.2 Hard constraints

- No autonomous diagnosis
- No autonomous medication recommendations
- Doctor must review AI output
- Emergency path never becomes “book tomorrow”
- Log AI outputs for audit

## 3.3 AI flow

```text
Patient free text + form fields
        ↓
LLM structured extraction
        ↓
Rule + model red-flag check
        ↓
If emergency → warn patient + notify clinic (Urgent)
        ↓
Else → structured request in dashboard + optional AI summary
        ↓
Human clinic / doctor decides next step
```

## 3.4 Exit criteria

Staff spend less time reading messy forms; urgent cases are caught more reliably; doctors still own all clinical decisions.

---

# Phase 4 — Scale & Platform

**Duration:** ongoing  
**Goal:** From one home clinic → multi-provider / multi-clinic product.

## 4.1 Scope

- Multi-clinic tenancy
- Multi-doctor scheduling & assignment
- WhatsApp intake bot → dashboard
- App notifications
- Membership / family plans
- Analytics: conversion, wait time, revenue, no-shows
- Video provider integration (Meet / Zoom / custom)
- Public API / partner clinics (optional)

## 4.2 Architecture evolution

```text
                 Platform
                    │
         ┌──────────┼──────────┐
         ▼          ▼          ▼
      Clinic A   Clinic B   Clinic C
         │          │          │
      Doctors    Doctors    Doctors
         │          │          │
      Patients   Patients   Patients
```

## 4.3 Exit criteria

Multiple clinics operate independently on one platform with shared product features and isolated data.

---

## 7. Feature Matrix by Phase

| Feature | P1 | P2 | P3 | P4 |
|---------|----|----|----|-----|
| Patient intake form | ✅ | ✅ | ✅ | ✅ |
| Consultation ID + confirmation | ✅ | ✅ | ✅ | ✅ |
| Admin dashboard | ✅ | ✅ | ✅ | ✅ |
| Rule-based red flags | ✅ | ✅ | ✅ | ✅ |
| File uploads | ✅ | ✅ | ✅ | ✅ |
| Patient accounts | ❌ | ✅ | ✅ | ✅ |
| Appointments & calendar | ❌ | ✅ | ✅ | ✅ |
| Payments | ❌ | ✅ | ✅ | ✅ |
| Doctor dashboard / roles | ❌ | ✅ | ✅ | ✅ |
| Prescriptions & records UI | ❌ | ✅ | ✅ | ✅ |
| Follow-up reminders | ❌ | ✅ | ✅ | ✅ |
| AI structured intake | ❌ | ❌ | ✅ | ✅ |
| AI summary / doc assist | ❌ | ❌ | ✅ | ✅ |
| WhatsApp bot | ❌ | ⚪ optional | ⚪ | ✅ |
| Multi-clinic | ❌ | ❌ | ❌ | ✅ |
| Memberships | ❌ | ❌ | ⚪ | ✅ |

⚪ = optional / nice-to-have in that phase

---

## 8. Technical Architecture (target)

```text
                Patient / Staff
                      │
                      ▼
               Web (Next.js)
                      │
                      ▼
                   FastAPI
                      │
           ┌──────────┼──────────┐
           ▼          ▼          ▼
      PostgreSQL   AI Layer   Object Storage
           │          │          │
           └──────────┼──────────┘
                      ▼
              Notifications / Payments
```

### Suggested modules

- `intake` — public submission
- `triage` — rules (+ AI in Phase 3)
- `clinic` — admin workflows
- `appointments`
- `records`
- `billing`
- `notifications`
- `auth` — OTP patient + staff password/session

---

## 9. Emergency / Safety Requirements (all phases)

Detect examples such as:

- severe chest pain
- difficulty breathing
- unconscious / unresponsive
- heavy bleeding
- stroke-like symptoms
- severe allergic reaction

**System behavior:**

1. Show urgent warning immediately
2. Direct to emergency services
3. Notify clinic as Urgent / Escalated
4. Do **not** present “book later” as the primary CTA

---

## 10. Business Models (enable gradually)

1. **Per consultation fee** — primary early model
2. **Home visit premium** — higher margin service
3. **Membership** — annual discounted care + priority
4. **Family plan** — multiple members under one account

Software is the enabler; revenue comes from healthcare services.

---

## 11. Recommended Build Order (next concrete steps)

### Immediate (Phase 1 kickoff)

1. Write screen-by-screen UI wireframes (patient + admin)
2. Finalize DB schema for MVP tables
3. Define API contracts
4. Implement patient form + success page
5. Implement admin list/detail + auth
6. Add keyword red-flag engine
7. Deploy privately and test with friends/family
8. Soft launch with one clinic phone number

### Do not build until Phase 1 works

- Payments, WhatsApp, AI, multi-doctor, memberships

---

## 12. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Legal / telemedicine issues | Phase 0 checklist; doctor-led care only |
| Patients treat site as ER | Strong emergency UX + disclaimers |
| Overbuilding | Strict Phase 1 cut line |
| Messy free-text intake | Structure form fields early; AI later |
| No demand | Measure submissions & conversion before Phase 2 |
| Data privacy | Encrypt in transit; restrict admin access; minimize data |

---

## 13. Definition of Success

### Phase 1 success

Clinic regularly receives usable intake requests and converts some to paid/phone consultations.

### Phase 2 success

Repeat patients use accounts; payments and appointments run without manual chaos.

### Phase 3 success

Staff/doctors save time; red flags improve; no AI clinical overreach incidents.

### Phase 4 success

Second clinic/doctor can onboard without rebuilding the product.

---

## 14. One-line product summary

**Digital patient intake + triage + doctor-led consultation + home healthcare — starting as one clinic’s operating system, growing into a local healthcare platform.**
