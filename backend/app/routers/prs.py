from fastapi import APIRouter, HTTPException, Query, Depends
from app.middleware.auth import get_current_user
from app.database import get_supabase

router = APIRouter()


@router.get("")
async def list_prs(exercise_id: str | None = Query(None), user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    query = supabase.table("personal_records").select("*").eq("user_id", user["sub"]).order("achieved_at", desc=True)
    if exercise_id:
        query = query.eq("exercise_id", exercise_id)
    result = query.execute()
    return result.data or []


@router.post("")
async def create_pr(body: dict, user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    ex_id = body.get("exercise_id", "")
    ex_name = ""
    if ex_id:
        try:
            ex = supabase.table("exercises").select("name").eq("id", ex_id).single().execute()
            ex_name = ex.data.get("name", "") if ex.data else ""
        except Exception:
            pass
    pr = {
        "user_id": user["sub"],
        "exercise_id": ex_id,
        "exercise_name": ex_name or body.get("exercise_name", "Unknown"),
        "weight_kg": body.get("weight_kg", 0),
        "reps": body.get("reps", 1),
    }
    result = supabase.table("personal_records").insert(pr).execute()
    return result.data[0] if result.data else pr
