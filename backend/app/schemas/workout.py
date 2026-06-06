"""Workout-related request/response schemas."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


# ── Template schemas ──────────────────────────────────────────────

class TemplateExerciseInput(BaseModel):
    """An exercise entry when creating a template."""

    exercise_id: str
    sort_order: int
    sets: int = 3
    reps: int = 10
    weight_kg: float = 0


class CreateTemplateRequest(BaseModel):
    """Request body for POST /api/workout-templates."""

    name: str = Field(..., min_length=1, max_length=200)
    kanji: str = ""
    description: str = ""
    difficulty: str = "intermediate"
    duration: int = 30
    exercises: list[TemplateExerciseInput] = []


class TemplateResponse(BaseModel):
    """Workout template returned to the client."""

    id: str
    user_id: Optional[str] = None
    name: str
    kanji: str
    description: str = ""
    difficulty: str = "intermediate"
    duration: int = 30
    is_custom: bool = False
    exercises: list = []
    created_at: Optional[datetime] = None


# ── Session schemas ───────────────────────────────────────────────

class SetInput(BaseModel):
    """A single set within a session exercise."""

    set_number: int
    reps: int = 10
    weight_kg: float = 0
    completed: bool = False
    completed_at: Optional[datetime] = None


class SessionExerciseInput(BaseModel):
    """An exercise performed during a session."""

    exercise_id: str
    sort_order: int
    completed: bool = False
    sets: list[SetInput] = []


class CreateSessionRequest(BaseModel):
    """Request body for POST /api/workout-sessions."""

    template_id: Optional[str] = None
    name: str = Field(..., min_length=1, max_length=200)
    kanji: str = ""
    started_at: datetime
    completed_at: Optional[datetime] = None
    notes: str = ""
    mood: int = 3
    duration_seconds: int = 0
    exercises: list[SessionExerciseInput] = []


class SessionResponse(BaseModel):
    """Workout session returned to the client."""

    id: str
    user_id: str
    template_id: Optional[str] = None
    name: str
    kanji: str = ""
    started_at: datetime
    completed_at: Optional[datetime] = None
    total_xp: int = 0
    notes: str = ""
    mood: int = 3
    duration_seconds: int = 0
    exercises: list = []
    created_at: Optional[datetime] = None


class SessionListResponse(BaseModel):
    """Paginated list of sessions."""

    items: list[SessionResponse]
    total: int
    limit: int
    offset: int
