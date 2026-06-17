from fastapi import APIRouter, HTTPException, Query, Depends
from app.middleware.auth import get_current_user
from app.database import get_supabase

router = APIRouter()


@router.get("")
async def list_diet_programs(
    category: str | None = Query(None),
    search: str | None = Query(None),
    user: dict = Depends(get_current_user),
):
    supabase = get_supabase()
    query = supabase.table("diet_programs").select("*").order("name")
    if category:
        query = query.eq("category", category)
    if search:
        query = query.ilike("name", f"%{search}%")
    result = query.execute()
    return result.data or []


@router.get("/{program_id}")
async def get_diet_program(program_id: str, user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    prog = supabase.table("diet_programs").select("*").eq("id", program_id).single().execute()
    if not prog.data:
        raise HTTPException(status_code=404, detail="Diet program not found")
    return prog.data
