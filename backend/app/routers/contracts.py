from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends
from app.middleware.auth import get_current_user
from app.database import get_supabase
from app.config import settings

router = APIRouter()

MUSE_SYSTEM_PROMPT = (
    "You are The Muse, a wise samurai trainer who generates a single daily workout contract. "
    "Given the user's goal, energy level, weather, and history, output ONLY valid JSON with: "
    "exercise_name, weight_kg, reps, sets, narrative (a short samurai-themed reason for this choice). "
    "Keep it under 150 words total. No markdown, no explanation outside JSON."
)


@router.get("/today")
async def get_today_contract(user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    uid = user["sub"]
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    contracts = supabase.table("daily_contracts").select("*") \
        .eq("user_id", uid).gte("generated_at", today).limit(1).execute()
    if contracts.data:
        return contracts.data[0]
    return {"status": "no_contract", "message": "No contract for today. Generate one?"}


@router.post("/generate")
async def generate_contract(user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    uid = user["sub"]

    # Check if already generated today
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    existing = supabase.table("daily_contracts").select("id") \
        .eq("user_id", uid).gte("generated_at", today).limit(1).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Contract already exists for today")

    # Get user profile for context
    profile = {"main_goal": "", "energy_level": 5}
    try:
        p = supabase.table("profiles").select("main_goal,energy_level").eq("id", uid).single().execute()
        if p.data:
            profile = p.data
    except Exception:
        pass

    api_key = settings.gemini_api_key
    if api_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel("gemini-2.0-flash", system_instruction=MUSE_SYSTEM_PROMPT)
            prompt = (
                f"Generate a daily workout contract for a user with goal='{profile.get('main_goal','strength')}', "
                f"energy_level={profile.get('energy_level',5)}/10. "
                "Output JSON: {exercise_name, weight_kg, reps, sets, narrative}"
            )
            resp = model.generate_content(prompt)
            import json as j
            data = j.loads(resp.text.strip().removeprefix("```json").removesuffix("```").strip())
        except Exception:
            data = {"exercise_name": "Push-ups", "weight_kg": 0, "reps": 20, "sets": 3,
                    "narrative": "The bodyweight path calls you today. Master yourself before mastering iron."}
    else:
        data = {"exercise_name": "Push-ups", "weight_kg": 0, "reps": 20, "sets": 3,
                "narrative": "The bodyweight path calls you today. Master yourself before mastering iron."}

    contract = {
        "user_id": uid,
        "exercise_name": data.get("exercise_name", "Push-ups"),
        "weight_kg": data.get("weight_kg", 0),
        "reps": data.get("reps", 10),
        "sets": data.get("sets", 3),
        "xp_staked": 0,
        "xp_potential": data.get("sets", 3) * data.get("reps", 10) // 2,
        "narrative": data.get("narrative", ""),
        "status": "pending",
    }
    r = supabase.table("daily_contracts").insert(contract).execute()
    return r.data[0] if r.data else contract


@router.post("/{cid}/stake")
async def stake_xp(cid: str, body: dict, user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    amount = body.get("amount", 0)
    if amount < 0:
        raise HTTPException(status_code=400, detail="Cannot stake negative XP")
    r = supabase.table("daily_contracts").update({"xp_staked": amount, "status": "active"}) \
        .eq("id", cid).eq("user_id", user["sub"]).execute()
    if not r.data:
        raise HTTPException(status_code=404, detail="Contract not found")
    return r.data[0]


@router.post("/{cid}/complete")
async def complete_contract(cid: str, body: dict, user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    uid = user["sub"]
    contract = supabase.table("daily_contracts").select("*").eq("id", cid).eq("user_id", uid).single().execute()
    if not contract.data:
        raise HTTPException(status_code=404, detail="Contract not found")

    xp_earned = contract.data["xp_potential"]
    staked = contract.data.get("xp_staked", 0)
    if staked > 0:
        xp_earned += staked  # Win the stake

    supabase.table("daily_contracts").update({
        "status": "success", "completed_at": datetime.now(timezone.utc).isoformat(),
        "sensor_data": body.get("sensor_data", {}),
    }).eq("id", cid).execute()

    # Award XP
    try:
        supabase.rpc("add_xp", {"p_user_id": uid, "p_amount": xp_earned}).execute()
    except Exception:
        pass

    # Check achievements
    try:
        from app.services.achievement_service import check_achievements
        check_achievements(uid)
    except Exception:
        pass

    return {"status": "success", "xp_earned": xp_earned}


@router.post("/{cid}/fail")
async def fail_contract(cid: str, user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    uid = user["sub"]
    contract = supabase.table("daily_contracts").select("*").eq("id", cid).eq("user_id", uid).single().execute()
    if not contract.data:
        raise HTTPException(status_code=404, detail="Contract not found")

    xp_lost = contract.data.get("xp_staked", 0) * 2
    supabase.table("daily_contracts").update({
        "status": "fail", "completed_at": datetime.now(timezone.utc).isoformat(),
    }).eq("id", cid).execute()

    if xp_lost > 0:
        try:
            supabase.rpc("add_xp", {"p_user_id": uid, "p_amount": -xp_lost}).execute()
        except Exception:
            pass

    return {"status": "fail", "xp_lost": xp_lost}
