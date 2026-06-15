# KAGE Supabase Migrations

Run these SQL files in order in the Supabase SQL Editor. Each file is **idempotent** — safe to run multiple times.

## Run Order

| # | File | What it adds |
|---|------|-------------|
| 1 | `001_profiles_table.sql` | `profiles` table + auto-create trigger on signup |
| 2 | `002_programs_library.sql` | `programs` + `program_exercises` tables |
| 3 | `003_rpc_functions.sql` | Helper RPC functions (`increment_workout_count`, `add_xp`, `transfer_xp`, `ensure_progression`) |
| 4 | `004_indexes_rls.sql` | Indexes on all tables + Row Level Security policies |
| 5 | `005_xp_breakdown_body_measurements.sql` | `xp_breakdown` + `body_measurements` tables |
| 6 | `006_nutrition_bounties.sql` | `nutrition_logs`, `bounties`, `user_bounties` tables + seed bounties |

## How to Run

1. Open your Supabase Dashboard → **SQL Editor**
2. Create a new query
3. Copy-paste the entire contents of each file, one at a time, in order
4. Click **Run**

Each file will show `CREATE TABLE IF NOT EXISTS` and `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` — it will not error if tables already exist.

## What These Are NOT

These are **delta migrations** — they assume you already have the base tables (`exercises`, `workout_sessions`, `workout_sets`, `achievements`, `user_achievements`, `battles`, `progression`, `personal_records`, `workout_templates`, `template_exercises`) from the initial schema (`backend/init_schema.sql`).

If you haven't run the initial schema yet, run `backend/init_schema.sql` first, then these migrations.
