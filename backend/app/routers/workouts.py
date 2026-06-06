from fastapi import APIRouter, HTTPException, Query, Depends
from app.middleware.auth import get_current_user
from app.services import exercise_service, workout_service

router = APIRouter()
session_router = APIRouter()


@router.get("")
async def list_templates(user: dict = Depends(get_current_user)):
    return exercise_service.list_templates(user["sub"])


@router.post("")
async def create_template(body: dict, user: dict = Depends(get_current_user)):
    try:
        return exercise_service.create_template(user["sub"], body)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{template_id}")
async def get_template(template_id: str, user: dict = Depends(get_current_user)):
    tmpl = exercise_service.get_template(template_id)
    if not tmpl:
        raise HTTPException(status_code=404, detail="Template not found")
    return tmpl


@session_router.get("")
async def list_sessions(
    limit: int = Query(20), offset: int = Query(0),
    user: dict = Depends(get_current_user),
):
    return workout_service.list_sessions(user["sub"], limit, offset)


@session_router.post("")
async def create_session(body: dict, user: dict = Depends(get_current_user)):
    try:
        return workout_service.create_session(user["sub"], body)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@session_router.get("/{session_id}")
async def get_session(session_id: str, user: dict = Depends(get_current_user)):
    sess = workout_service.get_session(session_id)
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found")
    return sess
