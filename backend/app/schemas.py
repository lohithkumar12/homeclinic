from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.models import Gender, RequestPriority, RequestStatus


class ClinicInfo(BaseModel):
    name: str
    phone: str
    hours: str


class TriageCheckRequest(BaseModel):
    complaint: str = ""
    symptoms: str = ""


class TriageCheckResponse(BaseModel):
    red_flag: bool
    reasons: list[str]


class AttachmentOut(BaseModel):
    id: int
    original_filename: str
    url: str
    content_type: Optional[str] = None
    size_bytes: int

    model_config = {"from_attributes": True}


class NoteOut(BaseModel):
    id: int
    body: str
    created_at: datetime

    model_config = {"from_attributes": True}


class PatientOut(BaseModel):
    id: int
    name: str
    age: int
    gender: Gender
    phone: str
    location: Optional[str] = None

    model_config = {"from_attributes": True}


class RequestListItem(BaseModel):
    id: int
    public_id: str
    patient_name: str
    phone: str
    complaint: str
    status: RequestStatus
    priority: RequestPriority
    red_flag: bool
    created_at: datetime


class RequestDetail(BaseModel):
    id: int
    public_id: str
    status: RequestStatus
    priority: RequestPriority
    red_flag: bool
    red_flag_reasons: list[str]
    complaint: str
    duration: str
    symptoms: Optional[str] = None
    medications: Optional[str] = None
    allergies: Optional[str] = None
    previous_conditions: Optional[str] = None
    preferred_time: Optional[str] = None
    scheduled_at_note: Optional[str] = None
    consent_version: str
    consent_accepted_at: datetime
    created_at: datetime
    updated_at: datetime
    patient: PatientOut
    attachments: list[AttachmentOut]
    notes: list[NoteOut]


class IntakeSuccess(BaseModel):
    public_id: str
    priority: RequestPriority
    red_flag: bool
    red_flag_reasons: list[str]
    clinic: ClinicInfo
    message: str = "Your request has been received."


class RequestUpdate(BaseModel):
    status: Optional[RequestStatus] = None
    priority: Optional[RequestPriority] = None
    scheduled_at_note: Optional[str] = None
    note: Optional[str] = Field(default=None, max_length=5000)


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AdminMe(BaseModel):
    id: int
    email: str
    name: str
    role: str
