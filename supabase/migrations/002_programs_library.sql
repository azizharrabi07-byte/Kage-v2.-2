-- 002_programs_library.sql
-- Creates programs + program_exercises tables with seed data.
-- Safe to run multiple times.

-- 1. Programs table
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'strength',
  goal TEXT DEFAULT '',
  difficulty TEXT DEFAULT 'intermediate',
  duration TEXT DEFAULT '4 weeks',
  frequency TEXT DEFAULT '3x/week',
  equipment TEXT DEFAULT 'bodyweight',
  scientific_basis TEXT DEFAULT '',
  evidence_level TEXT DEFAULT 'B',
  what_you_will_gain TEXT DEFAULT '',
  sample_exercises TEXT[] DEFAULT '{}',
  target_muscles TEXT[] DEFAULT '{}',
  proven_by TEXT DEFAULT '',
  popularity TEXT DEFAULT 'modern',
  recommended_diet_program_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE programs ADD COLUMN IF NOT EXISTS name TEXT NOT NULL;
ALTER TABLE programs ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE programs ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'strength';
ALTER TABLE programs ADD COLUMN IF NOT EXISTS goal TEXT DEFAULT '';
ALTER TABLE programs ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'intermediate';
ALTER TABLE programs ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '4 weeks';
ALTER TABLE programs ADD COLUMN IF NOT EXISTS frequency TEXT DEFAULT '3x/week';
ALTER TABLE programs ADD COLUMN IF NOT EXISTS equipment TEXT DEFAULT 'bodyweight';
ALTER TABLE programs ADD COLUMN IF NOT EXISTS scientific_basis TEXT DEFAULT '';
ALTER TABLE programs ADD COLUMN IF NOT EXISTS evidence_level TEXT DEFAULT 'B';
ALTER TABLE programs ADD COLUMN IF NOT EXISTS what_you_will_gain TEXT DEFAULT '';
ALTER TABLE programs ADD COLUMN IF NOT EXISTS sample_exercises TEXT[] DEFAULT '{}';
ALTER TABLE programs ADD COLUMN IF NOT EXISTS target_muscles TEXT[] DEFAULT '{}';
ALTER TABLE programs ADD COLUMN IF NOT EXISTS proven_by TEXT DEFAULT '';
ALTER TABLE programs ADD COLUMN IF NOT EXISTS popularity TEXT DEFAULT 'modern';
ALTER TABLE programs ADD COLUMN IF NOT EXISTS recommended_diet_program_id TEXT;

-- 2. Program-exercises join table
CREATE TABLE IF NOT EXISTS program_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  sort_order INT DEFAULT 0,
  sets INT DEFAULT 3,
  reps TEXT DEFAULT '10',
  rest_seconds INT DEFAULT 60,
  notes TEXT DEFAULT ''
);

ALTER TABLE program_exercises ADD COLUMN IF NOT EXISTS program_id UUID REFERENCES programs(id) ON DELETE CASCADE;
ALTER TABLE program_exercises ADD COLUMN IF NOT EXISTS exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE;
ALTER TABLE program_exercises ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE program_exercises ADD COLUMN IF NOT EXISTS sets INT DEFAULT 3;
ALTER TABLE program_exercises ADD COLUMN IF NOT EXISTS reps TEXT DEFAULT '10';
ALTER TABLE program_exercises ADD COLUMN IF NOT EXISTS rest_seconds INT DEFAULT 60;
ALTER TABLE program_exercises ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';

-- 3. RLS: programs are read-only for all authenticated users
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read programs" ON programs;
CREATE POLICY "Anyone can read programs"
  ON programs FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can read program_exercises" ON program_exercises;
CREATE POLICY "Anyone can read program_exercises"
  ON program_exercises FOR SELECT
  USING (true);

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_programs_category ON programs(category);
CREATE INDEX IF NOT EXISTS idx_programs_difficulty ON programs(difficulty);
CREATE INDEX IF NOT EXISTS idx_programs_evidence_level ON programs(evidence_level);
CREATE INDEX IF NOT EXISTS idx_program_exercises_program_id ON program_exercises(program_id);
CREATE INDEX IF NOT EXISTS idx_program_exercises_exercise_id ON program_exercises(exercise_id);
