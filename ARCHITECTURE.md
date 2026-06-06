# KAGE EPIC — Architectural Plan

## System Architecture
```
┌─────────────────────────────────────────────┐
│              React Native (Expo)             │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐ │
│  │ Zustand  │ │React Query│ │ AsyncStorage │ │
│  │ (Client) │ │ (Server)  │ │ (Offline)    │ │
│  └────┬─────┘ └────┬─────┘ └──────┬───────┘ │
│       └────────────┼──────────────┘          │
│                    │ API Client               │
└────────────────────┼─────────────────────────┘
                     │ HTTPS + JWT
┌────────────────────┼─────────────────────────┐
│         FastAPI (Railway/Fly)                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐ │
│  │  Auth MW │ │ Routers  │ │ Service Layer │ │
│  └──────────┘ └────┬─────┘ └──────┬───────┘ │
│                    │               │          │
│              ┌─────┴───────────────┴──┐      │
│              │  Supabase (Postgres)   │      │
│              └────────────────────────┘      │
└─────────────────────────────────────────────┘
```

## Database Schema (12 tables)
```
users                  → id, email, name, created_at
exercises              → id, name, target, category, kanji, image_url, video_url, description, difficulty
workout_templates      → id, user_id, name, kanji, description, difficulty, duration, is_custom
template_exercises     → id, template_id, exercise_id, sort_order, sets, reps, weight
workout_sessions       → id, user_id, template_id, started_at, completed_at, total_xp, notes, mood
session_exercises      → id, session_id, exercise_id, sort_order, completed
workout_sets           → id, session_exercise_id, set_number, reps, weight_kg, completed, completed_at
progression            → id, user_id, total_xp, level, rank_index, streak, last_workout_date, updated_at
xp_breakdown           → id, user_id, category, amount, source, created_at
personal_records       → id, user_id, exercise_id, weight_kg, reps, achieved_at
body_measurements      → id, user_id, weight_kg, body_fat, chest, waist, arms, thighs, measured_at
nutrition_logs         → id, user_id, meal_type, food, calories, protein, carbs, fat, logged_at
```

## API Endpoints (17 routes)
```
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/me
GET    /api/exercises?category=&search=
GET    /api/exercises/:id
GET    /api/workout-templates
POST   /api/workout-templates
GET    /api/workout-sessions?limit=&offset=
POST   /api/workout-sessions
GET    /api/workout-sessions/:id
GET    /api/progression
POST   /api/progression/xp
GET    /api/personal-records
POST   /api/personal-records
GET    /api/body-measurements
POST   /api/body-measurements
```

## Frontend State (6 Zustand stores)
```
authStore        → user, token, isAuthenticated, login(), logout(), signup()
workoutStore     → activeSession, history[], templates[], startWorkout(), completeSet()
progressionStore → xp, rank, level, streak, attributes, addXP()
exerciseStore    → library[], filters, search, selected, fetchExercises()
measurementStore → bodyStats[], photos[], addMeasurement()
uiStore          → theme, activeModal, loading, setTheme(), showModal()
```

## Data Flow
```
User Actions → Zustand Store → API Client → FastAPI → Supabase
                                    ↓
                             AsyncStorage (offline cache)
                                    ↓
                           React Query (auto refetch on reconnect)
```

## Execution Plan (6 Waves)
1. Design fixes (ParticleBackground, fonts, safe area, loading states)
2. Backend (FastAPI + Supabase schema + all 17 endpoints)
3. Frontend bridge (API client, Zustand stores, offline fallback)
4. Sports features (50+ exercises, PRs, measurements, calendar)
5. Engineer polish (memoization, error boundaries, testing)
6. Final refinement (animations, responsiveness, edge cases)
```

I'll now execute all 6 waves using subagents in parallel where possible. This is the architecture — every change from here is executing this plan.
