import random
from fastapi import APIRouter, Depends, HTTPException, Query
from app.database import get_supabase
from app.middleware.auth import get_current_user

router = APIRouter()


@router.get("")
async def list_programs(
    category: str | None = Query(None),
    difficulty: str | None = Query(None),
    goal: str | None = Query(None),
    equipment: str | None = Query(None),
    search: str | None = Query(None),
    user: dict = Depends(get_current_user),
):
    supabase = get_supabase()
    query = supabase.table("programs").select("*").order("name")
    if category:
        query = query.eq("category", category)
    if difficulty:
        query = query.eq("difficulty", difficulty)
    if goal:
        query = query.ilike("goal", f"%{goal}%")
    if equipment:
        query = query.eq("equipment", equipment)
    if search:
        query = query.ilike("name", f"%{search}%")
    result = query.execute()
    return result.data or []


@router.get("/random")
async def random_program(
    equipment: str | None = Query(None),
    goal: str | None = Query(None),
    user: dict = Depends(get_current_user),
):
    supabase = get_supabase()
    query = supabase.table("programs").select("*")
    if equipment:
        query = query.eq("equipment", equipment)
    if goal:
        query = query.ilike("goal", f"%{goal}%")
    result = query.execute()
    items = result.data or []
    if not items:
        raise HTTPException(status_code=404, detail="No programs match your criteria")
    return random.choice(items)


@router.get("/{program_id}")
async def get_program(program_id: str, user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    prog = supabase.table("programs").select("*").eq("id", program_id).single().execute()
    if not prog.data:
        raise HTTPException(status_code=404, detail="Program not found")
    return prog.data


@router.get("/{program_id}/exercises")
async def get_program_exercises(program_id: str, user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    ex = supabase.table("program_exercises").select("*").eq("program_id", program_id).order("sort_order").execute()
    return ex.data or []
