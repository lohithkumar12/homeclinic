# Admin access

## Login URL (secret + password)

```text
https://manadoctorhyd.com/admin/login/YOUR_SECRET
```

Set in `.env`:

```env
ADMIN_LOGIN_SECRET=12345678901234567abcdsed
ADMIN_EMAIL=admin@homeclinic.local
ADMIN_PASSWORD=your-strong-password
```

- Old URL `/admin/login` redirects to home (hidden)
- Homepage has no staff login link
- You still must enter email + password

Change `ADMIN_LOGIN_SECRET` anytime, then rebuild web:

```bash
docker compose up -d --build web
```
