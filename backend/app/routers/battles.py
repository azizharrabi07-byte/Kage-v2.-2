from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.database import get_supabase
from app.middleware.auth import get_current_user

router = APIRouter()


class CreateBattleRequest(BaseModel):
    opponent_id: str


class AcceptBattleRequest(BaseModel):
    pass


class CompleteBattleRequest(BaseModel):
    winner_id: str


@router.get("")
async def list_battles(user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    try:
        battles = supabase.table("battles") \
            .select("*") \
            .or_(f"challenger_id.eq.{user['sub']},opponent_id.eq.{user['sub']}") \
            .order("created_at", desc=True) \
            .execute()
        return battles.data or []
    except Exception:
        return []


@router.post("/create")
async def create_battle(body: CreateBattleRequest, user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    challenger_id = user["sub"]

    if challenger_id == body.opponent_id:
        raise HTTPException(status_code=400, detail="Cannot battle yourself")
    try:
        battle = supabase.table("battles").insert({
            "challenger_id": challenger_id,
            "opponent_id": body.opponent_id,
            "status": "pending",
        }).execute()
        return battle.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{battle_id}/accept")
async def accept_battle(battle_id: str, body: AcceptBattleRequest, user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    user_id = user["sub"]
    try:
        battle = supabase.table("battles").select("*").eq("id", battle_id).single().execute()
        if not battle.data:
            raise HTTPException(status_code=404, detail="Battle not found")
        if battle.data["opponent_id"] != user_id:
            raise HTTPException(status_code=403, detail="Only the challenged opponent can accept")
        if battle.data["status"] != "pending":
            raise HTTPException(status_code=400, detail="Battle is not pending")
        updated = supabase.table("battles").update({"status": "active"}).eq("id", battle_id).execute()
        return updated.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{battle_id}/complete")
async def complete_battle(battle_id: str, body: CompleteBattleRequest, user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    user_id = user["sub"]
    try:
        battle = supabase.table("battles").select("*").eq("id", battle_id).single().execute()
        if not battle.data:
            raise HTTPException(status_code=404, detail="Battle not found")
        if battle.data["challenger_id"] != user_id and battle.data["opponent_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not a participant")
        if battle.data["status"] != "active":
            raise HTTPException(status_code=400, detail="Battle is not active")
        winner_id = body.winner_id
        if winner_id != battle.data["challenger_id"] and winner_id != battle.data["opponent_id"]:
            raise HTTPException(status_code=400, detail="Winner must be a participant")
        updated = supabase.table("battles").update({
            "status": "completed",
            "winner_id": winner_id,
        }).eq("id", battle_id).execute()
        return updated.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
