"""Body measurement request/response schemas."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class CreateMeasurementRequest(BaseModel):
    """Request body for POST /api/body-measurements."""

    weight_kg: Optional[float] = Field(None, gt=0)
    body_fat: Optional[float] = Field(None, ge=0, le=100)
    chest_cm: Optional[float] = Field(None, gt=0)
    waist_cm: Optional[float] = Field(None, gt=0)
    arm_cm: Optional[float] = Field(None, gt=0)
    thigh_cm: Optional[float] = Field(None, gt=0)
    notes: str = ""
    measured_at: Optional[datetime] = None


class MeasurementResponse(BaseModel):
    """A single measurement log entry."""

    id: str
    weight_kg: Optional[float] = None
    body_fat: Optional[float] = None
    chest_cm: Optional[float] = None
    waist_cm: Optional[float] = None
    arm_cm: Optional[float] = None
    thigh_cm: Optional[float] = None
    notes: str = ""
    measured_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
