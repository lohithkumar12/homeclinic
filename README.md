# HomeClinic — Phase 1 MVP

Digital patient intake + clinic admin dashboard for phone consultations.

**Not an emergency service. Not an AI diagnosis product.**

## What's included

| Area | Features |
|------|----------|
| Patient site | Home, intake form, emergency warning, success + Consultation ID |
| Triage | Rule-based red-flag keywords → Urgent |
| Admin | Login, request list/filters, patient detail, status/notes/schedule |
| API | FastAPI + **SQLite by default** (PostgreSQL optional via `DATABASE_URL`) |
| Files | JPG/PNG/WEBP/PDF uploads |

> Phase 1 uses SQLite so you can run immediately on Windows without Docker. Switch to PostgreSQL when you deploy.

## Deploy (GCP)

See **[DEPLOY.md](./DEPLOY.md)** — dedicated VM (`e2-standard-2`, Mumbai), Docker Compose, update via `git pull`.

```bash
git clone https://github.com/lohithkumar12/homeclinic.git
cd homeclinic
cp .env.example .env   # edit secrets
bash scripts/vm_setup.sh
```

## Quick start (local)

### 1. Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
# source .venv/bin/activate

pip install -r requirements.txt
copy .env.example .env   # or: cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

API: http://127.0.0.1:8000  
Docs: http://127.0.0.1:8000/docs

Default admin:

- Email: `admin@homeclinic.local`
- Password: `admin123`

### 2. Frontend

```bash
cd frontend
npm install
copy .env.local.example .env.local
npm run dev
```

Site: http://localhost:3000  
Admin: http://localhost:3000/admin/login

### Optional: PostgreSQL via Docker

```bash
docker compose up -d db
```

Set in `backend/.env`:

```env
DATABASE_URL=postgresql+psycopg2://homeclinic:homeclinic@localhost:5432/homeclinic
```

## Configure clinic

Edit `backend/.env`:

- `CLINIC_NAME`
- `CLINIC_PHONE`
- `CLINIC_HOURS`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD`

Optional SMTP fields send email on new requests; otherwise notifications are logged in the API console.

## Patient flow

1. Open home → **Start Consultation**
2. Fill intake + consent
3. If red flags → emergency interstitial (call 108 or submit as urgent)
4. Success page shows `CLN-xxxxx`
5. Clinic logs into admin → calls patient → updates status/notes

## Status workflow

`new` → `contact_pending` → `scheduled` → `completed` / `closed`

Priority: `normal` | `urgent`

## Phase docs

- Product plan: [`PROJECT.md`](./PROJECT.md)
- Phase 0 foundations: [`docs/phase-0/`](./docs/phase-0/README.md)

## Out of scope (later phases)

Patient accounts, payments, video, WhatsApp bot, AI intake, multi-clinic.
