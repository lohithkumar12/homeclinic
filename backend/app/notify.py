import logging
import smtplib
from email.message import EmailMessage

from app.config import settings

logger = logging.getLogger(__name__)


def notify_clinic_new_request(
    *,
    public_id: str,
    patient_name: str,
    phone: str,
    complaint: str,
    priority: str,
    red_flag: bool,
) -> None:
    """Best-effort email notification. Logs if SMTP is not configured."""
    subject = f"[HomeClinic] {'URGENT ' if red_flag or priority == 'urgent' else ''}New request {public_id}"
    body = (
        f"New consultation request\n\n"
        f"ID: {public_id}\n"
        f"Patient: {patient_name}\n"
        f"Phone: {phone}\n"
        f"Priority: {priority}\n"
        f"Red flag: {red_flag}\n"
        f"Complaint: {complaint}\n\n"
        f"Open the admin dashboard to review.\n"
    )

    logger.info("NEW_REQUEST %s priority=%s red_flag=%s patient=%s", public_id, priority, red_flag, patient_name)

    to_addr = settings.clinic_notify_email or settings.admin_email
    if not settings.smtp_host:
        logger.info("SMTP not configured — notification logged only.\n%s\n%s", subject, body)
        return

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = settings.smtp_from or settings.smtp_user
    msg["To"] = to_addr
    msg.set_content(body)

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as server:
            server.starttls()
            if settings.smtp_user:
                server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(msg)
    except Exception:
        logger.exception("Failed to send clinic notification email")
