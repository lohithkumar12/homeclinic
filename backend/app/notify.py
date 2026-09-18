import logging
import re
import smtplib
from email.message import EmailMessage
from urllib import parse, request

from app.config import settings

logger = logging.getLogger(__name__)


def _normalize_in_phone(raw: str) -> str:
    """Normalize to E.164 (+91…)."""
    raw = (raw or "").strip()
    if not raw:
        return ""
    digits = re.sub(r"\D", "", raw)
    if digits.startswith("91") and len(digits) >= 12:
        return f"+{digits}"
    if len(digits) == 10:
        return f"+91{digits}"
    if raw.startswith("+"):
        return f"+{digits}"
    return f"+{digits}" if digits else ""


def _build_message(
    *,
    public_id: str,
    patient_name: str,
    phone: str,
    complaint: str,
    symptoms: str,
    priority: str,
    red_flag: bool,
) -> tuple[str, str]:
    urgent = red_flag or priority == "urgent"
    title = f"{'URGENT ' if urgent else ''}HomeClinic {public_id}"
    body = (
        f"{title}\n"
        f"Patient: {patient_name}\n"
        f"Phone: {phone}\n"
        f"Problem: {complaint}\n"
        f"Symptoms: {symptoms or '—'}\n"
        f"Priority: {priority}"
        + ("\nRed flag: yes — call patient ASAP" if urgent else "")
    )
    return title, body


def _send_email(subject: str, body: str) -> None:
    to_addr = settings.clinic_notify_email or settings.admin_email
    if not settings.smtp_host:
        logger.info("Email notify skipped (SMTP not configured)")
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
        logger.info("Email notify sent to %s", to_addr)
    except Exception:
        logger.exception("Failed to send clinic notification email")


def _twilio_send(*, to: str, body: str, from_number: str) -> bool:
    sid = settings.twilio_account_sid
    token = settings.twilio_auth_token
    if not sid or not token or not from_number or not to:
        return False

    url = f"https://api.twilio.com/2010-04-01/Accounts/{sid}/Messages.json"
    data = parse.urlencode({"To": to, "From": from_number, "Body": body}).encode()
    req = request.Request(url, data=data, method="POST")
    credentials = parse.quote(sid, safe="") + ":" + parse.quote(token, safe="")
    import base64

    req.add_header(
        "Authorization",
        "Basic " + base64.b64encode(f"{sid}:{token}".encode()).decode(),
    )
    req.add_header("Content-Type", "application/x-www-form-urlencoded")

    try:
        with request.urlopen(req, timeout=15) as resp:
            logger.info("Twilio message accepted (%s) to %s", resp.status, to)
            return True
    except Exception:
        logger.exception("Twilio send failed to %s from %s", to, from_number)
        return False


def _send_sms(to_e164: str, body: str) -> None:
    if not settings.twilio_sms_from:
        logger.info(
            "SMS notify skipped — set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SMS_FROM to enable"
        )
        return
    ok = _twilio_send(to=to_e164, body=body, from_number=settings.twilio_sms_from)
    if ok:
        logger.info("SMS notify sent to %s", to_e164)


def _send_whatsapp(to_e164: str, body: str) -> None:
    """
    Requires WhatsApp-enabled Twilio sender (sandbox or Business).
    Until CLINIC has WhatsApp Business / Twilio WhatsApp From set, this is a no-op.
    """
    wa_from = (settings.twilio_whatsapp_from or "").strip()
    if not wa_from:
        logger.info(
            "WhatsApp notify skipped — no business/sandbox sender yet. "
            "When ready, set TWILIO_WHATSAPP_FROM=whatsapp:+1... (Twilio sandbox or approved number)"
        )
        return

    to = to_e164 if to_e164.startswith("whatsapp:") else f"whatsapp:{to_e164}"
    from_number = wa_from if wa_from.startswith("whatsapp:") else f"whatsapp:{wa_from}"
    ok = _twilio_send(to=to, body=body, from_number=from_number)
    if ok:
        logger.info("WhatsApp notify sent to %s", to)


def notify_clinic_new_request(
    *,
    public_id: str,
    patient_name: str,
    phone: str,
    complaint: str,
    symptoms: str = "",
    priority: str,
    red_flag: bool,
) -> None:
    """Notify clinic via email + SMS + WhatsApp (each channel if configured)."""
    subject, body = _build_message(
        public_id=public_id,
        patient_name=patient_name,
        phone=phone,
        complaint=complaint,
        symptoms=symptoms,
        priority=priority,
        red_flag=red_flag,
    )

    logger.info(
        "NEW_REQUEST %s priority=%s red_flag=%s patient=%s\n%s",
        public_id,
        priority,
        red_flag,
        patient_name,
        body,
    )

    _send_email(subject, body)

    doctor_phone = _normalize_in_phone(settings.clinic_notify_phone)
    if not doctor_phone:
        logger.warning("CLINIC_NOTIFY_PHONE not set — SMS/WhatsApp skipped")
        return

    _send_sms(doctor_phone, body)
    _send_whatsapp(doctor_phone, body)
