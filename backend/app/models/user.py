"""User model representing Supabase auth users."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class User(BaseModel):
    """Mirrors the auth.users table fields relevant to the application."""

    id: str
    email: str
    name: str
    created_at: Optional[datetime] = None
