"""Exercise model."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class Exercise(BaseModel):
    """A single exercise in the KAGE library."""

    id: str
    name: str
    target: str
    category: str
    kanji: str
    description: str = ""
    image_url: str = ""
    difficulty: str = "intermediate"
    created_at: Optional[datetime] = None
