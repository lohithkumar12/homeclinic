# Clinic notifications (SMS + WhatsApp + Email)

When a patient submits intake, HomeClinic notifies the clinic doctor.

## Channels

| Channel | Status | How to enable |
|---------|--------|----------------|
| **SMS** | Ready to wire | Twilio Account SID + Auth Token + SMS From number |
| **WhatsApp** | Code ready, off until you have WA sender | Twilio WhatsApp sandbox **or** WhatsApp Business API number |
| **Email** | Optional | SMTP settings |

Doctor phone (your uncle): set in `.env`:

```env
CLINIC_NOTIFY_PHONE=+918143329173
```

## Message example

```text
HomeClinic CLN-10045
Patient: Rahul
Phone: 98XXXXXXXX
Problem: Fever
Symptoms: body pain
Priority: normal
```

Urgent / red-flag requests start with `URGENT`.

## Enable SMS now (recommended first)

1. Create a [Twilio](https://www.twilio.com) account  
2. Get **Account SID** + **Auth Token**  
3. Buy/get an SMS-capable number  
4. On the VM, edit `~/homeclinic/.env`:

```env
CLINIC_NOTIFY_PHONE=+918143329173
TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxx
TWILIO_SMS_FROM=+1XXXXXXXXXX
```

5. Restart API:

```bash
cd ~/homeclinic
docker compose up -d --build api
docker compose logs -f api
```

6. Submit a test intake → uncle should get SMS.

## WhatsApp later (no Business account yet)

Code already calls WhatsApp **only if** `TWILIO_WHATSAPP_FROM` is set.

### Option A — Twilio Sandbox (test quickly)

1. Twilio Console → Messaging → Try WhatsApp  
2. Join the sandbox from uncle’s phone (send the join code)  
3. Set:

```env
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

(use the sandbox “From” Twilio shows you)

4. Restart API and test again.

### Option B — Real WhatsApp Business

When you have Meta WhatsApp Business + Twilio (or another provider) approved:

```env
TWILIO_WHATSAPP_FROM=whatsapp:+91XXXXXXXXXX
```

Until then, WhatsApp is safely skipped and only logged:

`WhatsApp notify skipped — no business/sandbox sender yet`

## Without Twilio credentials

Requests still save in the admin dashboard. Notifications are logged in API logs only.
