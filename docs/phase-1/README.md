# Phase 1 — MVP Implementation Notes

**Status:** Complete (software). Soft-launch after Phase 0 clinic blanks + doctor sign-off.

## Run

See root [`README.md`](../../README.md).

Default admin: `admin@homeclinic.local` / `admin123` — change before any real use.

## Flows verified

- Normal intake → `CLN-xxxxx` + priority `normal`
- Red-flag text (e.g. chest pain) → blocked until emergency acknowledgement → `urgent`
- Admin login → list → detail → status/notes update
- Notification: logged to API console; email if SMTP env vars set

## Operating model (your setup)

- Lead doctor: your uncle (MBBS / RMP)
- Panel: doctor friends assigned manually for now (phone / WhatsApp outside the app)
- Phase 2 adds doctor logins + assignment in-product

## Next

Phase 2 only after real patients use Phase 1: accounts, appointments, payments, doctor roles.
