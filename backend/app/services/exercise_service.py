from app.database import get_supabase


def list_exercises(
    muscle_group: str | None = None,
    equipment: str | None = None,
    difficulty: str | None = None,
    category: str | None = None,
    search: str | None = None,
    limit: int = 100,
    offset: int = 0,
) -> list[dict]:
    supabase = get_supabase()
    query = supabase.table("exercises").select("*").order("name")
    if muscle_group:
        query = query.eq("muscle_group", muscle_group)
    if equipment:
        col = "equipment"
        query = query.eq(col, equipment)
    if difficulty:
        query = query.eq("difficulty", difficulty)
    if category:
        query = query.eq("category", category)
    if search:
        query = query.ilike("name", f"%{search}%")
    try:
        result = query.range(offset, offset + limit - 1).execute()
        return result.data or []
    except Exception:
        return []


def get_exercise(exercise_id: str) -> dict | None:
    supabase = get_supabase()
    try:
        result = supabase.table("exercises").select("*").eq("id", exercise_id).single().execute()
        return result.data
    except Exception:
        return None


def get_random_exercise(equipment: str | None = None) -> dict | None:
    supabase = get_supabase()
    query = supabase.table("exercises").select("*")
    if equipment:
        query = query.eq("equipment", equipment)
    try:
        result = query.limit(10).execute()
        items = result.data or []
        if not items:
            return None
        import random
        return random.choice(items)
    except Exception:
        return None


def list_templates(user_id: str | None = None) -> list[dict]:
    supabase = get_supabase()
    query = supabase.table("workout_templates").select("*").order("name")
    if user_id:
        query = query.or_(f"is_custom.eq.false,user_id.eq.{user_id}")
    else:
        query = query.eq("is_custom", False)
    try:
        result = query.execute()
        return result.data or []
    except Exception:
        return []


def create_template(user_id: str, data: dict) -> dict:
    supabase = get_supabase()
    template = {
        "user_id": user_id,
        "name": data["name"],
        "description": data.get("description", ""),
        "difficulty": data.get("difficulty", "intermediate"),
        "duration": data.get("duration", 30),
        "is_custom": True,
    }
    t_result = supabase.table("workout_templates").insert(template).execute()
    t_data = t_result.data[0]

    for i, ex in enumerate(data.get("exercises", [])):
        supabase.table("template_exercises").insert({
            "template_id": t_data["id"],
            "exercise_id": ex["exercise_id"],
            "sort_order": ex.get("sort_order", i),
            "sets": ex.get("sets", 3),
            "reps": ex.get("reps", 10),
            "weight_kg": ex.get("weight_kg", 0),
        }).execute()

    return t_data


def get_template(template_id: str) -> dict | None:
    supabase = get_supabase()
    t_result = supabase.table("workout_templates").select("*").eq("id", template_id).single().execute()
    if not t_result.data:
        return None
    ex_result = supabase.table("template_exercises").select("*").eq("template_id", template_id).order("sort_order").execute()
    return {**t_result.data, "exercises": ex_result.data or []}
