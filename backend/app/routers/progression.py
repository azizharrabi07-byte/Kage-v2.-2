from fastapi import APIRouter, HTTPException, Depends
from app.middleware.auth import get_current_user
from app.services import progression_service

router = APIRouter()


@router.get("")
async def get_progression(user: dict = Depends(get_current_user)):
    prog = progression_service.get_progression(user["sub"])
    if not prog:
        raise HTTPException(status_code=404, detail="Progression not found")
    return prog


@router.post("/xp")
async def add_xp(body: dict, user: dict = Depends(get_current_user)):
    result = progression_service.add_xp(
        user["sub"],
        body.get("category", "general"),
        body.get("amount", 0),
        body.get("source", "workout"),
    )
    return result
