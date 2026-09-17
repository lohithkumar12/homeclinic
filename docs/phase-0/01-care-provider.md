# 01 — Care Provider & Care Model

**Purpose:** Confirm who is legally providing medical care. The software is intake/operations only.

## Product positioning (locked)

> **Digital patient intake + doctor-led consultation + home healthcare**  
> Not: AI diagnoses patients.

| Layer | Responsibility |
|-------|----------------|
| Software (HomeClinic) | Intake forms, triage flags, clinic dashboard, records storage |
| Clinic / doctor | Diagnosis, treatment advice, prescriptions, clinical decisions |
| Patient | Accurate information; seek emergency care when advised |
| Emergency services | True emergencies (108 / local ER) |

## Fill in before launch

| Field | Value |
|-------|--------|
| Clinic / practice name | _[e.g. HomeClinic / Your Clinic Name]_ |
| Operating address / base | _[city, state]_ |
| Primary doctor / RMP name | _[Full name]_ |
| Qualification | _[e.g. MBBS, MD]_ |
| Registration number | _[State Medical Council / NMC]_ |
| Registration state | _[ ]_ |
| Contact for clinical matters | _[phone / email]_ |
| Business registration (if any) | _[GST / proprietorship / LLP — if applicable]_ |

## Care model for MVP

1. Patient submits intake online (no diagnosis by software).
2. Clinic staff / lead doctor reviews request in dashboard.
3. **Lead RMP (e.g. clinic uncle / primary MBBS doctor)** contacts patient by phone, or refers to a panel doctor friend who is available.
4. Clinical advice / prescription (if any) is issued only by a Registered Medical Practitioner under applicable telemedicine rules.
5. Software may flag possible emergencies; it does **not** clear or treat emergencies.

### Panel doctors (optional network)

If the lead doctor has a network of doctor colleagues:

- Keep **one patient-facing clinic** and one admin dashboard in Phase 1
- Assign cases manually (call / WhatsApp the available doctor)
- Do **not** build multi-doctor logins until Phase 2
- Each consulting doctor remains responsible for their own clinical advice

## Who may use the admin dashboard

| Role (MVP) | Allowed actions | Clinical decisions? |
|------------|-----------------|---------------------|
| Admin / clinic operator | View requests, update status, notes, schedule | No (unless they are also the RMP) |
| Doctor (RMP) | Same + clinical notes / advice | Yes |
| Receptionist (Phase 2) | Register, schedule, call | No |

## Sign-off

| Role | Name | Date | Signature / initials |
|------|------|------|----------------------|
| Doctor / RMP | | | |
| Clinic operator | | | |

**Rule:** Do not soft-launch until the doctor row is filled and the RMP accepts responsibility for clinical care delivered through this channel.
