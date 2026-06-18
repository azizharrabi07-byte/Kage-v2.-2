-- 010_fix_schema.sql
-- Repairs any FK constraints dropped by the old (failed) 008 migration.
-- Also verifies exercises.id is still UUID and adds any missing columns.
-- Safe to run multiple times.

-- ============================================================================
-- 1. Verify exercises.id is still UUID (if old 008 partially ran)
-- ============================================================================
DO $$
DECLARE
  col_type TEXT;
BEGIN
  SELECT data_type INTO col_type
  FROM information_schema.columns
  WHERE table_name = 'exercises' AND column_name = 'id';

  IF col_type IS DISTINCT FROM 'uuid' THEN
    -- Old 008 may have changed it to text — revert back
    EXECUTE 'ALTER TABLE exercises ALTER COLUMN id TYPE UUID USING id::uuid';
    EXECUTE 'ALTER TABLE exercises ALTER COLUMN id SET DEFAULT gen_random_uuid()';
  END IF;
END $$;

-- ============================================================================
-- 2. Restore FK constraints (if old 008 dropped them)
-- ============================================================================
ALTER TABLE IF EXISTS program_exercises
  DROP CONSTRAINT IF EXISTS program_exercises_exercise_id_fkey;
ALTER TABLE IF EXISTS program_exercises
  ADD CONSTRAINT program_exercises_exercise_id_fkey
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS session_exercises
  DROP CONSTRAINT IF EXISTS session_exercises_exercise_id_fkey;
ALTER TABLE IF EXISTS session_exercises
  ADD CONSTRAINT session_exercises_exercise_id_fkey
  FOREIGN KEY (exercise_id) REFERENCES exercises(id);

ALTER TABLE IF EXISTS workout_sets
  DROP CONSTRAINT IF EXISTS workout_sets_exercise_id_fkey;
ALTER TABLE IF EXISTS workout_sets
  ADD CONSTRAINT workout_sets_exercise_id_fkey
  FOREIGN KEY (exercise_id) REFERENCES exercises(id);

ALTER TABLE IF EXISTS personal_records
  DROP CONSTRAINT IF EXISTS personal_records_exercise_id_fkey;
ALTER TABLE IF EXISTS personal_records
  ADD CONSTRAINT personal_records_exercise_id_fkey
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS template_exercises
  DROP CONSTRAINT IF EXISTS template_exercises_exercise_id_fkey;
ALTER TABLE IF EXISTS template_exercises
  ADD CONSTRAINT template_exercises_exercise_id_fkey
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS program_exercises
  DROP CONSTRAINT IF EXISTS program_exercises_program_id_fkey;
ALTER TABLE IF EXISTS program_exercises
  ADD CONSTRAINT program_exercises_program_id_fkey
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE;

-- ============================================================================
-- 3. Ensure all missing columns exist (from 008 + 009)
-- ============================================================================
ALTER TABLE IF EXISTS exercises ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE IF EXISTS exercises ADD COLUMN IF NOT EXISTS kanji TEXT DEFAULT '';
ALTER TABLE IF EXISTS exercises ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE IF EXISTS exercises ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'strength';
ALTER TABLE IF EXISTS exercises ADD COLUMN IF NOT EXISTS secondary_muscles JSONB DEFAULT '[]';
ALTER TABLE IF EXISTS exercises ADD COLUMN IF NOT EXISTS tips JSONB DEFAULT '[]';
ALTER TABLE IF EXISTS exercises ADD COLUMN IF NOT EXISTS default_sets INT DEFAULT 3;
ALTER TABLE IF EXISTS exercises ADD COLUMN IF NOT EXISTS default_reps TEXT DEFAULT '10';
ALTER TABLE IF EXISTS exercises ADD COLUMN IF NOT EXISTS rest_seconds INT DEFAULT 60;
ALTER TABLE IF EXISTS exercises ADD COLUMN IF NOT EXISTS benefits JSONB DEFAULT '[]';
ALTER TABLE IF EXISTS exercises ADD COLUMN IF NOT EXISTS video_url TEXT DEFAULT '';

ALTER TABLE IF EXISTS programs ADD COLUMN IF NOT EXISTS slug TEXT;
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
-- 4. Ensure 009 tables exist
-- ============================================================================
CREATE TABLE IF NOT EXISTS diet_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT, name TEXT NOT NULL, category TEXT DEFAULT 'fat-loss',
  goal TEXT DEFAULT '', difficulty TEXT DEFAULT 'beginner',
  description TEXT DEFAULT '', scientific_basis TEXT DEFAULT '',
  what_you_will_gain TEXT DEFAULT '', typical_macros JSONB DEFAULT '{}',
  sample_meals JSONB DEFAULT '[]', pros JSONB DEFAULT '[]', cons JSONB DEFAULT '[]',
  best_for TEXT DEFAULT '', proven_by TEXT DEFAULT '',
  recommended_program_types JSONB DEFAULT '[]', image_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sensei_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'sensei')),
  content TEXT NOT NULL, conversation_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sensei_chat_user_conv ON sensei_chat_history(user_id, conversation_id);

ALTER TABLE IF EXISTS workout_sessions ADD COLUMN IF NOT EXISTS title TEXT DEFAULT '';

-- ============================================================================
-- 5. Fix personal_records unique constraint
-- ============================================================================
ALTER TABLE IF EXISTS personal_records DROP CONSTRAINT IF EXISTS personal_records_user_id_exercise_name_key;
ALTER TABLE IF EXISTS personal_records DROP CONSTRAINT IF EXISTS personal_records_user_id_exercise_id_key;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'personal_records_user_id_exercise_id_key'
  ) THEN
    ALTER TABLE personal_records ADD CONSTRAINT personal_records_user_id_exercise_id_key UNIQUE(user_id, exercise_id);
  END IF;
END $$;

-- ============================================================================
-- 6. RLS for 009 tables
-- ============================================================================
ALTER TABLE IF EXISTS diet_programs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read diet_programs" ON diet_programs;
CREATE POLICY "Anyone can read diet_programs" ON diet_programs FOR SELECT USING (true);

ALTER TABLE IF EXISTS sensei_chat_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own chat history" ON sensei_chat_history;
CREATE POLICY "Users own chat history" ON sensei_chat_history FOR ALL USING (auth.uid() = user_id);
