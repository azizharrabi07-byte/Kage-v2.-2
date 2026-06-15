import os
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.middleware.auth import get_current_user

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


class ChatResponse(BaseModel):
    reply: str


@router.post("/chat", response_model=ChatResponse)
async def chat(body: ChatRequest, user: dict = Depends(get_current_user)):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")

    try:
        import google.generativeai as genai

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(
            "gemini-2.0-flash",
            system_instruction=SYSTEM_PROMPT,
        )
        response = model.generate_content(body.message)
        return ChatResponse(reply=response.text)
    except ImportError:
        raise HTTPException(status_code=500, detail="google-generativeai not installed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sensei error: {e}")
