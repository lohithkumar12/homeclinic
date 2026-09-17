# 03 — Consent Text (Data Processing + Consultation)

**Use in Phase 1:** Required checkbox on the intake form before Submit.  
**Also show:** Link to Privacy Policy (`04-privacy-policy.md`).

Replace `[Clinic Name]` and contact fields before launch.

---

## Short checkbox copy (UI)

```text
I confirm that the information I provide is accurate to the best of my knowledge.
I consent to [Clinic Name] collecting and processing my health and contact details
to review my request and contact me about consultation.

I understand this is not an emergency service. If I have a medical emergency,
I will contact local emergency services immediately.

I consent to a phone consultation with a registered medical practitioner /
clinic team, if offered after review.

[ ] I agree to the Consent terms and Privacy Policy
```

---

## Full consent text (linked “Read more” / footer)

### 1. Who we are

`[Clinic Name]` (“Clinic”, “we”) operates a digital patient intake channel so our clinic team can review your health concern and contact you about next steps.

### 2. What you consent to

By submitting the intake form, you consent to:

1. **Data processing** — collection, storage, and use of your personal and health information (name, age, gender, phone, location, symptoms, history, uploads) for patient intake, triage, consultation coordination, and medical records related to your care.
2. **Contact** — being contacted by phone / SMS / WhatsApp / email at the number or address you provide regarding your request.
3. **Teleconsultation (if offered)** — a remote consultation (initially by phone) with our registered medical practitioner or clinic staff as appropriate. Clinical advice is provided only by qualified professionals, not by automated systems.
4. **Record keeping** — retention of consultation-related notes and documents as part of your clinical record, subject to our Privacy Policy.

### 3. What this service is not

- Not an emergency or ambulance service  
- Not a substitute for in-person emergency care  
- Not an AI diagnosis or treatment service  
- Not a guarantee of appointment, prescription, or outcome  

### 4. Your responsibilities

- Provide truthful and complete information  
- Seek emergency care immediately for life-threatening symptoms  
- Confirm your identity when the clinic contacts you  
- Ask questions if you do not understand any advice given  

### 5. Withdrawal

You may withdraw consent for further contact by telling the clinic. Withdrawal may limit our ability to continue services. Records already created for care may be retained as required for clinical, legal, or regulatory reasons.

### 6. Contact

For consent or privacy questions: `[privacy@clinic.example]` / `[clinic phone]`

---

## Implementation notes (Phase 1)

- Block submit until checkbox is checked  
- Store `consent_accepted_at` + consent version (e.g. `v1.0`) with each request  
- Keep this file versioned when copy changes
