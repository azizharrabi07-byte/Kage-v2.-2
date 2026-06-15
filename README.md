# KAGE Premium V2

Martial arts fitness gamification app — train, compete, and level up.

## Architecture

```
┌──────────┐     ┌──────────┐     ┌──────────────────┐
│  React   │────▶│  FastAPI │────▶│    Supabase      │
│  (Vite)  │     │  (uvicorn)│    │  ┌────────────┐ │
│          │     │          │     │  │  PostgreSQL │ │
│  Pages:  │     │  Routes: │     │  │  + Auth     │ │
│  /login  │     │  /auth   │     │  └────────────┘ │
│  /       │     │  /exercises  │  └──────────────────┘
│  /workout│     │  /programs    │        │
│  /sensei │     │  /workout    │     ┌───┴────┐
│  /battles│     │  /progress   │     │ Gemini │
│  /profile│     │  /sensei     │     │  API   │
│          │     │  /battles    │     └────────┘
└──────────┘     └──────────┘
```

## Local Setup

### 1. Supabase Project

1. Create a project at [supabase.com](https://supabase.com)
2. Run `backend/init_schema.sql` in the Supabase SQL editor
3. Copy your project URL, anon key, service role key, and JWT secret

### 2. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your Supabase credentials and GEMINI_API_KEY
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend

```bash
cp .env.example .env
# Edit .env with VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_BASE_URL
pnpm install
pnpm dev
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Get profile |
| GET | `/api/exercises` | List exercises |
| GET | `/api/exercises/:id` | Get exercise |
| GET | `/api/programs` | List programs |
| GET | `/api/programs/:id` | Get program |
| POST | `/api/workout-sessions` | Start/log session |
| GET | `/api/progress/stats` | Get user stats |
| POST | `/api/sensei/chat` | Chat with AI coach |
| POST | `/api/battles/create` | Create battle |
| POST | `/api/battles/:id/accept` | Accept battle |
| POST | `/api/battles/:id/complete` | Complete battle |
| GET | `/api/health` | Health check |

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Service role key |
| `SUPABASE_JWT_SECRET` | JWT secret for token validation |
| `GEMINI_API_KEY` | Google Gemini API key |
| `FRONTEND_URL` | Frontend origin for CORS |
| `CORS_ORIGINS` | Comma-separated allowed origins |

### Frontend (`.env`)

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL (anon) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |
| `VITE_API_BASE_URL` | Backend API base URL |

## Deployment

### Docker

```bash
docker compose up --build
```

Frontend: http://localhost:8080
Backend: http://localhost:8000

### Manual

```bash
# Backend
cd backend && uvicorn app.main:app --host 0.0.0.0 --port 8000

# Frontend
pnpm build
npx serve dist -l 3000
```

## Testing

```bash
# Backend
cd backend && pytest tests/ -v

# Frontend
npx vitest run
```
