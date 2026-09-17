# 04 — Privacy & Medical Record Handling Policy

**Version:** 1.0 (draft)  
**Effective date:** _[fill before launch]_  
**Owner:** `[Clinic Name]`

This is a practical draft for a small home-based clinic using HomeClinic software. Have it reviewed for your jurisdiction (including India’s DPDP Act considerations) before public launch.

---

## 1. Scope

This policy covers personal data and health information collected through:

- Website / app intake forms  
- Uploaded reports, prescriptions, and photos  
- Clinic dashboard notes and status updates  
- Phone / message communications related to care  

## 2. Data we collect

| Category | Examples |
|----------|----------|
| Identity & contact | Name, age, gender, phone, location / address |
| Health information | Complaint, symptoms, duration, medications, allergies, conditions |
| Files | Lab reports, prescriptions, photos of affected areas |
| Operational | Consultation ID, status, priority, preferred time, staff notes |
| Technical (later) | Basic logs, device/browser metadata if analytics added |

We do **not** sell patient data.

## 3. Why we process data

- Review and respond to consultation requests  
- Triage / prioritize (including emergency risk flags)  
- Provide doctor-led consultation and follow-up  
- Maintain a care record  
- Contact you about appointments and reminders  
- Improve service operations (aggregated, where appropriate)  
- Meet legal / professional record-keeping duties  

## 4. Legal / consent basis (operational)

- Patient consent at intake  
- Necessary for providing requested healthcare coordination  
- Legitimate operational needs of the clinic (security, fraud prevention, quality)

## 5. Who can access data

| Role | Access |
|------|--------|
| Clinic admin / authorized staff | Intake requests and operational fields needed for their job |
| Treating doctor (RMP) | Clinical information for patients they manage |
| Patient | Their own information via clinic process (Phase 2: self-serve portal) |
| Vendors (hosting, SMS, storage) | Only as needed to run the service, under confidentiality |

Access should follow least privilege. Shared personal logins are discouraged.

## 6. Storage & security (MVP expectations)

- Prefer HTTPS for all web traffic  
- Restrict admin dashboard with authentication  
- Store uploads outside public web roots  
- Limit local device downloads of patient files  
- Do not post patient details in public chats or social media  
- Phase 2+: stronger encryption, cloud object storage, audit logs  

## 7. Retention

| Record type | Suggested retention (draft) |
|-------------|-----------------------------|
| Intake requests & clinical notes | Minimum period required for medical records in your practice / state; until then keep securely |
| Uploaded files | Same as related clinical record |
| Marketing contacts (if any later) | Until consent withdrawn |
| Admin access logs | 12 months (recommended) |

Exact retention should be confirmed with the doctor/lawyer.

## 8. Patient rights (practical process)

Patients may request (via clinic phone/email):

- Access to their submitted information  
- Correction of inaccurate demographics  
- Information about how their data is used  
- Deletion **where clinically and legally allowed** (complete erasure may not be possible for medical records)

Respond within a defined period (e.g. 7–30 days).

## 9. Children / minors

If the patient is a minor, a parent/guardian should submit and consent. Confirm identity on the call before clinical advice.

## 10. Cross-border transfer

MVP: keep hosting in a region you understand (document where DB/files live). If using foreign cloud regions, disclose that fact.

**Hosting location (fill):** _[e.g. India / AWS ap-south-1 / Azure Central India]_

## 11. Breaches

If patient data is leaked or accessed without authorization:

1. Contain the issue  
2. Assess impact  
3. Notify affected patients and authorities if required  
4. Document the incident  

## 12. Contact

Privacy contact: `[privacy@clinic.example]`  
Clinic phone: `[phone]`

---

## Short UI snippet (footer / intake)

```text
We use your details only to review your request and provide clinic care.
Read our Privacy Policy. This is not an emergency service.
```
