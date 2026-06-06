"""Workout template, session, and set models."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class WorkoutTemplate(BaseModel):
    """A workout template (preset routine)."""

    id: str
    user_id: Optional[str] = None
    name: str
    kanji: str
    description: str = ""
    difficulty: str = "intermediate"
    duration: int = 30
    is_custom: bool = False
    created_at: Optional[datetime] = None


class TemplateExercise(BaseModel):
    """An exercise linked to a workout template."""

    id: str
    template_id: str
    exercise_id: str
    sort_order: int
    sets: int = 3
    reps: int = 10
    weight_kg: float = 0
    created_at: Optional[datetime] = None


class WorkoutSession(BaseModel):
    """A completed or in-progress workout session."""

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
    created_at: Optional[datetime] = None


class SessionExercise(BaseModel):
    """An exercise performed during a session."""

    id: str
    session_id: str
    exercise_id: str
    sort_order: int
    completed: bool = False
    created_at: Optional[datetime] = None


class WorkoutSet(BaseModel):
    """An individual set within a session exercise."""

    id: str
    session_exercise_id: str
    set_number: int
    reps: int = 10
    weight_kg: float = 0
    completed: bool = False
    completed_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
