-- 005_core_backend_tables.sql
-- Creates tables from init_schema that may not exist in your deployment.
-- All use CREATE TABLE IF NOT EXISTS — safe to run multiple times.
-- Includes inline indexes + RLS (self-contained).

-- ============================================================================
-- 1. workout_templates
-- ============================================================================
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

ALTER TABLE IF EXISTS workout_templates ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE IF EXISTS workout_templates ADD COLUMN IF NOT EXISTS name TEXT NOT NULL;
ALTER TABLE IF EXISTS workout_templates ADD COLUMN IF NOT EXISTS kanji TEXT NOT NULL;
ALTER TABLE IF EXISTS workout_templates ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE IF EXISTS workout_templates ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'intermediate';
ALTER TABLE IF EXISTS workout_templates ADD COLUMN IF NOT EXISTS duration INT DEFAULT 30;
ALTER TABLE IF EXISTS workout_templates ADD COLUMN IF NOT EXISTS is_custom BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_workout_templates_user_id ON workout_templates(user_id);

ALTER TABLE IF EXISTS workout_templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own their workout templates" ON workout_templates;
CREATE POLICY "Users own their workout templates"
  ON workout_templates FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================================
-- 2. template_exercises
-- ============================================================================
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

ALTER TABLE IF EXISTS template_exercises ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES workout_templates(id) ON DELETE CASCADE;
ALTER TABLE IF EXISTS template_exercises ADD COLUMN IF NOT EXISTS exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE;
ALTER TABLE IF EXISTS template_exercises ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL;
ALTER TABLE IF EXISTS template_exercises ADD COLUMN IF NOT EXISTS sets INT DEFAULT 3;
ALTER TABLE IF EXISTS template_exercises ADD COLUMN IF NOT EXISTS reps INT DEFAULT 10;
ALTER TABLE IF EXISTS template_exercises ADD COLUMN IF NOT EXISTS weight_kg DECIMAL(5,1) DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_template_exercises_template_id ON template_exercises(template_id);
CREATE INDEX IF NOT EXISTS idx_template_exercises_exercise_id ON template_exercises(exercise_id);

ALTER TABLE IF EXISTS template_exercises ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own template exercises" ON template_exercises;
CREATE POLICY "Users own template exercises"
  ON template_exercises FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workout_templates
      WHERE workout_templates.id = template_exercises.template_id
      AND workout_templates.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 3. session_exercises (join table between workout_sessions and exercises)
-- ============================================================================
CREATE TABLE IF NOT EXISTS session_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id),
  sort_order INT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE IF EXISTS session_exercises ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES workout_sessions(id) ON DELETE CASCADE;
ALTER TABLE IF EXISTS session_exercises ADD COLUMN IF NOT EXISTS exercise_id UUID REFERENCES exercises(id);
ALTER TABLE IF EXISTS session_exercises ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL;
ALTER TABLE IF EXISTS session_exercises ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_session_exercises_session_id ON session_exercises(session_id);
CREATE INDEX IF NOT EXISTS idx_session_exercises_exercise_id ON session_exercises(exercise_id);

ALTER TABLE IF EXISTS session_exercises ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own session exercises" ON session_exercises;
CREATE POLICY "Users own session exercises"
  ON session_exercises FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions
      WHERE workout_sessions.id = session_exercises.session_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 4. progression (XP, level, streak per user)
-- ============================================================================
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

ALTER TABLE IF EXISTS progression ADD COLUMN IF NOT EXISTS user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE IF EXISTS progression ADD COLUMN IF NOT EXISTS total_xp INT DEFAULT 0;
ALTER TABLE IF EXISTS progression ADD COLUMN IF NOT EXISTS level INT DEFAULT 1;
ALTER TABLE IF EXISTS progression ADD COLUMN IF NOT EXISTS rank_index INT DEFAULT 0;
ALTER TABLE IF EXISTS progression ADD COLUMN IF NOT EXISTS streak INT DEFAULT 0;
ALTER TABLE IF EXISTS progression ADD COLUMN IF NOT EXISTS last_workout_date TIMESTAMPTZ;
ALTER TABLE IF EXISTS progression ADD COLUMN IF NOT EXISTS workouts_completed INT DEFAULT 0;
ALTER TABLE IF EXISTS progression ADD COLUMN IF NOT EXISTS lock_in_sessions INT DEFAULT 0;
ALTER TABLE IF EXISTS progression ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_progression_user_id ON progression(user_id);

ALTER TABLE IF EXISTS progression ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own their progression" ON progression;
CREATE POLICY "Users own their progression"
  ON progression FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================================
-- 5. personal_records
-- ============================================================================
CREATE TABLE IF NOT EXISTS personal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  weight_kg DECIMAL(5,1) NOT NULL,
  reps INT DEFAULT 1,
  achieved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, exercise_id, weight_kg, reps)
);

ALTER TABLE IF EXISTS personal_records ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE IF EXISTS personal_records ADD COLUMN IF NOT EXISTS exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE;
ALTER TABLE IF EXISTS personal_records ADD COLUMN IF NOT EXISTS weight_kg DECIMAL(5,1) NOT NULL;
ALTER TABLE IF EXISTS personal_records ADD COLUMN IF NOT EXISTS reps INT DEFAULT 1;
ALTER TABLE IF EXISTS personal_records ADD COLUMN IF NOT EXISTS achieved_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_personal_records_user_id ON personal_records(user_id);
CREATE INDEX IF NOT EXISTS idx_personal_records_exercise_id ON personal_records(exercise_id);

ALTER TABLE IF EXISTS personal_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own their personal records" ON personal_records;
CREATE POLICY "Users own their personal records"
  ON personal_records FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================================
-- 6. xp_breakdown (audit log)
-- ============================================================================
CREATE TABLE IF NOT EXISTS xp_breakdown (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount INT NOT NULL,
  source TEXT DEFAULT 'workout',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE IF EXISTS xp_breakdown ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE IF EXISTS xp_breakdown ADD COLUMN IF NOT EXISTS category TEXT NOT NULL;
ALTER TABLE IF EXISTS xp_breakdown ADD COLUMN IF NOT EXISTS amount INT NOT NULL;
ALTER TABLE IF EXISTS xp_breakdown ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'workout';

CREATE INDEX IF NOT EXISTS idx_xp_breakdown_user_id ON xp_breakdown(user_id);

ALTER TABLE IF EXISTS xp_breakdown ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own their xp breakdown" ON xp_breakdown;
CREATE POLICY "Users own their xp breakdown"
  ON xp_breakdown FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================================
-- 7. body_measurements
-- ============================================================================
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

ALTER TABLE IF EXISTS body_measurements ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE IF EXISTS body_measurements ADD COLUMN IF NOT EXISTS weight_kg DECIMAL(5,1);
ALTER TABLE IF EXISTS body_measurements ADD COLUMN IF NOT EXISTS body_fat DECIMAL(4,1);
ALTER TABLE IF EXISTS body_measurements ADD COLUMN IF NOT EXISTS chest_cm DECIMAL(5,1);
ALTER TABLE IF EXISTS body_measurements ADD COLUMN IF NOT EXISTS waist_cm DECIMAL(5,1);
ALTER TABLE IF EXISTS body_measurements ADD COLUMN IF NOT EXISTS arm_cm DECIMAL(4,1);
ALTER TABLE IF EXISTS body_measurements ADD COLUMN IF NOT EXISTS thigh_cm DECIMAL(4,1);
ALTER TABLE IF EXISTS body_measurements ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';
ALTER TABLE IF EXISTS body_measurements ADD COLUMN IF NOT EXISTS measured_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_body_measurements_user_id ON body_measurements(user_id);

ALTER TABLE IF EXISTS body_measurements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own their body measurements" ON body_measurements;
CREATE POLICY "Users own their body measurements"
  ON body_measurements FOR ALL
  USING (auth.uid() = user_id);
