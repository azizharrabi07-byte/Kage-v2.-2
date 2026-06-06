"""Progression-related request/response schemas."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class ProgressionResponse(BaseModel):
    """User's current progression stats."""

    total_xp: int = 0
    level: int = 1
    rank_index: int = 0
    rank_name: str = "Mudan"
    rank_kanji: str = "無段"
    streak: int = 0
    last_workout_date: Optional[datetime] = None
    workouts_completed: int = 0
    lock_in_sessions: int = 0
    xp_to_next_level: int = 100
    current_level_xp: int = 0


class AddXpRequest(BaseModel):
    """Request body for POST /api/progression/xp."""

    category: str = Field(..., example="strength")
    amount: int = Field(..., ge=1, le=10000, example=50)
    source: str = "workout"


class PersonalRecordResponse(BaseModel):
    """A personal best record."""

    id: str
    exercise_id: str
    exercise_name: str = ""
    weight_kg: float
    reps: int
    achieved_at: Optional[datetime] = None


class CreatePrRequest(BaseModel):
    """Request body for POST /api/personal-records."""

    exercise_id: str
    weight_kg: float = Field(..., gt=0)
    reps: int = Field(1, ge=1)
