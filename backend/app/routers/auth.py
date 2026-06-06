from fastapi import APIRouter, HTTPException, Depends
from app.schemas.auth import SignupRequest, LoginRequest, AuthResponse, UserProfile
from app.middleware.auth import get_current_user
from app.services import auth_service

router = APIRouter()


@router.post("/signup", response_model=AuthResponse)
async def signup(body: SignupRequest):
    try:
        result = auth_service.signup(body.email, body.password, body.name)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Signup failed: {e}")


@router.post("/login", response_model=AuthResponse)
async def login(body: LoginRequest):
    try:
        result = auth_service.login(body.email, body.password)
        return result
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {e}")


@router.get("/me", response_model=UserProfile)
async def get_me(user: dict = Depends(get_current_user)):
    profile = auth_service.get_profile(user["sub"])
    if not profile:
        raise HTTPException(status_code=404, detail="User not found")
    return profile
