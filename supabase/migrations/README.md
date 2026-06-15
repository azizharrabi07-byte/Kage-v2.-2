# KAGE Supabase Migrations

Run these SQL files **in order** in the Supabase SQL Editor. Each is **idempotent** — safe to run multiple times.

## Run Order

| # | File | Creates |
|---|------|---------|
| 1 | `001_profiles_table.sql` | `profiles` table + auto-create trigger on signup |
| 2 | `002_programs_library.sql` | `programs` + `program_exercises` tables |
| 3 | `003_rpc_functions.sql` | Helper RPCs: `increment_workout_count`, `add_xp`, `transfer_xp`, `ensure_progression` |
| 4 | `004_indexes_rls.sql` | Indexes + RLS for tables that already exist (skips missing tables/columns safely) |
| 5 | `005_core_backend_tables.sql` | Missing core tables: `workout_templates`, `template_exercises`, `session_exercises`, `progression`, `personal_records`, `xp_breakdown`, `body_measurements` — each with own indexes + RLS |
| 6 | `006_nutrition_bounties.sql` | `nutrition_logs`, `bounties`, `user_bounties` + 10 seed bounties |

## Notes

- Each file is self-contained: tables, indexes, and RLS policies are all in one place.
- `CREATE TABLE IF NOT EXISTS` + `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` means no errors on re-run.
- Tables you already have (`exercises`, `workout_sessions`, `workout_sets`, `achievements`, `user_achievements`, `battles`) are left untouched.
