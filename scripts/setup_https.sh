#!/usr/bin/env bash
# Obtain Let's Encrypt cert and enable HTTPS for manadoctorhyd.com
# Run on the GCP VM from repo root:
#   bash scripts/setup_https.sh
#
# Prerequisites:
#   - DNS A records for manadoctorhyd.com and www → this VM IP
#   - GCP firewall: Allow HTTP + HTTPS
#   - Stack already running: docker compose up -d

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

DOMAIN="${DOMAIN:-manadoctorhyd.com}"
EMAIL="${CERTBOT_EMAIL:-}"

if [[ -z "$EMAIL" ]]; then
  if [[ -f .env ]]; then
    # shellcheck disable=SC1091
    set -a
    source .env || true
    set +a
  fi
  EMAIL="${CERTBOT_EMAIL:-admin@${DOMAIN}}"
fi

echo "==> Domain: $DOMAIN"
echo "==> Cert email: $EMAIL"

mkdir -p certbot/www certbot/conf
cp -f deploy/nginx.http.conf deploy/nginx.conf

echo "==> Starting / refreshing stack (HTTP + ACME webroot)"
if docker info >/dev/null 2>&1; then
  DC="docker compose"
else
  DC="sudo docker compose"
fi

$DC up -d --build

echo "==> Waiting for nginx..."
sleep 5

echo "==> Requesting Let's Encrypt certificate"
$DC run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  --non-interactive \
  -d "$DOMAIN" \
  -d "www.$DOMAIN"

echo "==> Enabling HTTPS nginx config"
cp -f deploy/nginx.https.conf deploy/nginx.conf
$DC exec nginx nginx -t
$DC exec nginx nginx -s reload

echo ""
echo "HTTPS is live:"
echo "  https://$DOMAIN"
echo "  https://www.$DOMAIN"
echo ""
echo "Update .env CORS_ORIGINS to include:"
echo "  CORS_ORIGINS=https://$DOMAIN,https://www.$DOMAIN"
echo "Then: docker compose up -d api"
echo ""
echo "Renewal (add to crontab -e):"
echo "  0 3 * * * cd $REPO_ROOT && $DC run --rm certbot renew && $DC exec nginx nginx -s reload"
