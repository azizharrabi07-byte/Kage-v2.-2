from fastapi import APIRouter, Depends, HTTPException
from app.database import get_supabase
from app.middleware.auth import get_current_user

router = APIRouter()


@router.get("")
async def list_programs(user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    programs = supabase.table("programs") \
        .select("*, program_exercises(*)") \
        .execute()
    return programs.data or []


@router.get("/{program_id}")
async def get_program(program_id: str, user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    prog = supabase.table("programs") \
        .select("*, program_exercises(*)") \
        .eq("id", program_id) \
        .single() \
        .execute()
    if not prog.data:
        raise HTTPException(status_code=404, detail="Program not found")
    return prog.data
