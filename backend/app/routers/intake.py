import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import (
    Attachment,
    AuditLog,
    ConsultationRequest,
    Gender,
    Patient,
    RequestPriority,
    RequestStatus,
)
from app.notify import notify_clinic_new_request
from app.schemas import ClinicInfo, IntakeSuccess, TriageCheckRequest, TriageCheckResponse
from app.triage import check_red_flags

router = APIRouter()

ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
}
MAX_FILE_SIZE = 8 * 1024 * 1024  # 8 MB
MAX_FILES = 5


def _as_bool(value: str | bool) -> bool:
    if isinstance(value, bool):
        return value
    return str(value).strip().lower() in {"1", "true", "yes", "on"}


def _next_public_id(db: Session) -> str:
    # CLN-10000 + count-based sequence with random suffix fallback for uniqueness
    count = db.query(ConsultationRequest).count()
    candidate = f"CLN-{10000 + count + 1}"
    exists = db.query(ConsultationRequest).filter(ConsultationRequest.public_id == candidate).first()
    if exists:
        return f"CLN-{uuid.uuid4().hex[:6].upper()}"
    return candidate


@router.get("/clinic")
def get_clinic_info():
    return ClinicInfo(
        name=settings.clinic_name,
        phone=settings.clinic_phone,
        hours=settings.clinic_hours,
    )


@router.post("/triage/check", response_model=TriageCheckResponse)
def triage_check(payload: TriageCheckRequest):
    flagged, reasons = check_red_flags(payload.complaint, payload.symptoms)
    return TriageCheckResponse(red_flag=flagged, reasons=reasons)


@router.post("/intake", response_model=IntakeSuccess)
async def create_intake(
    name: str = Form(...),
    phone: str = Form(...),
    complaint: str = Form(...),
    consent: str = Form(...),
    symptoms: str | None = Form(None),
    age: int | None = Form(None),
    gender: Gender | None = Form(None),
    duration: str | None = Form(None),
    location: str | None = Form(None),
    medications: str | None = Form(None),
    allergies: str | None = Form(None),
    previous_conditions: str | None = Form(None),
    preferred_time: str | None = Form(None),
    acknowledge_emergency: str = Form("false"),
    files: list[UploadFile] = File(default=[]),
    db: Session = Depends(get_db),
):
    if not _as_bool(consent):
        raise HTTPException(status_code=400, detail="Consent is required")
    if not name.strip():
        raise HTTPException(status_code=400, detail="Name is required")
    if not phone.strip() or len(phone.strip()) < 8:
        raise HTTPException(status_code=400, detail="Valid phone number is required")
    if not complaint.strip():
        raise HTTPException(status_code=400, detail="Problem / complaint is required")
    if age is not None and (age < 0 or age > 120):
        raise HTTPException(status_code=400, detail="Invalid age")

    red_flag, reasons = check_red_flags(complaint, symptoms or "")
    if red_flag and not _as_bool(acknowledge_emergency):
        raise HTTPException(
            status_code=409,
            detail={
                "code": "RED_FLAG",
                "message": "Possible emergency symptoms detected. Acknowledge emergency warning to submit as urgent.",
                "reasons": reasons,
            },
        )

    priority = RequestPriority.urgent if red_flag else RequestPriority.normal
    public_id = _next_public_id(db)

    patient = Patient(
        name=name.strip(),
        age=age if age is not None else 0,
        gender=gender or Gender.prefer_not_to_say,
        phone=phone.strip(),
        location=(location or "").strip() or None,
    )
    db.add(patient)
    db.flush()

    request = ConsultationRequest(
        public_id=public_id,
        patient_id=patient.id,
        complaint=complaint.strip(),
        duration=(duration or "").strip() or "not specified",
        symptoms=(symptoms or "").strip() or None,
        medications=(medications or "").strip() or None,
        allergies=(allergies or "").strip() or None,
        previous_conditions=(previous_conditions or "").strip() or None,
        preferred_time=(preferred_time or "").strip() or None,
        status=RequestStatus.new,
        priority=priority,
        red_flag=red_flag,
        red_flag_reasons=json.dumps(reasons) if reasons else None,
        consent_version=settings.consent_version,
        consent_accepted_at=datetime.now(timezone.utc),
    )
    db.add(request)
    db.flush()

    if files and len(files) > MAX_FILES:
        raise HTTPException(status_code=400, detail=f"Maximum {MAX_FILES} files allowed")

    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    for upload in files:
        if not upload.filename:
            continue
        content = await upload.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail=f"File too large: {upload.filename}")
        content_type = upload.content_type or "application/octet-stream"
        if content_type not in ALLOWED_CONTENT_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type for {upload.filename}. Allowed: JPG, PNG, WEBP, PDF",
            )
        stored = f"{public_id}_{uuid.uuid4().hex}_{Path(upload.filename).name}"
        path = settings.upload_dir / stored
        path.write_bytes(content)
        db.add(
            Attachment(
                request_id=request.id,
                original_filename=upload.filename,
                stored_filename=stored,
                content_type=content_type,
                size_bytes=len(content),
            )
        )

    db.add(
        AuditLog(
            actor_id=None,
            action="intake_created",
            entity_type="consultation_request",
            entity_id=public_id,
            detail=json.dumps({"priority": priority.value, "red_flag": red_flag, "reasons": reasons}),
        )
    )
    db.commit()
    db.refresh(request)

    notify_clinic_new_request(
        public_id=public_id,
        patient_name=patient.name,
        phone=patient.phone,
        complaint=request.complaint,
        priority=priority.value,
        red_flag=red_flag,
    )

    return IntakeSuccess(
        public_id=public_id,
        priority=priority,
        red_flag=red_flag,
        red_flag_reasons=reasons,
        clinic=ClinicInfo(
            name=settings.clinic_name,
            phone=settings.clinic_phone,
            hours=settings.clinic_hours,
        ),
    )
