from fastapi import APIRouter, HTTPException, Query, Depends
from app.middleware.auth import get_current_user
from app.services import exercise_service

router = APIRouter()


@router.get("")
async def list_exercises(
    muscle_group: str | None = Query(None, alias="muscle_group"),
    search: str | None = Query(None),
    user: dict = Depends(get_current_user),
):
    return exercise_service.list_exercises(muscle_group, search)


@router.get("/{exercise_id}")
async def get_exercise(exercise_id: str, user: dict = Depends(get_current_user)):
    ex = exercise_service.get_exercise(exercise_id)
    if not ex:
        raise HTTPException(status_code=404, detail="Exercise not found")
    return ex
