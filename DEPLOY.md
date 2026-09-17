# HomeClinic — GCP VM Deploy Guide

Same pattern as your trading bots: **git push → clone/pull on GCP VM → Docker Compose**.

**Do not** deploy HomeClinic on the trading-bot VM. Use a **dedicated** clinic VM.

---

## 1. Recommended GCP VM

| Setting | Value |
|---------|--------|
| Machine type | **`e2-standard-2`** (2 vCPU, 8 GB RAM) |
| Region / zone | **`asia-south1`** (Mumbai) |
| Boot disk | 40–50 GB SSD |
| OS | Debian 12 or Ubuntu 22.04 LTS |
| External IP | Static (reserve one) |
| Firewall | Allow **TCP 80** (HTTP). Later **443** for HTTPS. SSH **22** only from your IP if possible. |

Why `e2-standard-2`: runs nginx + Next.js + FastAPI + Postgres + uploads, with headroom for Phase 2–3 (payments, WhatsApp, light AI).

Cheaper MVP-only option: `e2-medium` (2 vCPU / 4 GB) — upgrade before AI load.

---

## 2. One-time: create the VM

In Google Cloud Console (or `gcloud`):

1. Create VM with the specs above  
2. Check **Allow HTTP traffic** (or create a firewall rule for tcp:80)  
3. Note the external IP  
4. SSH into the VM  

Optional `gcloud` sketch:

```bash
gcloud compute instances create homeclinic-vm \
  --zone=asia-south1-a \
  --machine-type=e2-standard-2 \
  --boot-disk-size=50GB \
  --image-family=debian-12 \
  --image-project=debian-cloud \
  --tags=http-server,https-server
```

---

## 3. Deploy on the VM

```bash
# Install git if needed
sudo apt-get update -y && sudo apt-get install -y git

cd ~
git clone https://github.com/lohithkumar12/homeclinic.git
cd homeclinic

# Edit production secrets
cp .env.example .env
nano .env
# Set: CLINIC_PHONE, CLINIC_HOURS, POSTGRES_PASSWORD, ADMIN_PASSWORD, SECRET_KEY

bash scripts/vm_setup.sh
```

Site: `http://YOUR_EXTERNAL_IP`  
Admin: `http://YOUR_EXTERNAL_IP/admin/login`

---

## 4. Update after code changes (local → GitHub → VM)

**On your laptop**

```bash
git add -A
git commit -m "your message"
git push origin main
```

**On the VM**

```bash
cd ~/homeclinic
git pull
docker compose up -d --build
```

---

## 5. Useful commands

```bash
docker compose ps
docker compose logs -f api
docker compose logs -f web
docker compose down
```

---

## 6. HTTPS (do soon for real patients)

1. Point a domain A-record to the VM IP  
2. Install Certbot / use nginx + Let’s Encrypt  
3. Update `CORS_ORIGINS` in `.env` to `https://yourdomain.com`  
4. Redeploy: `docker compose up -d`

Until HTTPS is on, treat the IP URL as staging only.

---

## 7. Security checklist before soft launch

- [ ] Changed `ADMIN_PASSWORD` and `SECRET_KEY`  
- [ ] Changed `POSTGRES_PASSWORD`  
- [ ] Set real `CLINIC_PHONE` / `CLINIC_HOURS`  
- [ ] `.env` is on the VM only (never committed)  
- [ ] Separate VM from trading bots  
- [ ] Phase 0 doctor / consent docs filled  

---

## Architecture on the VM

```text
Internet → :80 nginx
              ├─ /        → web (Next.js :3000)
              ├─ /api/    → api (FastAPI :8000)
              └─ /uploads → api
                            ↓
                         Postgres
```
