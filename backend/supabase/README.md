# KAGE Backend (Supabase)

The KAGE fitness app uses **Supabase** as its cloud backend: PostgreSQL database,
authentication, file storage, and real-time subscriptions — all via the REST API
or `@supabase/supabase-js` SDK.

## Quick start

### 1. Create a Supabase project
Go to https://supabase.com/dashboard and create a new project. Note:
- **Project URL** — e.g. `https://abc.supabase.co`
- **anon key** (public) — for the frontend
- **service_role key** (secret) — for migrations only

### 2. Apply the schema
Open the Supabase dashboard → **SQL Editor** → New query, paste the contents of
`migrations/001_init_schema.sql`, click **Run**. This creates:
- 11 tables (`profiles`, `exercises`, `workout_templates`, …)
- Row Level Security policies on every table
- Triggers for auto-creating profiles, XP/level updates, streak tracking, PR detection
- Views (`user_stats`, `leaderboard`, `recent_sessions`)
- An `avatars` storage bucket with policies

### 3. (Optional) Run the migration script
```bash
export SUPABASE_URL=https://abc.supabase.co
export SUPABASE_SERVICE_KEY=eyJ...
cd supabase/
python3 migrate.py --apply
```

### 4. Wire the frontend
In `app.json`:
```json
{
  "expo": {
    "extra": {
      "EXPO_PUBLIC_SUPABASE_URL": "https://abc.supabase.co",
      "EXPO_PUBLIC_SUPABASE_ANON_KEY": "eyJ..."
    }
  }
}
```

### 5. Test it
Open the KAGE app, navigate to **Settings**, tap **Sign In / Sign Up**. Sign up
with any email/password — the `handle_new_user` trigger auto-creates your profile.
Complete a workout and the session + sets push to Supabase automatically.

## File structure
```
supabase/
├── README.md                  ← this file
├── migrate.py                 ← REST API migration runner
├── migrations/
│   └── 001_init_schema.sql    ← full schema with RLS + triggers
└── seeds/
    ├── exercises.json         ← 53 exercises
    └── templates.json         ← 10 templates + their exercises
```

## Database schema
- `profiles` — extends auth.users, holds KAGE stats (XP, level, streak)
- `exercises` — 53 KAGE exercises (immutable, public-readable)
- `workout_templates` — predefined + custom templates
- `template_exercises` — many-to-many between templates and exercises
- `workout_sessions` — every completed workout
- `session_exercises` — exercises within a session
- `workout_sets` — individual sets with reps, weight, RPE, PR flag
- `personal_records` — PRs, auto-detected via trigger
- `xp_events` — audit log of XP gains
- `body_measurements` — weight, body fat, circumferences
- `achievements` — unlocked badges (auto-awarded on level-up)

## Triggers
| Trigger | Purpose |
|---|---|
| `on_auth_user_created` | Auto-creates a `profiles` row when a user signs up |
| `xp_event_applied` | Adds XP, recomputes level, awards level-up achievement |
| `session_streak_update` | Updates streak counter when a session is completed |
| `set_pr_detection` | Detects new personal records when a set is logged |

## Views
- `user_stats` — denormalized profile summary (XP, level, PR count, etc.)
- `leaderboard` — top 100 users by XP
- `recent_sessions` — last 50 completed sessions

## RLS policies
Every table has Row Level Security enabled:
- `profiles` — users can read/update only their own row
- `exercises` — public-readable (no auth required)
- `workout_templates` — public templates readable by anyone; custom templates visible only to owner
- `workout_sessions` / `sets` — owners only

The frontend uses the anon key with the user's session JWT — Supabase enforces
RLS based on `auth.uid()`. No backend code needs to authorize requests.

## API surface (from the KAGE frontend)
```ts
import { supabase } from './lib/supabase';

// Auth
await supabase.auth.signUp(email, password, { display_name: 'Kenji' });
await supabase.auth.signInWithPassword(email, password);
await supabase.auth.signOut();

// Database
const { data, error } = await supabase
  .from('workout_sessions')
  .select('*, session_exercises(*, workout_sets(*), exercises(name, kanji))')
  .eq('user_id', userId)
  .order('started_at', { ascending: false })
  .limit(50);

// Insert
await supabase.from('workout_sessions').insert({ user_id, name, ... });

// Update / delete
await supabase.from('profiles').update({ avatar_url }).eq('id', userId);
await supabase.from('workout_sessions').delete().eq('id', sessionId);

// Storage
await supabase.storage.uploadAvatar(userId, blob);
```

## Troubleshooting

**Cloud Sync shows "Unreachable"**
- Check your project URL and anon key
- The Supabase project may be paused (free tier pauses after 1 week of inactivity)

**Sign-up fails with "Email not confirmed"**
- Disable email confirmation: Supabase Dashboard → Authentication → Providers → Email → toggle off "Confirm email"

**Migration runner says "exec_sql RPC not found"**
- This is normal — paste `migrations/001_init_schema.sql` directly into the SQL Editor

**RLS is blocking legitimate reads**
- Open the SQL Editor and run: `SELECT * FROM pg_policies WHERE schemaname = 'public';`
- Check that the user is authenticated: `SELECT auth.uid();`

## Cost
Supabase free tier covers the KAGE app comfortably:
- 500 MB database (≈ 100k workouts)
- 1 GB file storage (≈ 5k avatars)
- 50k MAU
- 2 GB egress

Enough for the first ~10k users. Pro plan ($25/mo) extends to 8 GB database,
100 GB storage, and 100k MAU.

## License
MIT
