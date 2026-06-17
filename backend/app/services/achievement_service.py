from app.database import get_supabase

ACHIEVEMENT_DEFS: dict[str, tuple[str, str]] = {
    "first_workout": ("First Sweat", "Complete your first workout"),
    "five_workouts": ("Getting Started", "Complete 5 workouts"),
    "ten_workouts": ("Dedicated", "Complete 10 workouts"),
    "twenty_five_workouts": ("Warrior Path", "Complete 25 workouts"),
    "fifty_workouts": ("Half Century", "Complete 50 workouts"),
    "hundred_workouts": ("Century Club", "Complete 100 workouts"),
    "first_streak_3": ("Streak Starter", "Reach a 3-day streak"),
    "first_streak_7": ("Weekly Warrior", "Reach a 7-day streak"),
    "first_streak_30": ("Monthly Master", "Reach a 30-day streak"),
    "first_pr": ("Personal Record", "Set your first personal record"),
}


def check_achievements(user_id: str) -> list[dict]:
    supabase = get_supabase()
    awarded: list[dict] = []

    try:
        profile = supabase.table("progression").select("*").eq("user_id", user_id).single().execute()
        if not profile.data:
            return awarded
    except Exception:
        return awarded

    p = profile.data
    total_workouts = p.get("workouts_completed", 0) or 0
    streak = p.get("streak", 0) or 0

    try:
        existing = supabase.table("user_achievements") \
            .select("achievement_id") \
            .eq("user_id", user_id) \
            .execute()
        existing_ids = {row["achievement_id"] for row in (existing.data or [])}
    except Exception:
        existing_ids = set()

    thresholds: list[tuple[str, int | None, int | None]] = [
        ("first_workout", 1, None),
        ("five_workouts", 5, None),
        ("ten_workouts", 10, None),
        ("twenty_five_workouts", 25, None),
        ("fifty_workouts", 50, None),
        ("hundred_workouts", 100, None),
        ("first_streak_3", None, 3),
        ("first_streak_7", None, 7),
        ("first_streak_30", None, 30),
    ]

    for ach_id, w_threshold, s_threshold in thresholds:
        if ach_id in existing_ids:
            continue
        if w_threshold is not None and total_workouts >= w_threshold:
            try:
                supabase.table("user_achievements").insert({
                    "user_id": user_id,
                    "achievement_id": ach_id,
                }).execute()
            except Exception:
                pass
            name, desc = ACHIEVEMENT_DEFS[ach_id]
            awarded.append({"id": ach_id, "name": name, "description": desc})
            existing_ids.add(ach_id)
        elif s_threshold is not None and streak >= s_threshold:
            try:
                supabase.table("user_achievements").insert({
                    "user_id": user_id,
                    "achievement_id": ach_id,
                }).execute()
            except Exception:
                pass
            name, desc = ACHIEVEMENT_DEFS[ach_id]
            awarded.append({"id": ach_id, "name": name, "description": desc})
            existing_ids.add(ach_id)

    return awarded
