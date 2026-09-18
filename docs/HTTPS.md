# HTTPS setup (manadoctorhyd.com)

## On the VM (after DNS works)

```bash
cd ~/homeclinic
git pull

# Optional: set email for Let's Encrypt in .env
# CERTBOT_EMAIL=you@email.com
# CORS_ORIGINS=https://manadoctorhyd.com,https://www.manadoctorhyd.com

chmod +x scripts/setup_https.sh
bash scripts/setup_https.sh
```

Then update `.env`:

```env
CORS_ORIGINS=https://manadoctorhyd.com,https://www.manadoctorhyd.com
```

```bash
docker compose up -d api
```

Open: **https://manadoctorhyd.com**

## Renew certificates

```bash
cd ~/homeclinic
docker compose run --rm certbot renew
cp -f deploy/nginx.https.conf deploy/nginx.conf
docker compose exec nginx nginx -s reload
```

Cron (optional):

```text
0 3 * * * cd /home/YOUR_USER/homeclinic && docker compose run --rm certbot renew && docker compose exec nginx nginx -s reload
```

## After git pull (if site falls back to HTTP)

```bash
cp -f deploy/nginx.https.conf deploy/nginx.conf
docker compose exec nginx nginx -s reload
```
