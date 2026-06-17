from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from app.middleware.auth import get_current_user
from app.database import get_supabase

router = APIRouter()


@router.get("")
async def list_bounties(user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    result = supabase.table("bounties").select("*").execute()
    return result.data or []


@router.get("/my")
async def my_bounties(user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    result = supabase.table("user_bounties") \
        .select("*") \
        .eq("user_id", user["sub"]) \
        .execute()
    return result.data or []


@router.post("/{bounty_id}/claim")
async def claim_bounty(bounty_id: str, user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    existing = supabase.table("user_bounties") \
        .select("id") \
        .eq("user_id", user["sub"]) \
        .eq("bounty_id", bounty_id) \
        .limit(1) \
        .execute()
    if existing.data:
        return {"error": "Already claimed"}
    result = supabase.table("user_bounties").insert({
        "user_id": user["sub"],
        "bounty_id": bounty_id,
        "status": "claimed",
    }).execute()
    return result.data[0] if result.data else {"id": bounty_id}


@router.post("/{bounty_id}/complete")
async def complete_bounty(bounty_id: str, user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    now = datetime.now(timezone.utc).isoformat()
    result = supabase.table("user_bounties") \
        .update({"status": "completed", "completed_at": now}) \
        .eq("user_id", user["sub"]) \
        .eq("bounty_id", bounty_id) \
        .execute()
    if result.data:
        try:
            bounty = supabase.table("bounties").select("xp_reward").eq("id", bounty_id).single().execute()
        except Exception:
            bounty = type('obj', (object,), {'data': None})()
        if hasattr(bounty, 'data') and bounty.data:
            xp = bounty.data.get("xp_reward", 0)
            try:
                supabase.rpc("add_xp", {"p_user_id": user["sub"], "p_amount": xp}).execute()
            except Exception:
                pass
    return result.data[0] if result.data else {"status": "completed"}
