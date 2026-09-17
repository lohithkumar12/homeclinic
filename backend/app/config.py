from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    clinic_name: str = "HomeClinic"
    clinic_phone: str = "9XXXXXXXXX"
    clinic_hours: str = "9 AM – 8 PM"
    clinic_notify_email: str = ""

    database_url: str = "sqlite:///./homeclinic.db"
    secret_key: str = "change-me-in-production-homeclinic-secret"
    access_token_expire_minutes: int = 60 * 12
    admin_email: str = "admin@homeclinic.local"
    admin_password: str = "admin123"
    admin_name: str = "Clinic Admin"

    upload_dir: Path = Path(__file__).resolve().parent.parent / "uploads"
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    consent_version: str = "v1.0"
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = ""

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
