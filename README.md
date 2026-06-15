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

## Supabase Setup

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Get your credentials

In your project dashboard → **Project Settings → API**:

| Credential | Where to find it | Used by |
|------------|------------------|---------|
| **Project URL** | `Settings → API → Project URL` | Frontend + Backend |
| **Anon Key** | `Settings → API → anon public` | Frontend |
| **Service Role Key** | `Settings → API → service_role` (keep secret!) | Backend |
| **JWT Secret** | `Settings → API → JWT Settings → JWT Secret` | Backend |

### 3. Run the SQL schema

Open **SQL Editor** in your Supabase dashboard and paste the contents of `backend/init_schema.sql`:

<details>
<summary>Click to expand SQL schema</summary>

```sql
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  target TEXT NOT NULL,
  category TEXT NOT NULL,
  kanji TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  difficulty TEXT DEFAULT 'intermediate',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workout_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  kanji TEXT NOT NULL,
  description TEXT DEFAULT '',
  difficulty TEXT DEFAULT 'intermediate',
  duration INT DEFAULT 30,
  is_custom BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS template_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES workout_templates(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  sort_order INT NOT NULL,
  sets INT DEFAULT 3,
  reps INT DEFAULT 10,
  weight_kg DECIMAL(5,1) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES workout_templates(id),
  name TEXT NOT NULL,
  kanji TEXT DEFAULT '',
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  total_xp INT DEFAULT 0,
  notes TEXT DEFAULT '',
  mood INT DEFAULT 3,
  duration_seconds INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS session_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id),
  sort_order INT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workout_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_exercise_id UUID REFERENCES session_exercises(id) ON DELETE CASCADE,
  set_number INT NOT NULL,
  reps INT DEFAULT 10,
  weight_kg DECIMAL(5,1) DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS progression (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INT DEFAULT 0,
  level INT DEFAULT 1,
  rank_index INT DEFAULT 0,
  streak INT DEFAULT 0,
  last_workout_date TIMESTAMPTZ,
  workouts_completed INT DEFAULT 0,
  lock_in_sessions INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS xp_breakdown (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount INT NOT NULL,
  source TEXT DEFAULT 'workout',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS personal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  weight_kg DECIMAL(5,1) NOT NULL,
  reps INT DEFAULT 1,
  achieved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, exercise_id, weight_kg, reps)
);

CREATE TABLE IF NOT EXISTS body_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  weight_kg DECIMAL(5,1),
  body_fat DECIMAL(4,1),
  chest_cm DECIMAL(5,1),
  waist_cm DECIMAL(5,1),
  arm_cm DECIMAL(4,1),
  thigh_cm DECIMAL(4,1),
  notes TEXT DEFAULT '',
  measured_at TIMESTAMPTZ DEFAULT NOW()
);
```

</details>

### 4. Enable Row Level Security (RLS)

Run these RLS policies in the SQL editor after creating the tables:

```sql
-- Each table should have RLS enabled:
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE progression ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read exercises
CREATE POLICY "Anyone can read exercises"
  ON exercises FOR SELECT USING (true);

-- Users can only access their own sessions
CREATE POLICY "Users own their sessions"
  ON workout_sessions FOR ALL
  USING (auth.uid() = user_id);

-- Users can only access their own progression
CREATE POLICY "Users own their progression"
  ON progression FOR ALL
  USING (auth.uid() = user_id);

-- Users can only access their own PRs
CREATE POLICY "Users own their PRs"
  ON personal_records FOR ALL
  USING (auth.uid() = user_id);
```

### 5. Set up Auth (optional but recommended)

In **Supabase Dashboard → Authentication → Providers**, enable **Email** auth. You can also enable Google, GitHub, etc.

---

## Local Setup

### 1. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Copy env file and fill in your credentials
cp .env.example .env
# Edit .env with your SUPABASE_URL, SUPABASE_SERVICE_KEY, SUPABASE_JWT_SECRET, GEMINI_API_KEY
# NEVER commit .env to Git

uvicorn app.main:app --reload --port 8000
```

### 2. Frontend

```bash
# Copy env file (Vite auto-loads .env.local over .env)
cp .env.example .env.local
# Edit .env.local with VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_BASE_URL

npm install
npm run dev
```

---

## How the Connection Code Works

### Frontend — `src/lib/supabaseClient.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

Vite automatically loads `.env.local` and makes `VITE_*` variables available via `import.meta.env`.

### Backend — `backend/app/database.py`

```python
from supabase import create_client, Client
from app.config import settings   # loaded from .env via pydantic-settings

_supabase: Client | None = None

def get_supabase() -> Client:
    global _supabase
    if _supabase is None:
        _supabase = create_client(
            settings.supabase_url,
            settings.supabase_service_key,
        )
    return _supabase
```

The `Settings` class reads from `backend/.env`:

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    supabase_url: str
    supabase_service_key: str
    supabase_jwt_secret: str
    gemini_api_key: str = ""
    cors_origins: str = "*"

    class Config:
        env_file = ".env"
```

---

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
| `SUPABASE_SERVICE_KEY` | Service role key (keep secret) |
| `SUPABASE_JWT_SECRET` | JWT secret for token validation |
| `GEMINI_API_KEY` | Google Gemini API key |
| `FRONTEND_URL` | Frontend origin for CORS |
| `CORS_ORIGINS` | Comma-separated allowed origins |

### Frontend (`.env.local`)

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key (safe for client) |
| `VITE_API_BASE_URL` | Backend API base URL (default: `http://localhost:8000`) |

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
npm run build
npx serve dist -l 3000
```

## Testing

```bash
# Backend
cd backend && pytest tests/ -v

# Frontend
npx vitest run
```

## Security Notes

- **Never commit `.env` or `.env.local` files** containing real keys to Git
- The `.env.local` file is already in `.gitignore` for frontend
- The anon key is safe for client use (RLS protects your data)
- The service role key bypasses RLS — keep it server-side only
- Rotate keys regularly via Supabase dashboard → Project Settings → API
