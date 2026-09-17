# 02 — Compliance Checklist (India-oriented)

**Jurisdiction focus:** India (Telemedicine Practice Guidelines 2020 + related practice norms).  
**Status:** Working checklist — confirm with your doctor and a lawyer for your state.  
**Not legal advice.**

Use this before seeing real patients via the platform.

## A. Provider readiness

- [ ] Treating clinician is a Registered Medical Practitioner (RMP) with valid registration
- [ ] Registration details will be available to patients when care is provided (name, qualification, registration as required)
- [ ] Clinic operator understands software does not practice medicine
- [ ] Clear process: who answers the phone, who may give medical advice

## B. Telemedicine (phone consultation — MVP)

Aligned with India’s Telemedicine Practice Guidelines (2020) at a high level:

- [ ] Mode for MVP is **audio / phone** (explicitly chosen)
- [ ] Patient identity is verified reasonably (name + phone; later OTP)
- [ ] Patient consent for teleconsultation is obtained (see `03-consent.md`)
- [ ] RMP will exercise professional judgment on whether phone consult is appropriate vs in-person
- [ ] RMP will not prescribe restricted categories beyond what guidelines allow for this mode
- [ ] Documentation of consultation will be kept (complaint, advice, Rx if any)
- [ ] Fee disclosure before/at time of paid consult (Phase 1 may collect fee offline; Phase 2 online)
- [ ] No claim of AI diagnosis in marketing, UI, or doctor workflow

## C. Emergency handling

- [ ] Emergency disclaimer shown on intake and confirmation (`05-emergency-disclaimer.md`)
- [ ] Red-flag symptoms trigger urgent warning (Phase 1 keyword rules)
- [ ] Staff SOP: if urgent → advise emergency services first, then clinic follow-up
- [ ] Clinic does **not** market itself as emergency / ambulance service

## D. Home visits (defer until after MVP unless you already do this)

- [ ] Decide whether home visits are offered in Phase 1 (**default: No**)
- [ ] If Yes later: define who visits, credentials, consent, safety, fees, documentation
- [ ] Confirm any local clinical establishment / practice requirements for home care

## E. Data protection & records

- [ ] Privacy notice shown / linked (`04-privacy-policy.md`)
- [ ] Consent for collecting health data obtained
- [ ] Access to admin dashboard limited to authorized staff
- [ ] Plan for secure storage of uploads (reports, photos)
- [ ] Retention period decided (see privacy policy draft)
- [ ] Process for patient data access / correction / deletion requests (as applicable under DPDP / practice policy)
- [ ] No sharing of patient data for marketing without consent

## F. Business / operations

- [ ] Clinic phone and hours published accurately
- [ ] Service area defined (who you will call back)
- [ ] Pricing draft approved by clinic (`06-clinic-operations.md`)
- [ ] Payment method for MVP decided (cash / UPI offline recommended initially)
- [ ] Invoice / receipt process (even if manual)

## G. Prescriptions (when issued)

- [ ] Only RMP issues prescriptions
- [ ] Prescription includes required clinician identifiers per practice norms
- [ ] Shared to patient via agreed channel (WhatsApp/SMS/PDF) with care for privacy
- [ ] Software stores a copy in the patient record when Phase 2+ records exist

## H. Marketing claims — forbidden until reviewed

- [ ] Do **not** say “AI doctor”, “AI diagnosis”, “guaranteed cure”, “emergency hospital”
- [ ] Preferred language: “Tell us your problem. Our clinic team will guide the next step.”
- [ ] Always include: not for emergencies; for emergencies call local emergency services

## Sign-off

| Item | Owner | Date completed |
|------|-------|----------------|
| Provider readiness | Doctor | |
| Telemedicine mode | Doctor | |
| Emergency SOP | Clinic operator | |
| Privacy / data | Clinic operator | |
| Legal review (recommended) | Lawyer | |

**Phase 0 exit:** Sections A–C and E–H checked for MVP phone-only launch; D deferred if home visits not offered yet.
