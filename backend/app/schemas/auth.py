"""Auth-related request/response schemas."""

from pydantic import BaseModel, EmailStr, Field


class SignupRequest(BaseModel):
    """Request body for POST /api/auth/signup."""

    email: str = Field(..., example="shadow@kage.dojo")
    password: str = Field(..., min_length=6, example="secret123")
    name: str = Field(..., min_length=1, max_length=100, example="Shadow Warrior")


class LoginRequest(BaseModel):
    """Request body for POST /api/auth/login."""

    email: str = Field(..., example="shadow@kage.dojo")
    password: str = Field(..., example="secret123")


class AuthResponse(BaseModel):
    """Successful authentication response."""

    access_token: str
    token_type: str = "bearer"
    user: dict


class UserProfile(BaseModel):
    """Public user profile returned by GET /api/auth/me."""

    id: str
    username: str | None = None
    level: int = 1
    xp: int = 0


class ErrorResponse(BaseModel):
    """Standard error response."""

    detail: str
