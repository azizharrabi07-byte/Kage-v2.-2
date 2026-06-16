-- 008_full_schema.sql
-- Full schema alignment: changes id to TEXT, adds all columns matching frontend.
-- Safe to run multiple times (idempotent).

-- ============================================================================
-- 1. Change exercises.id from UUID to TEXT
-- ============================================================================
-- First drop dependent FK constraints
ALTER TABLE IF EXISTS program_exercises DROP CONSTRAINT IF EXISTS program_exercises_exercise_id_fkey;
ALTER TABLE IF EXISTS session_exercises DROP CONSTRAINT IF EXISTS session_exercises_exercise_id_fkey;
ALTER TABLE IF EXISTS workout_sets DROP CONSTRAINT IF EXISTS workout_sets_exercise_id_fkey;
ALTER TABLE IF EXISTS personal_records DROP CONSTRAINT IF EXISTS personal_records_exercise_id_fkey;
ALTER TABLE IF EXISTS template_exercises DROP CONSTRAINT IF EXISTS template_exercises_exercise_id_fkey;

ALTER TABLE IF EXISTS exercises ALTER COLUMN id TYPE TEXT;
ALTER TABLE IF EXISTS exercises ALTER COLUMN id DROP DEFAULT;

-- Restore FK constraints
ALTER TABLE IF EXISTS program_exercises ADD CONSTRAINT program_exercises_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE;
ALTER TABLE IF EXISTS session_exercises ADD CONSTRAINT session_exercises_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES exercises(id);
ALTER TABLE IF EXISTS workout_sets ADD CONSTRAINT workout_sets_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES exercises(id);
ALTER TABLE IF EXISTS personal_records ADD CONSTRAINT personal_records_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE;
ALTER TABLE IF EXISTS template_exercises ADD CONSTRAINT template_exercises_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE;

-- ============================================================================
-- 2. Add missing exercises columns
-- ============================================================================
ALTER TABLE IF EXISTS exercises ADD COLUMN IF NOT EXISTS kanji TEXT DEFAULT '';
ALTER TABLE IF EXISTS exercises ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE IF EXISTS exercises ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'strength';
ALTER TABLE IF EXISTS exercises ADD COLUMN IF NOT EXISTS secondary_muscles JSONB DEFAULT '[]';
ALTER TABLE IF EXISTS exercises ADD COLUMN IF NOT EXISTS tips JSONB DEFAULT '[]';
ALTER TABLE IF EXISTS exercises ADD COLUMN IF NOT EXISTS default_sets INT DEFAULT 3;
ALTER TABLE IF EXISTS exercises ADD COLUMN IF NOT EXISTS default_reps TEXT DEFAULT '10';
ALTER TABLE IF EXISTS exercises ADD COLUMN IF NOT EXISTS rest_seconds INT DEFAULT 60;
ALTER TABLE IF EXISTS exercises ADD COLUMN IF NOT EXISTS benefits JSONB DEFAULT '[]';

-- ============================================================================
-- 3. Change programs.id from UUID to TEXT
-- ============================================================================
ALTER TABLE IF EXISTS program_exercises DROP CONSTRAINT IF EXISTS program_exercises_program_id_fkey;
ALTER TABLE IF EXISTS programs ALTER COLUMN id TYPE TEXT;
ALTER TABLE IF EXISTS programs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS program_exercises ADD CONSTRAINT program_exercises_program_id_fkey FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE;

-- ============================================================================
-- 4. Add missing programs columns
-- ============================================================================
ALTER TABLE IF EXISTS programs ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'strength';
ALTER TABLE IF EXISTS programs ADD COLUMN IF NOT EXISTS goal TEXT DEFAULT '';
ALTER TABLE IF EXISTS programs ADD COLUMN IF NOT EXISTS frequency TEXT DEFAULT '3x/week';
ALTER TABLE IF EXISTS programs ADD COLUMN IF NOT EXISTS equipment TEXT DEFAULT 'bodyweight';
ALTER TABLE IF EXISTS programs ADD COLUMN IF NOT EXISTS scientific_basis TEXT DEFAULT '';
ALTER TABLE IF EXISTS programs ADD COLUMN IF NOT EXISTS what_you_will_gain TEXT DEFAULT '';
ALTER TABLE IF EXISTS programs ADD COLUMN IF NOT EXISTS sample_exercises JSONB DEFAULT '[]';
ALTER TABLE IF EXISTS programs ADD COLUMN IF NOT EXISTS target_muscles JSONB DEFAULT '[]';
ALTER TABLE IF EXISTS programs ADD COLUMN IF NOT EXISTS proven_by TEXT DEFAULT '';
ALTER TABLE IF EXISTS programs ADD COLUMN IF NOT EXISTS popularity TEXT DEFAULT 'modern';
ALTER TABLE IF EXISTS programs ADD COLUMN IF NOT EXISTS recommended_diet_program_id TEXT DEFAULT '';
ALTER TABLE IF EXISTS programs ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '4 weeks';
ALTER TABLE IF EXISTS programs ADD COLUMN IF NOT EXISTS kanji TEXT DEFAULT '';

-- ============================================================================
-- 5. Fix personal_records unique constraint
-- ============================================================================
ALTER TABLE IF EXISTS personal_records DROP CONSTRAINT IF EXISTS personal_records_user_id_exercise_name_key;
ALTER TABLE IF EXISTS personal_records DROP CONSTRAINT IF EXISTS personal_records_user_id_exercise_id_key;
ALTER TABLE IF EXISTS personal_records ADD CONSTRAINT personal_records_user_id_exercise_id_key UNIQUE(user_id, exercise_id);
