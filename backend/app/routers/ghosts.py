from fastapi import APIRouter, HTTPException, Depends
from app.middleware.auth import get_current_user
from app.database import get_supabase

router = APIRouter()


@router.get("")
async def list_ghosts(user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    r = supabase.table("ghost_sessions").select("*").limit(20).execute()
    return r.data or []


@router.get("/my")
async def my_ghosts(user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    r = supabase.table("ghost_sessions").select("*").eq("user_id", user["sub"]).order("created_at", desc=True).execute()
    return r.data or []


@router.get("/status")
async def ghost_status(user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    uid = user["sub"]
    mine = supabase.table("ghost_sessions").select("wins,losses").eq("user_id", uid).execute()
    total_wins = sum((g.get("wins", 0) for g in (mine.data or [])), 0)
    total_losses = sum((g.get("losses", 0) for g in (mine.data or [])), 0)
    return {"wins": total_wins, "losses": total_losses, "total": len(mine.data or [])}


@router.get("/leaderboard")
async def ghost_leaderboard(user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    r = supabase.table("ghost_sessions").select("*").order("wins", desc=True).limit(20).execute()
    return r.data or []


@router.post("/upload")
async def upload_ghost(body: dict, user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    ghost = {"user_id": user["sub"], "exercise_data": body.get("exercise_data", {}), "xp_earned": body.get("xp_earned", 0)}
    r = supabase.table("ghost_sessions").insert(ghost).execute()
    return r.data[0] if r.data else ghost


@router.post("/{gid}/fight")
async def fight_ghost(gid: str, body: dict, user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    uid = user["sub"]
    try:
        ghost = supabase.table("ghost_sessions").select("*").eq("id", gid).single().execute()
    except Exception:
        raise HTTPException(status_code=404, detail="Ghost not found")
    if not ghost.data:
        raise HTTPException(status_code=404, detail="Ghost not found")
    if ghost.data["user_id"] == uid:
        return {"status": "error", "message": "Cannot fight your own ghost"}

    my_xp = body.get("xp_earned", 0)
    ghost_xp = ghost.data.get("xp_earned", 0)
    wager = max(50, int(ghost_xp * 0.05))

    if my_xp > ghost_xp:
        defeated = ghost.data.get("defeated_by", []) or []
        if uid not in defeated:
            defeated.append(uid)
        supabase.table("ghost_sessions").update({"defeated_by": defeated, "losses": (ghost.data.get("losses", 0) or 0) + 1}).eq("id", gid).execute()
        try:
            supabase.rpc("add_xp", {"p_user_id": uid, "p_amount": wager}).execute()
        except Exception:
            pass
        return {"status": "victory", "xp_won": wager}
    else:
        supabase.table("ghost_sessions").update({"wins": (ghost.data.get("wins", 0) or 0) + 1}).eq("id", gid).execute()
        try:
            supabase.rpc("add_xp", {"p_user_id": uid, "p_amount": -wager}).execute()
        except Exception:
            pass
        return {"status": "defeat", "xp_lost": wager}
