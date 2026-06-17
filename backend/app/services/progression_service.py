from datetime import datetime, timezone
from app.database import get_supabase


def get_progression(user_id: str) -> dict | None:
    supabase = get_supabase()
    try:
        result = supabase.table("progression").select("*").eq("user_id", user_id).single().execute()
        return result.data
    except Exception:
        return None


def calc_level(total_xp: int) -> int:
    """Level = floor(total_xp / 500) + 1. Each level costs 500 XP."""
    return max(1, (total_xp // 500) + 1)


def add_xp(user_id: str, category: str, amount: int, source: str = "workout") -> dict:
    supabase = get_supabase()

    try:
        supabase.table("xp_breakdown").insert({
            "user_id": user_id,
            "category": category,
            "amount": amount,
            "source": source,
        }).execute()
    except Exception:
        pass

    current = get_progression(user_id)
    if not current:
        return {"error": "User progression not found"}

    new_total = (current.get("total_xp") or 0) + amount
    old_level = current.get("level") or 1
    new_level = calc_level(new_total)

    update_data = {"total_xp": new_total, "level": new_level}
    try:
        supabase.table("progression").update(update_data).eq("user_id", user_id).execute()
    except Exception:
        pass

    return {
        "total_xp": new_total,
        "level": new_level,
        "xp_gained": amount,
        "leveled_up": new_level > old_level,
    }


def update_streak(user_id: str) -> dict:
    supabase = get_supabase()
    current = get_progression(user_id)
    if not current:
        return {"error": "User progression not found"}

    now = datetime.now(timezone.utc)
    last = current.get("last_workout_date")
    streak = current.get("streak") or 0

    if last:
        try:
            last_dt = datetime.fromisoformat(last.replace("Z", "+00:00"))
            diff = (now - last_dt).days
            if diff == 1:
                streak += 1
            elif diff > 1:
                streak = 1
        except Exception:
            streak = 1
    else:
        streak = 1

    try:
        supabase.table("progression").update({
            "streak": streak,
            "last_workout_date": now.isoformat(),
        }).eq("user_id", user_id).execute()
    except Exception:
        pass

    return {"streak": streak}
