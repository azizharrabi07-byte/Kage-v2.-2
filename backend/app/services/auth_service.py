from app.database import get_supabase
from app.config import settings
from jose import jwt
from datetime import datetime, timedelta


def signup(email: str, password: str, name: str) -> dict:
    supabase = get_supabase()
    auth_resp = supabase.auth.sign_up({"email": email, "password": password})
    user = auth_resp.user
    if not user:
        raise ValueError("Signup failed")

    supabase.table("users").upsert({
        "id": user.id,
        "email": email,
        "name": name,
    }).execute()

    supabase.table("progression").insert({
        "user_id": user.id,
        "total_xp": 0,
        "level": 1,
        "rank_index": 0,
        "streak": 0,
        "workouts_completed": 0,
        "lock_in_sessions": 0,
    }).execute()

    token = _make_token(user.id, email)
    return {"access_token": token, "token_type": "bearer", "user": {"id": user.id, "email": email, "name": name}}


def login(email: str, password: str) -> dict:
    supabase = get_supabase()
    auth_resp = supabase.auth.sign_in_with_password({"email": email, "password": password})
    user = auth_resp.user
    if not user:
        raise ValueError("Invalid credentials")

    profile = supabase.table("users").select("id, email, name").eq("id", user.id).single().execute()
    user_data = profile.data if profile.data else {"id": user.id, "email": email, "name": ""}

    token = _make_token(user.id, email)
    return {"access_token": token, "token_type": "bearer", "user": user_data}


def get_profile(user_id: str) -> dict | None:
    supabase = get_supabase()
    profile = supabase.table("users").select("id, email, name").eq("id", user_id).single().execute()
    return profile.data


def _make_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.utcnow() + timedelta(days=7),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, settings.supabase_jwt_secret, algorithm="HS256")
