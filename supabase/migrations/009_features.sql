-- 009_features.sql
-- Adds diet_programs table, sensei_chat_history, and workout calendar support.
-- Safe to run multiple times.

-- ============================================================================
-- 1. diet_programs
-- ============================================================================
CREATE TABLE IF NOT EXISTS diet_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'fat-loss',
  goal TEXT DEFAULT '',
  difficulty TEXT DEFAULT 'beginner',
  description TEXT DEFAULT '',
  scientific_basis TEXT DEFAULT '',
  what_you_will_gain TEXT DEFAULT '',
  typical_macros JSONB DEFAULT '{}',
  sample_meals JSONB DEFAULT '[]',
  pros JSONB DEFAULT '[]',
  cons JSONB DEFAULT '[]',
  best_for TEXT DEFAULT '',
  proven_by TEXT DEFAULT '',
  recommended_program_types JSONB DEFAULT '[]',
  image_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE IF EXISTS diet_programs ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE IF EXISTS diet_programs ADD COLUMN IF NOT EXISTS name TEXT NOT NULL;
ALTER TABLE IF EXISTS diet_programs ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'fat-loss';
ALTER TABLE IF EXISTS diet_programs ADD COLUMN IF NOT EXISTS goal TEXT DEFAULT '';
ALTER TABLE IF EXISTS diet_programs ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'beginner';
ALTER TABLE IF EXISTS diet_programs ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE IF EXISTS diet_programs ADD COLUMN IF NOT EXISTS scientific_basis TEXT DEFAULT '';
ALTER TABLE IF EXISTS diet_programs ADD COLUMN IF NOT EXISTS what_you_will_gain TEXT DEFAULT '';
ALTER TABLE IF EXISTS diet_programs ADD COLUMN IF NOT EXISTS typical_macros JSONB DEFAULT '{}';
ALTER TABLE IF EXISTS diet_programs ADD COLUMN IF NOT EXISTS sample_meals JSONB DEFAULT '[]';
ALTER TABLE IF EXISTS diet_programs ADD COLUMN IF NOT EXISTS pros JSONB DEFAULT '[]';
ALTER TABLE IF EXISTS diet_programs ADD COLUMN IF NOT EXISTS cons JSONB DEFAULT '[]';
ALTER TABLE IF EXISTS diet_programs ADD COLUMN IF NOT EXISTS best_for TEXT DEFAULT '';
ALTER TABLE IF EXISTS diet_programs ADD COLUMN IF NOT EXISTS proven_by TEXT DEFAULT '';
ALTER TABLE IF EXISTS diet_programs ADD COLUMN IF NOT EXISTS recommended_program_types JSONB DEFAULT '[]';
ALTER TABLE IF EXISTS diet_programs ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '';

ALTER TABLE IF EXISTS diet_programs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read diet_programs" ON diet_programs;
CREATE POLICY "Anyone can read diet_programs" ON diet_programs FOR SELECT USING (true);

-- ============================================================================
-- 2. sensei_chat_history
-- ============================================================================
CREATE TABLE IF NOT EXISTS sensei_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'sensei')),
  content TEXT NOT NULL,
  conversation_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE IF EXISTS sensei_chat_history ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE IF EXISTS sensei_chat_history ADD COLUMN IF NOT EXISTS role TEXT NOT NULL;
ALTER TABLE IF EXISTS sensei_chat_history ADD COLUMN IF NOT EXISTS content TEXT NOT NULL;
ALTER TABLE IF EXISTS sensei_chat_history ADD COLUMN IF NOT EXISTS conversation_id TEXT NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sensei_chat_user_conv ON sensei_chat_history(user_id, conversation_id);

ALTER TABLE IF EXISTS sensei_chat_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own chat history" ON sensei_chat_history;
CREATE POLICY "Users own chat history" ON sensei_chat_history FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- 3. Add title column to workout_sessions for named sessions
-- ============================================================================
ALTER TABLE IF EXISTS workout_sessions ADD COLUMN IF NOT EXISTS title TEXT DEFAULT '';

-- ============================================================================
-- 4. Exercise detail columns (for rich display)
-- ============================================================================
ALTER TABLE IF EXISTS exercises ADD COLUMN IF NOT EXISTS video_url TEXT DEFAULT '';

-- ============================================================================
-- 5. Indexes for search performance (skip trigram if extension not available)
-- ============================================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname='pg_trgm') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_exercises_name_trgm ON exercises USING gin (name gin_trgm_ops)';
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_programs_name_trgm ON programs USING gin (name gin_trgm_ops)';
  END IF;
END $$;
