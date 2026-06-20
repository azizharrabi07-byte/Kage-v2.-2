from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends
from app.middleware.auth import get_current_user
from app.database import get_supabase
from app.config import settings

router = APIRouter()

SCROLL_SYSTEM_PROMPT = (
    "You are the scribe of the Kage dojo. Write a weekly samurai-themed narrative scroll "
    "for a warrior based on their week's data. Output JSON with 3 scenes: "
    "setup (the challenge), struggle (the battle), resolution (what they learned). "
    "Each scene must have: title (string), text (string, 80-100 words). "
    "Use samurai metaphors. Keep total under 300 words. "
    "No markdown, only JSON."
)


@router.get("/scrolls")
async def list_scrolls(user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    r = supabase.table("legacy_scrolls").select("*").eq("user_id", user["sub"]) \
        .order("week_number", desc=True).execute()
    return r.data or []


@router.post("/scrolls/generate")
async def generate_scroll(user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    uid = user["sub"]

    # Check if scroll already exists for this week
    week = datetime.now(timezone.utc).isocalendar()[1]
    existing = supabase.table("legacy_scrolls").select("id") \
        .eq("user_id", uid).eq("week_number", week).limit(1).execute()
    if existing.data:
        return existing.data[0]

    # Gather week data for context
    contracts = supabase.table("daily_contracts").select("*") \
        .eq("user_id", uid).order("generated_at", desc=True).limit(7).execute()
    ghosts = supabase.table("ghost_sessions").select("*") \
        .eq("user_id", uid).limit(5).execute()
    quests = supabase.table("nutrition_quests").select("*") \
        .eq("user_id", uid).order("day", desc=True).limit(7).execute()

    ctx = {
        "contracts": len(contracts.data or []),
        "completed": sum(1 for c in (contracts.data or []) if c.get("status") == "success"),
        "failed": sum(1 for c in (contracts.data or []) if c.get("status") == "fail"),
        "ghost_wins": sum((g.get("wins", 0) for g in (ghosts.data or [])), 0),
        "ghost_losses": sum((g.get("losses", 0) for g in (ghosts.data or [])), 0),
        "quests_done": sum(1 for q in (quests.data or []) if q.get("completed")),
    }

    api_key = settings.gemini_api_key
    content = {}
    if api_key:
        try:
            import google.generativeai as genai
            import json as j
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel("gemini-2.0-flash", system_instruction=SCROLL_SYSTEM_PROMPT)
            prompt = (
                f"A warrior's weekly data: {ctx['contracts']} contracts ({ctx['completed']} completed, {ctx['failed']} failed), "
                f"{ctx['ghost_wins']} ghost victories, {ctx['ghost_losses']} ghost defeats, "
                f"{ctx['quests_done']} nutrition quests completed. Generate their legacy scroll."
            )
            resp = model.generate_content(prompt)
            content = j.loads(resp.text.strip().removeprefix("```json").removesuffix("```").strip())
        except Exception:
            content = {"scenes": [
                {"title": "The Path Unfolds", "text": "The warrior faced the week with courage, taking on contracts that tested both body and spirit."},
                {"title": "The Struggle Within", "text": "Some battles were won, some were lost. Each failure forged a sharper blade for the next fight."},
                {"title": "The Lesson", "text": "By week's end, the warrior grew stronger — not just in muscle, but in wisdom."},
            ]}
    else:
        content = {"scenes": [
            {"title": "The Path Unfolds", "text": "The warrior faced the week with courage, taking on contracts that tested both body and spirit."},
            {"title": "The Struggle Within", "text": "Some battles were won, some were lost. Each failure forged a sharper blade for the next fight."},
            {"title": "The Lesson", "text": "By week's end, the warrior grew stronger — not just in muscle, but in wisdom."},
        ]}

    scroll = {"user_id": uid, "week_number": week, "content": content}
    r = supabase.table("legacy_scrolls").insert(scroll).execute()
    return r.data[0] if r.data else scroll


@router.post("/scrolls/{sid}/share")
async def share_scroll(sid: str, user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    supabase.table("legacy_scrolls").update({"shared": True}).eq("id", sid).eq("user_id", user["sub"]).execute()
    return {"status": "shared"}


@router.get("/oracle")
async def get_oracle_prophecy(user: dict = Depends(get_current_user)):
    """Simple injury risk prediction based on recent workload."""
    supabase = get_supabase()
    uid = user["sub"]

    contracts = supabase.table("daily_contracts").select("*") \
        .eq("user_id", uid).order("generated_at", desc=True).limit(30).execute()
    items = contracts.data or []
    recent = items[:7]
    older = items[7:14]

    recent_load = sum(c.get("weight_kg", 0) * c.get("reps", 0) * c.get("sets", 0) for c in recent if c.get("status") == "success")
    older_load = sum(c.get("weight_kg", 0) * c.get("reps", 0) * c.get("sets", 0) for c in older if c.get("status") == "success")

    if older_load > 0 and recent_load > older_load * 1.5:
        risk = min(90, int((recent_load / older_load - 1) * 50))
        return {
            "risk_level": risk,
            "warning": f"Your training load has increased {int((recent_load/older_load - 1)*100)}% without recovery. "
                       f"Consider a lighter day to avoid injury.",
            "safe": False,
        }

    return {"risk_level": 0, "warning": "Your training is balanced. The path is safe.", "safe": True}
