from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from datetime import datetime, timezone
from app.config import settings
from app.middleware.auth import get_current_user
from app.database import get_supabase

router = APIRouter()

SYSTEM_PROMPT = (
    "You are KAGE Sensei, an elite martial arts and fitness coach. "
    "You speak with the wisdom of a seasoned sensei. "
    "You give concise, motivational advice on training, technique, nutrition, and discipline. "
    "You use minimal Japanese honorifics (san, kun, sensei). "
    "Keep responses under 150 words. Be direct, encouraging, and occasionally stern."
)


class ChatRequest(BaseModel):
    message: str
    conversation_id: str | None = None


class ChatResponse(BaseModel):
    reply: str
    conversation_id: str


@router.post("/chat", response_model=ChatResponse)
async def chat(body: ChatRequest, user: dict = Depends(get_current_user)):
    api_key = settings.gemini_api_key
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")

    conv_id = body.conversation_id or datetime.now(timezone.utc).strftime("conv_%Y%m%d_%H%M%S")

    # Save user message
    try:
        supabase = get_supabase()
        supabase.table("sensei_chat_history").insert({
            "user_id": user["sub"],
            "role": "user",
            "content": body.message,
            "conversation_id": conv_id,
        }).execute()
    except Exception:
        pass

    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(
            "gemini-2.0-flash",
            system_instruction=SYSTEM_PROMPT,
        )
        response = model.generate_content(body.message)
        reply = response.text
    except ImportError:
        raise HTTPException(status_code=500, detail="google-generativeai not installed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sensei error: {e}")

    # Save sensei reply
    try:
        supabase.table("sensei_chat_history").insert({
            "user_id": user["sub"],
            "role": "sensei",
            "content": reply,
            "conversation_id": conv_id,
        }).execute()
    except Exception:
        pass

    return ChatResponse(reply=reply, conversation_id=conv_id)


@router.get("/history")
async def get_chat_history(
    conversation_id: str | None = Query(None),
    limit: int = Query(50),
    user: dict = Depends(get_current_user),
):
    supabase = get_supabase()
    query = supabase.table("sensei_chat_history") \
        .select("*") \
        .eq("user_id", user["sub"]) \
        .order("created_at", desc=True) \
        .limit(limit)
    if conversation_id:
        query = query.eq("conversation_id", conversation_id)
    result = query.execute()
    return result.data or []


@router.get("/conversations")
async def list_conversations(user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    result = supabase.table("sensei_chat_history") \
        .select("conversation_id, created_at") \
        .eq("user_id", user["sub"]) \
        .order("created_at", desc=True) \
        .execute()
    seen = set()
    convs = []
    for row in (result.data or []):
        if row["conversation_id"] not in seen:
            seen.add(row["conversation_id"])
            convs.append(row)
    return convs
