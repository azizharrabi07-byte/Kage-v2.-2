import random
from fastapi import APIRouter, Depends, HTTPException, Query
from app.database import get_supabase
from app.middleware.auth import get_current_user

router = APIRouter()


def _run_query(query):
    try:
        result = query.execute()
        return result.data or []
    except Exception:
        return []


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
        try: query = query.eq("category", category)
        except: pass
    if difficulty:
        query = query.eq("difficulty", difficulty)
    if goal:
        query = query.ilike("goal", f"%{goal}%")
    if equipment:
        query = query.eq("equipment", equipment)
    if search:
        query = query.ilike("name", f"%{search}%")
    return _run_query(query)


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
    items = _run_query(query)
    if not items:
        raise HTTPException(status_code=404, detail="No programs match your criteria")
    return random.choice(items)


@router.get("/{program_id}")
async def get_program(program_id: str, user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    try:
        prog = supabase.table("programs").select("*").eq("id", program_id).single().execute()
        if not prog.data:
            raise HTTPException(status_code=404, detail="Program not found")
        return prog.data
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=404, detail="Program not found")


@router.get("/{program_id}/exercises")
async def get_program_exercises(program_id: str, user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    return _run_query(
        supabase.table("program_exercises").select("*").eq("program_id", program_id).order("sort_order")
    )
