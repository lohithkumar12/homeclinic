# 07 — MVP Product Decisions (Phase 0 lock)

These decisions constrain Phase 1 engineering. Change only deliberately.

## Locked decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| First service | **Phone consultation only** | Lowest ops complexity; fits telemedicine audio mode |
| Patient accounts | **Not in MVP** | Reduce friction; collect phone + name only |
| Payments in product | **No (offline UPI/cash)** | Validate demand before Razorpay |
| Video meetings | **No** | Phase 2 |
| Home visits | **No** | Phase 2+ with separate compliance |
| WhatsApp bot | **No** (optional manual WhatsApp chat OK) | Phase 2/4 |
| AI / LLM | **No** | Phase 3; MVP uses keyword red flags only |
| Multi-doctor | **No** | Single clinic / single RMP workflow |
| Diagnosis by software | **Never** | Safety + legal |

## Emergency UX decision

When red flags fire:

1. Show strong emergency interstitial first.  
2. Primary action = seek emergency care.  
3. Allow secondary action: still submit as **Urgent** for clinic follow-up.  
4. Do not encourage delaying ER care.

## Intake fields for Phase 1

Required:

- Name, age, gender, phone  
- Main problem, duration  
- Consent checkbox  

Recommended:

- Location, symptoms, medications, allergies, previous conditions  
- Preferred consultation time  
- Optional file uploads  

## Status workflow (MVP)

```text
New → Contact pending → Scheduled → Completed
                      ↘ Closed (duplicate / spam / no response)
```

Priority: `Normal` | `Urgent`

## Notification (MVP minimum)

At least one of:

- Email to clinic inbox on new request, **or**
- SMS to clinic phone, **or**
- Manual refresh of admin dashboard during hours  

Automate the simplest channel first.

## Positioning copy (approved tone)

**Home:**

```text
[Clinic Name]
Healthcare from the comfort of your home

Tell us your problem. We'll help you with the next step.

[Start Consultation]
```

**Avoid:** “AI doctor”, “instant diagnosis”, “emergency hospital online”.

## Phase 0 complete when

1. `01-care-provider.md` doctor identity filled + signed  
2. `02-compliance-checklist.md` sections for phone MVP checked  
3. Consent / privacy / emergency copy accepted by clinic  
4. `06-clinic-operations.md` phone, hours, area, price filled  
5. This decisions file accepted  

Then start **Phase 1** (see `PROJECT.md`).
