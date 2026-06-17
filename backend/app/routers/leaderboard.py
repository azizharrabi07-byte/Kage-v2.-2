from fastapi import APIRouter, Query, Depends
from app.middleware.auth import get_current_user
from app.database import get_supabase

router = APIRouter()


@router.get("")
async def get_leaderboard(
    limit: int = Query(50, le=200),
    user: dict = Depends(get_current_user),
):
    supabase = get_supabase()
    result = supabase.table("profiles") \
        .select("id, username, level, xp, total_workouts, avatar_url") \
        .order("xp", desc=True) \
        .limit(limit) \
        .execute()
    return result.data or []


@router.get("/rank")
async def get_user_rank(user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    user_id = user["sub"]
    profile = supabase.table("profiles").select("xp").eq("id", user_id).single().execute()
    if not profile.data:
        return {"rank": 0, "total": 0}
    xp = profile.data.get("xp", 0)
    ranked = supabase.table("profiles") \
        .select("id", count="exact") \
        .gte("xp", xp) \
        .execute()
    total = supabase.table("profiles").select("id", count="exact").execute()
    return {
        "rank": (ranked.count or 0),
        "total": (total.count or 0),
        "xp": xp,
    }
