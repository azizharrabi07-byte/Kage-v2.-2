from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import get_supabase
from app.routers import auth, exercises, workouts, progression, prs, measurements, programs, progress, sensei, battles, nutrition, bounties


@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.supabase_url and settings.supabase_service_key:
        try:
            supabase = get_supabase()
            supabase.table("exercises").select("id", count="exact").limit(1).execute()
        except Exception as e:
            print(f"Supabase connection check: {e}")
    yield


app = FastAPI(
    title="KAGE API",
    description="KAGE fitness app backend",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(exercises.router, prefix="/api/exercises", tags=["exercises"])
app.include_router(workouts.router, prefix="/api/workout-templates", tags=["workout-templates"])
app.include_router(workouts.session_router, prefix="/api/workout-sessions", tags=["workout-sessions"])
app.include_router(progression.router, prefix="/api/progression", tags=["progression"])
app.include_router(prs.router, prefix="/api/personal-records", tags=["personal-records"])
app.include_router(measurements.router, prefix="/api/body-measurements", tags=["body-measurements"])
app.include_router(programs.router, prefix="/api/programs", tags=["programs"])
app.include_router(progress.router, prefix="/api/progress", tags=["progress"])
app.include_router(sensei.router, prefix="/api/sensei", tags=["sensei"])
app.include_router(battles.router, prefix="/api/battles", tags=["battles"])
app.include_router(nutrition.router, prefix="/api/nutrition-logs", tags=["nutrition"])
app.include_router(bounties.router, prefix="/api/bounties", tags=["bounties"])


@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}
