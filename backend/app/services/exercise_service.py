from app.database import get_supabase


def list_exercises(category: str | None = None, search: str | None = None) -> list[dict]:
    supabase = get_supabase()
    query = supabase.table("exercises").select("*").order("name")
    if category:
        query = query.eq("category", category)
    if search:
        query = query.ilike("name", f"%{search}%")
    result = query.execute()
    return result.data or []


def get_exercise(exercise_id: str) -> dict | None:
    supabase = get_supabase()
    result = supabase.table("exercises").select("*").eq("id", exercise_id).single().execute()
    return result.data


def list_templates(user_id: str | None = None) -> list[dict]:
    supabase = get_supabase()
    query = supabase.table("workout_templates").select("*").order("name")
    if user_id:
        query = query.or_(f"is_custom.eq.false,user_id.eq.{user_id}")
    else:
        query = query.eq("is_custom", False)
    result = query.execute()
    return result.data or []


def create_template(user_id: str, data: dict) -> dict:
    supabase = get_supabase()
    template = {
        "user_id": user_id,
        "name": data["name"],
        "kanji": data.get("kanji", ""),
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
