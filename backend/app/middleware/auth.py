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


async def get_current_user(request: Request, token: str | None = Depends(get_token_from_header)) -> dict:
    if settings.dev_bypass_auth:
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
