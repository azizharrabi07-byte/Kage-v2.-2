from app.database import get_supabase


def get_progression(user_id: str) -> dict | None:
    supabase = get_supabase()
    try:
        result = supabase.table("progression").select("*").eq("user_id", user_id).single().execute()
        return result.data
    except Exception:
        return None


def add_xp(user_id: str, category: str, amount: int, source: str = "workout") -> dict:
    supabase = get_supabase()

    supabase.table("xp_breakdown").insert({
        "user_id": user_id,
        "category": category,
        "amount": amount,
        "source": source,
    }).execute()

    current = get_progression(user_id)
    if not current:
        return {"error": "User progression not found"}

    new_total = (current.get("total_xp") or 0) + amount
    new_level = (new_total // 1000) + 1

    update_data = {"total_xp": new_total, "level": new_level}
    supabase.table("progression").update(update_data).eq("user_id", user_id).execute()

    return {**update_data, "xp_gained": amount, "leveled_up": new_level > (current.get("level") or 1)}


def update_streak(user_id: str) -> dict:
    supabase = get_supabase()
    current = get_progression(user_id)
    if not current:
        return {"error": "User progression not found"}

    from datetime import datetime, timezone
    now = datetime.now(timezone.utc)
    last = current.get("last_workout_date")
    streak = current.get("streak") or 0

    if last:
        from datetime import timedelta
        last_dt = datetime.fromisoformat(last.replace("Z", "+00:00"))
        diff = (now - last_dt).days
        if diff == 1:
            streak += 1
        elif diff > 1:
            streak = 1
    else:
        streak = 1

    supabase.table("progression").update({
        "streak": streak,
        "last_workout_date": now.isoformat(),
    }).eq("user_id", user_id).execute()

    return {"streak": streak}
