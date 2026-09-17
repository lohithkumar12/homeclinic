# 06 — Clinic Operations Draft

Fill every `_placeholder_` before soft launch. Example numbers are placeholders only.

## Clinic identity

| Field | Value |
|-------|--------|
| Public clinic name | _[Clinic Name]_ |
| Tagline | Healthcare from the comfort of your home |
| Base location | _[City, State]_ |
| Clinic phone (patient-facing) | _[10-digit mobile / landline]_ |
| WhatsApp (optional Phase 1) | _[same or separate]_ |
| Email | _[clinic@example.com]_ |
| Primary doctor | _[Name, qualification, registration No.]_ |

## Hours of availability

| Day | Hours |
|-----|--------|
| Monday–Saturday | _[e.g. 9:00 AM – 8:00 PM]_ |
| Sunday | _[e.g. 10:00 AM – 2:00 PM / Closed]_ |
| After-hours policy | Requests accepted online 24/7; callbacks only during hours unless urgent |

**Success-page copy:**

```text
📞 Clinic: [phone]
🕐 Available: [hours]
```

## Service area (MVP)

| Field | Value |
|-------|--------|
| Geography for phone consult | _[e.g. Anywhere in India / [City] only]_ |
| Geography for home visit | **Not offered in MVP** (see decisions) |
| Languages supported | _[e.g. English, Hindi, Telugu]_ |

## Services & pricing (draft)

| Service | Offer in MVP? | Example price | Notes |
|---------|---------------|---------------|-------|
| Phone consultation | **Yes** | ₹199 | Primary MVP service |
| Follow-up (phone) | Optional | ₹149 | Manual for now |
| Video consultation | No (Phase 2) | ₹299 | — |
| Home visit | No (Phase 2+) | ₹599 | Needs separate ops plan |
| Clinic visit | No | TBD | When physical clinic exists |
| Basic health check | No | ₹799 | Later |

**MVP payment method:** Offline after call (UPI / cash). Online Razorpay in Phase 2.

## Daily operating workflow (MVP)

```text
Patient submits intake
        ↓
Admin dashboard shows New (Urgent sorted first)
        ↓
Staff/doctor calls patient
        ↓
Update status: Contact pending → Scheduled / Completed / Closed
        ↓
Collect fee offline if consultation provided
        ↓
Add short note (advice given / follow-up needed)
```

## Response targets (internal SLA)

| Priority | Target first contact |
|----------|----------------------|
| Urgent / red-flag | ASAP / within 30–60 minutes during hours |
| Normal | Same day during hours; next working morning if after hours |

## Required public texts on site

- Emergency disclaimer (`05-emergency-disclaimer.md`)  
- Consent checkbox (`03-consent.md`)  
- Privacy link (`04-privacy-policy.md`)  
- Clinic phone + hours on success page  

## Soft-launch checklist

- [ ] Phone number active and answered during published hours  
- [ ] Doctor available for clinical calls  
- [ ] Pricing agreed  
- [ ] Consent + privacy + emergency copy reviewed  
- [ ] Test intake submitted end-to-end by clinic team  
- [ ] Urgent keyword test performed  
