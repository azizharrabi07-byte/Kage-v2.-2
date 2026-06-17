from datetime import datetime, timezone
from app.database import get_supabase
from app.services.xp_service import calculate_workout_xp


def list_sessions(user_id: str, limit: int = 20, offset: int = 0) -> dict:
    supabase = get_supabase()
    try:
        count_result = supabase.table("workout_sessions").select("id", count="exact").eq("user_id", user_id).execute()
        total = count_result.count if hasattr(count_result, 'count') else 0
        result = supabase.table("workout_sessions").select("*").eq("user_id", user_id).order("created_at", desc=True).range(offset, offset + limit - 1).execute()
        items = result.data or []
        return {"items": items, "total": total, "limit": limit, "offset": offset}
    except Exception:
        return {"items": [], "total": 0, "limit": limit, "offset": offset}


def create_session(user_id: str, data: dict) -> dict:
    supabase = get_supabase()
    session = {
        "user_id": user_id,
        "notes": data.get("notes", ""),
        "date": data.get("date") or datetime.now(timezone.utc).strftime("%Y-%m-%d"),
    }
    s_result = supabase.table("workout_sessions").insert(session).execute()
    s_data = s_result.data[0]

    total_xp = 0
    raw_sets = []
    for i, ex in enumerate(data.get("exercises", [])):
        for s in ex.get("sets", []):
            set_row = {
                "session_id": s_data["id"],
                "exercise_id": ex["exercise_id"],
                "set_number": s.get("set_number", i + 1),
                "reps": s.get("reps", 10),
                "weight_kg": s.get("weight_kg", 0),
                "duration_seconds": s.get("duration_seconds", 0),
                "completed": s.get("completed", False),
            }
            supabase.table("workout_sets").insert(set_row).execute()
            raw_sets.append(set_row)

    total_xp = calculate_workout_xp(raw_sets)
    try:
        supabase.table("workout_sessions").update({"xp_earned": total_xp}).eq("id", s_data["id"]).execute()
    except Exception:
        pass
    s_data["xp_earned"] = total_xp

    try:
        supabase.rpc("increment_workout_count", {"p_user_id": user_id}).execute()
    except Exception:
        pass

    return s_data


def get_session(session_id: str) -> dict | None:
    supabase = get_supabase()
    try:
        s_result = supabase.table("workout_sessions").select("*").eq("id", session_id).single().execute()
        if not s_result.data:
            return None
        sets_result = supabase.table("workout_sets").select("*, exercises(name, muscle_group)").eq("session_id", session_id).order("set_number").execute()
        return {**s_result.data, "sets": sets_result.data or []}
    except Exception:
        return None
