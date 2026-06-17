from fastapi import APIRouter, Depends
from app.database import get_supabase
from app.middleware.auth import get_current_user

router = APIRouter()


@router.get("/stats")
async def get_progress_stats(user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    user_id = user["sub"]

    profile_data = {}
    try:
        profile = supabase.table("progression") \
            .select("*") \
            .eq("user_id", user_id) \
            .single() \
            .execute()
        profile_data = profile.data or {}
    except Exception:
        pass

    achievements_data = []
    try:
        achievements = supabase.table("user_achievements") \
            .select("achievement_id") \
            .eq("user_id", user_id) \
            .execute()
        achievements_data = achievements.data or []
    except Exception:
        pass

    sessions_data = []
    total_count = 0
    try:
        sessions = supabase.table("workout_sessions") \
            .select("id, created_at, notes, xp_earned", count="exact") \
            .eq("user_id", user_id) \
            .order("created_at", desc=True) \
            .limit(5) \
            .execute()
        sessions_data = sessions.data or []
        total_count = sessions.count or 0
    except Exception:
        pass

    return {
        "xp": profile_data.get("total_xp", 0),
        "level": profile_data.get("level", 1),
        "rank_index": profile_data.get("rank_index", 0),
        "streak": profile_data.get("streak", 0),
        "workouts_completed": profile_data.get("workouts_completed", 0),
        "achievements": achievements_data,
        "recent_sessions": sessions_data,
        "total_sessions": total_count,
    }
