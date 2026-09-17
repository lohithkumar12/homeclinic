import json
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from app.auth import get_current_user
from app.config import settings
from app.database import get_db
from app.models import (
    AuditLog,
    ConsultationRequest,
    RequestNote,
    RequestPriority,
    RequestStatus,
    User,
)
from app.schemas import (
    AttachmentOut,
    NoteOut,
    PatientOut,
    RequestDetail,
    RequestListItem,
    RequestUpdate,
)

router = APIRouter()


def _attachment_url(stored_filename: str) -> str:
    return f"/uploads/{stored_filename}"


def _parse_reasons(raw: str | None) -> list[str]:
    if not raw:
        return []
    try:
        data = json.loads(raw)
        return data if isinstance(data, list) else [str(data)]
    except json.JSONDecodeError:
        return [raw]


def _to_detail(req: ConsultationRequest) -> RequestDetail:
    return RequestDetail(
        id=req.id,
        public_id=req.public_id,
        status=req.status,
        priority=req.priority,
        red_flag=req.red_flag,
        red_flag_reasons=_parse_reasons(req.red_flag_reasons),
        complaint=req.complaint,
        duration=req.duration,
        symptoms=req.symptoms,
        medications=req.medications,
        allergies=req.allergies,
        previous_conditions=req.previous_conditions,
        preferred_time=req.preferred_time,
        scheduled_at_note=req.scheduled_at_note,
        consent_version=req.consent_version,
        consent_accepted_at=req.consent_accepted_at,
        created_at=req.created_at,
        updated_at=req.updated_at,
        patient=PatientOut.model_validate(req.patient),
        attachments=[
            AttachmentOut(
                id=a.id,
                original_filename=a.original_filename,
                url=_attachment_url(a.stored_filename),
                content_type=a.content_type,
                size_bytes=a.size_bytes,
            )
            for a in req.attachments
        ],
        notes=[NoteOut.model_validate(n) for n in sorted(req.notes, key=lambda n: n.created_at)],
    )


@router.get("/requests", response_model=list[RequestListItem])
def list_requests(
    status_filter: Optional[RequestStatus] = Query(None, alias="status"),
    priority: Optional[RequestPriority] = None,
    q: Optional[str] = None,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    from app.models import Patient

    query = (
        db.query(ConsultationRequest)
        .join(Patient)
        .options(joinedload(ConsultationRequest.patient))
    )
    if status_filter:
        query = query.filter(ConsultationRequest.status == status_filter)
    if priority:
        query = query.filter(ConsultationRequest.priority == priority)
    if q:
        like = f"%{q.strip()}%"
        query = query.filter(
            (ConsultationRequest.public_id.ilike(like))
            | (ConsultationRequest.complaint.ilike(like))
            | (Patient.name.ilike(like))
            | (Patient.phone.ilike(like))
        )

    rows = query.order_by(ConsultationRequest.created_at.desc()).all()
    rows.sort(key=lambda r: (0 if r.priority == RequestPriority.urgent else 1, -r.created_at.timestamp()))

    return [
        RequestListItem(
            id=r.id,
            public_id=r.public_id,
            patient_name=r.patient.name,
            phone=r.patient.phone,
            complaint=r.complaint,
            status=r.status,
            priority=r.priority,
            red_flag=r.red_flag,
            created_at=r.created_at,
        )
        for r in rows
    ]


@router.get("/requests/{request_id}", response_model=RequestDetail)
def get_request(
    request_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    req = (
        db.query(ConsultationRequest)
        .options(
            joinedload(ConsultationRequest.patient),
            joinedload(ConsultationRequest.attachments),
            joinedload(ConsultationRequest.notes),
        )
        .filter(ConsultationRequest.id == request_id)
        .first()
    )
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    return _to_detail(req)


@router.patch("/requests/{request_id}", response_model=RequestDetail)
def update_request(
    request_id: int,
    payload: RequestUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    req = (
        db.query(ConsultationRequest)
        .options(
            joinedload(ConsultationRequest.patient),
            joinedload(ConsultationRequest.attachments),
            joinedload(ConsultationRequest.notes),
        )
        .filter(ConsultationRequest.id == request_id)
        .first()
    )
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    changes: dict = {}
    if payload.status is not None:
        req.status = payload.status
        changes["status"] = payload.status.value
    if payload.priority is not None:
        req.priority = payload.priority
        changes["priority"] = payload.priority.value
    if payload.scheduled_at_note is not None:
        req.scheduled_at_note = payload.scheduled_at_note.strip() or None
        changes["scheduled_at_note"] = req.scheduled_at_note
    if payload.note and payload.note.strip():
        db.add(RequestNote(request_id=req.id, author_id=user.id, body=payload.note.strip()))
        changes["note_added"] = True

    db.add(
        AuditLog(
            actor_id=user.id,
            action="request_updated",
            entity_type="consultation_request",
            entity_id=req.public_id,
            detail=json.dumps(changes),
        )
    )
    db.commit()
    db.refresh(req)
    return _to_detail(req)


@router.get("/clinic")
def admin_clinic(_: User = Depends(get_current_user)):
    return {
        "name": settings.clinic_name,
        "phone": settings.clinic_phone,
        "hours": settings.clinic_hours,
    }
