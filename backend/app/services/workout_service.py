from datetime import datetime, timezone
from app.database import get_supabase


def list_sessions(user_id: str, limit: int = 20, offset: int = 0) -> dict:
    supabase = get_supabase()
    count_result = supabase.table("workout_sessions").select("id", count="exact").eq("user_id", user_id).execute()
    total = count_result.count if hasattr(count_result, 'count') else 0

    result = supabase.table("workout_sessions").select("*").eq("user_id", user_id).order("started_at", desc=True).range(offset, offset + limit - 1).execute()
    items = result.data or []
    return {"items": items, "total": total, "limit": limit, "offset": offset}


def create_session(user_id: str, data: dict) -> dict:
    supabase = get_supabase()

    if data.get("started_at") and isinstance(data["started_at"], str):
        started_at = data["started_at"]
    else:
        started_at = datetime.now(timezone.utc).isoformat()

    if data.get("completed_at") and isinstance(data["completed_at"], str):
        completed_at = data["completed_at"]
    else:
        completed_at = datetime.now(timezone.utc).isoformat() if data.get("completed_at") else None

    session = {
        "user_id": user_id,
        "template_id": data.get("template_id"),
        "name": data["name"],
        "kanji": data.get("kanji", ""),
        "started_at": started_at,
        "completed_at": completed_at,
        "notes": data.get("notes", ""),
        "mood": data.get("mood", 3),
        "duration_seconds": data.get("duration_seconds", 0),
    }
    s_result = supabase.table("workout_sessions").insert(session).execute()
    s_data = s_result.data[0]

    total_xp = 0
    for i, ex in enumerate(data.get("exercises", [])):
        se_result = supabase.table("session_exercises").insert({
            "session_id": s_data["id"],
            "exercise_id": ex["exercise_id"],
            "sort_order": ex.get("sort_order", i),
            "completed": ex.get("completed", False),
        }).execute()
        se_data = se_result.data[0]

        for s in ex.get("sets", []):
            supabase.table("workout_sets").insert({
                "session_exercise_id": se_data["id"],
                "set_number": s.get("set_number", 1),
                "reps": s.get("reps", 10),
                "weight_kg": s.get("weight_kg", 0),
                "completed": s.get("completed", False),
                "completed_at": s.get("completed_at"),
            }).execute()
            if s.get("completed", False):
                total_xp += 10

    supabase.table("workout_sessions").update({"total_xp": total_xp}).eq("id", s_data["id"]).execute()
    s_data["total_xp"] = total_xp

    try:
        supabase.rpc("increment_workout_count", {"user_id": user_id}).execute()
    except Exception:
        pass

    return s_data


def get_session(session_id: str) -> dict | None:
    supabase = get_supabase()
    s_result = supabase.table("workout_sessions").select("*").eq("id", session_id).single().execute()
    if not s_result.data:
        return None

    ex_result = supabase.table("session_exercises").select("*").eq("session_id", session_id).order("sort_order").execute()
    exercises = ex_result.data or []
    for ex in exercises:
        sets_result = supabase.table("workout_sets").select("*").eq("session_exercise_id", ex["id"]).order("set_number").execute()
        ex["sets"] = sets_result.data or []

    return {**s_result.data, "exercises": exercises}
