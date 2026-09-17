# 05 — Emergency Disclaimer Copy

**Rule:** Show on intake (before/during form) **and** on the success / confirmation screen.  
Also show immediately when red-flag symptoms are detected.

Replace `[Clinic Name]` and emergency number guidance as needed for your locality.

---

## A. Persistent banner / form notice (always visible)

```text
Not for emergencies. If you have severe symptoms such as chest pain, difficulty
breathing, uncontrolled bleeding, sudden weakness, or loss of consciousness,
call local emergency services immediately (e.g. 108 / 112) or go to the nearest
emergency department. [Clinic Name] is not an emergency service.
```

---

## B. Red-flag interstitial (when urgent keywords detected)

### Title

```text
Possible emergency — seek immediate care
```

### Body

```text
Based on what you entered, your symptoms may require urgent medical attention.

Please contact emergency services or go to the nearest emergency department now.
Do not wait for an online or phone consultation.

If you still want our clinic team to follow up afterward, you may submit your
request. We will treat it as urgent and try to contact you, but this does not
replace emergency care.
```

### Primary CTA

```text
Call emergency services / Get emergency help
```

### Secondary CTA

```text
I understand — still submit as urgent for clinic follow-up
```

### Optional cancel

```text
Cancel and exit
```

---

## C. Success page reminder

```text
Your request has been received.

Consultation ID: [CLN-XXXXX]

Our clinic team will contact you shortly.

Clinic: [phone]
Available: [hours]

For emergencies, contact your nearest emergency service immediately.
This confirmation is not medical advice and not an emergency response.
```

---

## D. Marketing / home page one-liner

```text
Tell us your problem. We’ll help with the next step.
For emergencies, call local emergency services — not this website.
```

---

## E. Staff SOP (internal)

When a request is marked **Urgent / red-flag**:

1. Prioritize callback immediately.  
2. First message on call: confirm safety; if emergency ongoing, direct to 108/ER.  
3. Do not reassure in a way that delays emergency care.  
4. Document time of contact and advice given.  
5. Update status in dashboard.

---

## F. Example red-flag keyword set (Phase 1 rules engine)

Use case-insensitive matching on complaint/symptoms free text (expand over time):

- chest pain, heart attack, pressure in chest  
- difficulty breathing, shortness of breath, can’t breathe, unable to breathe  
- unconscious, unresponsive, passed out, fainting with injury  
- heavy bleeding, severe bleeding, bleeding won’t stop  
- stroke, face drooping, slurred speech, sudden weakness one side  
- severe allergic reaction, anaphylaxis, throat swelling  
- suicidal, kill myself, want to die *(route to emergency/crisis resources; do not treat as routine booking)*  
- seizure lasting, seizure not stopping  
- severe abdominal pain with fainting / vomiting blood / black stools *(clinical judgment; may escalate)*  

**Product rule:** Never make “Book for tomorrow” the primary CTA when red flags fire.
