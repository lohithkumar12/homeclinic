#!/usr/bin/env bash
# GCP VM setup for HomeClinic (same pattern as your trading bots).
# Run from repo root AFTER: git clone ... && cd homeclinic
# Usage: bash scripts/vm_setup.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "==> Installing Docker (if needed)"
if ! command -v docker >/dev/null 2>&1; then
  sudo apt-get update -y
  sudo apt-get install -y ca-certificates curl
  sudo install -m 0755 -d /etc/apt/keyrings
  sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
  sudo chmod a+r /etc/apt/keyrings/docker.asc
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
    $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  sudo apt-get update -y
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
  sudo usermod -aG docker "$(whoami)" || true
fi

if [[ ! -f "$REPO_ROOT/.env" ]]; then
  if [[ -f "$REPO_ROOT/.env.example" ]]; then
    cp "$REPO_ROOT/.env.example" "$REPO_ROOT/.env"
    chmod 600 "$REPO_ROOT/.env"
    echo "Created .env from .env.example — edit secrets before going live:"
    echo "  nano $REPO_ROOT/.env"
  fi
else
  chmod 600 "$REPO_ROOT/.env"
  echo "==> Found existing .env"
fi

echo "==> Building and starting HomeClinic (nginx :80)"
if docker info >/dev/null 2>&1; then
  docker compose up -d --build
else
  sudo docker compose up -d --build
fi

echo ""
echo "Done."
echo "  Open:   http://YOUR_EXTERNAL_IP"
echo "  Admin:  http://YOUR_EXTERNAL_IP/admin/login"
echo "  Logs:   docker compose logs -f"
echo "  Update: git pull && docker compose up -d --build"
echo ""
echo "GCP: create a dedicated VM (recommended e2-standard-2, asia-south1)."
echo "Firewall: allow TCP 80 (and 443 later for HTTPS). Keep SSH 22 restricted."
