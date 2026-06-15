def calculate_workout_xp(sets: list[dict]) -> int:
    """Calculate XP for a completed workout session."""
    xp = 0
    for s in sets:
        base = 10
        weight_bonus = 0
        rep_bonus = 0
        weight = s.get("weight_kg", 0) or 0
        reps = s.get("reps", 0) or 0
        if weight >= 100:
            weight_bonus = 5
        elif weight >= 50:
            weight_bonus = 3
        elif weight >= 20:
            weight_bonus = 1
        if reps >= 20:
            rep_bonus = 5
        elif reps >= 12:
            rep_bonus = 3
        elif reps >= 8:
            rep_bonus = 1
        xp += base + weight_bonus + rep_bonus
    return xp
