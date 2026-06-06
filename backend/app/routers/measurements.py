from fastapi import APIRouter, Query, Depends
from app.middleware.auth import get_current_user
from app.database import get_supabase

router = APIRouter()


@router.get("")
async def list_measurements(limit: int = Query(10), user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    result = supabase.table("body_measurements").select("*").eq("user_id", user["sub"]).order("measured_at", desc=True).limit(limit).execute()
    return result.data or []


@router.post("")
async def create_measurement(body: dict, user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    measurement = {
        "user_id": user["sub"],
        "weight_kg": body.get("weight_kg"),
        "body_fat": body.get("body_fat"),
        "chest_cm": body.get("chest_cm"),
        "waist_cm": body.get("waist_cm"),
        "arm_cm": body.get("arm_cm"),
        "thigh_cm": body.get("thigh_cm"),
        "notes": body.get("notes", ""),
    }
    result = supabase.table("body_measurements").insert(measurement).execute()
    return result.data[0] if result.data else measurement
