"""Progression and XP models."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class Progression(BaseModel):
    """User's overall progression state."""

    id: str
    user_id: str
    total_xp: int = 0
    level: int = 1
    rank_index: int = 0
    streak: int = 0
    last_workout_date: Optional[datetime] = None
    workouts_completed: int = 0
    lock_in_sessions: int = 0
    updated_at: Optional[datetime] = None


class XpBreakdown(BaseModel):
    """A single XP award entry."""

    id: str
    user_id: str
    category: str
    amount: int
    source: str = "workout"
    created_at: Optional[datetime] = None
