from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.config import settings

security = HTTPBearer(auto_error=False)
DEV_USER_ID = "00000000-0000-0000-0000-000000000001"


def get_token_from_header(auth: HTTPAuthorizationCredentials | None = Depends(security)) -> str | None:
    if auth is None:
        return None
    return auth.credentials


def _ensure_dev_user_exists():
    try:
        from app.database import get_supabase
        supabase = get_supabase()
        existing = supabase.table("profiles").select("id").eq("id", DEV_USER_ID).limit(1).execute()
        if not existing.data:
            supabase.table("profiles").insert({
                "id": DEV_USER_ID, "username": "Dev Warrior",
            }).execute()
            supabase.table("progression").insert({
                "user_id": DEV_USER_ID, "total_xp": 0, "level": 1,
                "rank_index": 0, "streak": 0, "workouts_completed": 0,
            }).execute()
    except Exception:
        pass


async def get_current_user(request: Request, token: str | None = Depends(get_token_from_header)) -> dict:
    if settings.dev_bypass_auth:
        _ensure_dev_user_exists()
        return {"sub": DEV_USER_ID, "email": "dev@kage.dojo", "name": "Dev Warrior"}

    if token is None:
        raise HTTPException(status_code=401, detail="Missing authorization header")

    try:
        payload = jwt.decode(token, settings.supabase_jwt_secret, algorithms=["HS256"])
        return {
            "sub": payload.get("sub", ""),
            "email": payload.get("email", ""),
            "name": payload.get("name", ""),
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
