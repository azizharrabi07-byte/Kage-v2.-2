-- 007_missing_columns.sql
-- Adds columns that the backend code expects but may be missing from existing tables.
-- Safe to run multiple times.

-- workout_sessions: backend orders by started_at DESC
ALTER TABLE IF EXISTS workout_sessions ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ DEFAULT NOW();

-- workout_sessions: template_id for linking to programs
ALTER TABLE IF EXISTS workout_sessions ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES workout_templates(id);

-- workout_sessions: total_xp for session XP summary
ALTER TABLE IF EXISTS workout_sessions ADD COLUMN IF NOT EXISTS total_xp INT DEFAULT 0;

-- workout_sets: user_id for direct RLS (if missing)
ALTER TABLE IF EXISTS workout_sets ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- progression: rank_index for leaderboard sorting
ALTER TABLE IF EXISTS progression ADD COLUMN IF NOT EXISTS rank_index INT DEFAULT 0;

-- progression: lock_in_sessions for streak protection
ALTER TABLE IF EXISTS progression ADD COLUMN IF NOT EXISTS lock_in_sessions INT DEFAULT 0;

-- battles: completed_at timestamp
ALTER TABLE IF EXISTS battles ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
