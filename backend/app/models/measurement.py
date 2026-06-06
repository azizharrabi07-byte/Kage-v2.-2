"""Body measurement models."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class BodyMeasurement(BaseModel):
    """A single body measurement log entry."""

    id: str
    user_id: str
    weight_kg: Optional[float] = None
    body_fat: Optional[float] = None
    chest_cm: Optional[float] = None
    waist_cm: Optional[float] = None
    arm_cm: Optional[float] = None
    thigh_cm: Optional[float] = None
    notes: str = ""
    measured_at: Optional[datetime] = None
