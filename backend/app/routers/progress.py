from fastapi import APIRouter, Depends
from app.database import get_supabase
from app.middleware.auth import get_current_user

router = APIRouter()


@router.get("/stats")
async def get_progress_stats(user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    user_id = user["sub"]

    profile = supabase.table("progression") \
        .select("*") \
        .eq("user_id", user_id) \
        .single() \
        .execute()
    profile_data = profile.data or {}

    achievements = supabase.table("user_achievements") \
        .select("*, achievements(name, description)") \
        .eq("user_id", user_id) \
        .execute()

    sessions = supabase.table("workout_sessions") \
        .select("id, started_at, completed_at, total_xp_earned", count="exact") \
        .eq("user_id", user_id) \
        .order("started_at", desc=True) \
        .limit(5) \
        .execute()

    return {
        "xp": profile_data.get("total_xp", 0),
        "level": profile_data.get("level", 1),
        "rank_index": profile_data.get("rank_index", 0),
        "streak": profile_data.get("streak", 0),
        "workouts_completed": profile_data.get("workouts_completed", 0),
        "achievements": achievements.data or [],
        "recent_sessions": sessions.data or [],
        "total_sessions": sessions.count or 0,
    }
