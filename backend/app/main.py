"""HomeClinic API — Phase 1 MVP."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import Base, engine, SessionLocal
from app.seed import ensure_admin_user
from app.routers import intake, admin_auth, admin_requests

Base.metadata.create_all(bind=engine)

app = FastAPI(title="HomeClinic API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

settings.upload_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(settings.upload_dir)), name="uploads")

app.include_router(intake.router, prefix="/api", tags=["intake"])
app.include_router(admin_auth.router, prefix="/api/admin/auth", tags=["admin-auth"])
app.include_router(admin_requests.router, prefix="/api/admin", tags=["admin"])


@app.on_event("startup")
def on_startup() -> None:
    db = SessionLocal()
    try:
        ensure_admin_user(db)
    finally:
        db.close()


@app.get("/api/health")
def health():
    return {"status": "ok", "clinic": settings.clinic_name}
