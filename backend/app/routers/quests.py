from datetime import date as date_type
from fastapi import APIRouter, Depends
from app.middleware.auth import get_current_user
from app.database import get_supabase

router = APIRouter()


@router.get("")
async def get_today_quest(user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    uid = user["sub"]
    today = str(date_type.today())
    r = supabase.table("nutrition_quests").select("*") \
        .eq("user_id", uid).eq("day", today).limit(1).execute()
    if r.data:
        return r.data[0]
    # Auto-generate today's quest
    quest = supabase.table("nutrition_quests").insert({
        "user_id": uid, "day": today,
        "task": "Eat 1g protein per lb of bodyweight. Hydrate. One vegetable serving."
    }).execute()
    return quest.data[0] if quest.data else {"task": "Eat well, warrior."}


@router.post("/toggle")
async def toggle_quest(user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    uid = user["sub"]
    today = str(date_type.today())
    existing = supabase.table("nutrition_quests").select("id,completed") \
        .eq("user_id", uid).eq("day", today).limit(1).execute()
    if existing.data:
        new_status = not existing.data[0].get("completed", False)
        supabase.table("nutrition_quests").update({"completed": new_status}) \
            .eq("id", existing.data[0]["id"]).execute()
        return {"completed": new_status}
    else:
        quest = supabase.table("nutrition_quests").insert({
            "user_id": uid, "day": today, "completed": True,
            "task": "Eat 1g protein per lb of bodyweight. Hydrate. One vegetable serving."
        }).execute()
        return {"completed": True}


@router.post("/set")
async def set_quest(body: dict, user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    task = body.get("task", "Eat well, warrior.")
    uid = user["sub"]
    today = str(date_type.today())
    existing = supabase.table("nutrition_quests").select("id") \
        .eq("user_id", uid).eq("day", today).limit(1).execute()
    if existing.data:
        supabase.table("nutrition_quests").update({"task": task}).eq("id", existing.data[0]["id"]).execute()
    else:
        supabase.table("nutrition_quests").insert({"user_id": uid, "day": today, "task": task}).execute()
    return {"task": task}
