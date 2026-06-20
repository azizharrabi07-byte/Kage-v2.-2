-- 012_samurai_system.sql
-- Samurai Identity System: contracts, ghosts, legacy scrolls, quests, JSONB workout logs.
-- Safe to run multiple times.

-- ============================================================================
-- 1. Extend profiles with samurai attributes
-- ============================================================================
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS main_goal TEXT DEFAULT '';
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS energy_level INT DEFAULT 5;
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS injuries TEXT DEFAULT '';
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS crew_ids UUID[] DEFAULT '{}';

-- ============================================================================
-- 2. daily_contracts — AI-generated workout contracts with XP staking
-- ============================================================================
CREATE TABLE IF NOT EXISTS daily_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  weight_kg DECIMAL(5,1) DEFAULT 0,
  reps INT DEFAULT 10,
  sets INT DEFAULT 3,
  xp_staked INT DEFAULT 0,
  xp_potential INT DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','active','success','fail','skipped')),
  narrative TEXT DEFAULT '',
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  sensor_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_contracts_user ON daily_contracts(user_id);
CREATE INDEX IF NOT EXISTS idx_contracts_date ON daily_contracts(generated_at DESC);

ALTER TABLE IF EXISTS daily_contracts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own contracts" ON daily_contracts;
CREATE POLICY "Users own contracts" ON daily_contracts FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- 3. ghost_sessions — async competition ghosts
-- ============================================================================
CREATE TABLE IF NOT EXISTS ghost_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_data JSONB NOT NULL DEFAULT '{}',
  xp_earned INT DEFAULT 0,
  defeated_by UUID[] DEFAULT '{}',
  wins INT DEFAULT 0,
  losses INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ghosts_user ON ghost_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_ghosts_xp ON ghost_sessions(xp_earned DESC);

ALTER TABLE IF EXISTS ghost_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read ghosts" ON ghost_sessions;
CREATE POLICY "Anyone can read ghosts" ON ghost_sessions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users own ghosts" ON ghost_sessions;
CREATE POLICY "Users own ghosts" ON ghost_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 4. legacy_scrolls — weekly AI-generated narratives
-- ============================================================================
CREATE TABLE IF NOT EXISTS legacy_scrolls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  week_number INT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  shared BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_number)
);
CREATE INDEX IF NOT EXISTS idx_scrolls_user ON legacy_scrolls(user_id);

ALTER TABLE IF EXISTS legacy_scrolls ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own scrolls" ON legacy_scrolls;
CREATE POLICY "Users own scrolls" ON legacy_scrolls FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- 5. nutrition_quests — simplified daily nutrition tasks
-- ============================================================================
CREATE TABLE IF NOT EXISTS nutrition_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  day DATE NOT NULL DEFAULT CURRENT_DATE,
  task TEXT NOT NULL DEFAULT '',
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, day)
);
CREATE INDEX IF NOT EXISTS idx_quests_user ON nutrition_quests(user_id);

ALTER TABLE IF EXISTS nutrition_quests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own quests" ON nutrition_quests;
CREATE POLICY "Users own quests" ON nutrition_quests FOR ALL USING (auth.uid() = user_id);
