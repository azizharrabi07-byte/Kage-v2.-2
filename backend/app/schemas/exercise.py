"""Exercise-related request/response schemas."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class ExerciseResponse(BaseModel):
    """Single exercise returned to the client."""

    id: str
    name: str
    target: str
    category: str
    kanji: str
    description: str = ""
    image_url: str = ""
    difficulty: str = "intermediate"
    created_at: Optional[datetime] = None


class ExerciseListParams(BaseModel):
    """Query parameters for listing exercises."""

    category: Optional[str] = None
    search: Optional[str] = None
