from fastapi import APIRouter, Query, Depends
from app.middleware.auth import get_current_user
from app.database import get_supabase

router = APIRouter()


@router.get("")
async def list_logs(
    date: str | None = Query(None),
    limit: int = Query(50),
    user: dict = Depends(get_current_user),
):
    supabase = get_supabase()
    query = supabase.table("nutrition_logs").select("*").eq("user_id", user["sub"]).order("created_at", desc=True).limit(limit)
    if date:
        query = query.eq("date", date)
    result = query.execute()
    return result.data or []


@router.post("")
async def create_log(body: dict, user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    log = {
        "user_id": user["sub"],
        "date": body.get("date"),
        "meal_type": body.get("meal_type", "snack"),
        "food_name": body.get("food_name", ""),
        "calories": body.get("calories", 0),
        "protein_g": body.get("protein_g", 0),
        "carbs_g": body.get("carbs_g", 0),
        "fat_g": body.get("fat_g", 0),
        "portion_size": body.get("portion_size", ""),
        "notes": body.get("notes", ""),
    }
    result = supabase.table("nutrition_logs").insert(log).execute()
    return result.data[0] if result.data else log


@router.get("/summary")
async def get_daily_summary(
    date: str | None = Query(None),
    user: dict = Depends(get_current_user),
):
    supabase = get_supabase()
    from datetime import date as date_type
    log_date = date or str(date_type.today())
    logs = supabase.table("nutrition_logs") \
        .select("*") \
        .eq("user_id", user["sub"]) \
        .eq("date", log_date) \
        .execute()
    items = logs.data or []
    return {
        "date": log_date,
        "total_calories": sum(i.get("calories", 0) or 0 for i in items),
        "total_protein": sum(i.get("protein_g", 0) or 0 for i in items),
        "total_carbs": sum(i.get("carbs_g", 0) or 0 for i in items),
        "total_fat": sum(i.get("fat_g", 0) or 0 for i in items),
        "meals": items,
    }
