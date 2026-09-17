from sqlalchemy.orm import Session

from app.auth import hash_password
from app.config import settings
from app.models import User


def ensure_admin_user(db: Session) -> None:
    existing = db.query(User).filter(User.email == settings.admin_email).first()
    if existing:
        return
    user = User(
        email=settings.admin_email.lower().strip(),
        name=settings.admin_name,
        hashed_password=hash_password(settings.admin_password),
        role="admin",
    )
    db.add(user)
    db.commit()
