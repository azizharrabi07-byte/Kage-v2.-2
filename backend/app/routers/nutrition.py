from datetime import date as date_type
from fastapi import APIRouter, Query, Depends
from app.middleware.auth import get_current_user
from app.database import get_supabase

router = APIRouter()


@router.get("")
async def list_logs(
    date: str | None = Query(None, alias="log_date"),
    limit: int = Query(50),
    user: dict = Depends(get_current_user),
):
    supabase = get_supabase()
    query = supabase.table("nutrition_logs").select("*").eq("user_id", user["sub"]).order("created_at", desc=True).limit(limit)
    if date:
        query = query.eq("log_date", date)
    try:
        result = query.execute()
        return result.data or []
    except Exception:
        return []


@router.post("")
async def create_log(body: dict, user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    log = {
        "user_id": user["sub"],
        "log_date": body.get("date") or body.get("log_date") or str(date_type.today()),
        "meal_type": body.get("meal_type", "snack"),
        "food_name": body.get("food_name", ""),
        "calories": body.get("calories", 0),
        "protein_g": body.get("protein_g", 0),
        "carbs_g": body.get("carbs_g", 0),
        "fats_g": body.get("fat_g") or body.get("fats_g", 0),
    }
    try:
        result = supabase.table("nutrition_logs").insert(log).execute()
        return result.data[0] if result.data else log
    except Exception as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/summary")
async def get_daily_summary(
    date: str | None = Query(None),
    user: dict = Depends(get_current_user),
):
    supabase = get_supabase()
    log_date = date or str(date_type.today())
    try:
        logs = supabase.table("nutrition_logs") \
            .select("*") \
            .eq("user_id", user["sub"]) \
            .eq("log_date", log_date) \
            .execute()
        items = logs.data or []
    except Exception:
        items = []
    return {
        "date": log_date,
        "total_calories": sum(i.get("calories", 0) or 0 for i in items),
        "total_protein": sum(i.get("protein_g", 0) or 0 for i in items),
        "total_carbs": sum(i.get("carbs_g", 0) or 0 for i in items),
        "total_fat": sum(i.get("fats_g", 0) or 0 for i in items),
        "meals": items,
    }
