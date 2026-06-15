-- 006_nutrition_bounties.sql
-- Creates nutrition_logs, bounties, and user_bounties tables.
-- These tables exist in the user's production DB but are not in the init schema.
-- Safe to run multiple times.

-- 1. nutrition_logs: daily food/meal tracking
CREATE TABLE IF NOT EXISTS nutrition_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_type TEXT DEFAULT 'snack',
  food_name TEXT NOT NULL,
  calories INT DEFAULT 0,
  protein_g DECIMAL(6,1) DEFAULT 0,
  carbs_g DECIMAL(6,1) DEFAULT 0,
  fat_g DECIMAL(6,1) DEFAULT 0,
  portion_size TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS date DATE NOT NULL DEFAULT CURRENT_DATE;
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS meal_type TEXT DEFAULT 'snack';
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS food_name TEXT NOT NULL;
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS calories INT DEFAULT 0;
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS protein_g DECIMAL(6,1) DEFAULT 0;
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS carbs_g DECIMAL(6,1) DEFAULT 0;
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS fat_g DECIMAL(6,1) DEFAULT 0;
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS portion_size TEXT DEFAULT '';
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_nutrition_logs_user_id ON nutrition_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_logs_date ON nutrition_logs(date DESC);

-- 2. bounties: challenge/mission definitions
CREATE TABLE IF NOT EXISTS bounties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'daily',
  xp_reward INT DEFAULT 100,
  requirements JSONB DEFAULT '{}',
  icon TEXT DEFAULT '🎯',
  active BOOLEAN DEFAULT true,
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE bounties ADD COLUMN IF NOT EXISTS title TEXT NOT NULL;
ALTER TABLE bounties ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE bounties ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'daily';
ALTER TABLE bounties ADD COLUMN IF NOT EXISTS xp_reward INT DEFAULT 100;
ALTER TABLE bounties ADD COLUMN IF NOT EXISTS requirements JSONB DEFAULT '{}';
ALTER TABLE bounties ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT '🎯';
ALTER TABLE bounties ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
ALTER TABLE bounties ADD COLUMN IF NOT EXISTS starts_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE bounties ADD COLUMN IF NOT EXISTS ends_at TIMESTAMPTZ;
ALTER TABLE bounties ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 3. user_bounties: tracks which users completed which bounties
CREATE TABLE IF NOT EXISTS user_bounties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  bounty_id UUID REFERENCES bounties(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'claimed' CHECK (status IN ('claimed', 'completed', 'rewarded')),
  progress JSONB DEFAULT '{}',
  completed_at TIMESTAMPTZ,
  rewarded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, bounty_id)
);

ALTER TABLE user_bounties ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE user_bounties ADD COLUMN IF NOT EXISTS bounty_id UUID REFERENCES bounties(id) ON DELETE CASCADE;
ALTER TABLE user_bounties ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'claimed';
ALTER TABLE user_bounties ADD COLUMN IF NOT EXISTS progress JSONB DEFAULT '{}';
ALTER TABLE user_bounties ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
ALTER TABLE user_bounties ADD COLUMN IF NOT EXISTS rewarded_at TIMESTAMPTZ;
ALTER TABLE user_bounties ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_bounties_user_id ON user_bounties(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bounties_bounty_id ON user_bounties(bounty_id);
CREATE INDEX IF NOT EXISTS idx_bounties_category ON bounties(category);
CREATE INDEX IF NOT EXISTS idx_bounties_active ON bounties(active);

-- Seed data: sample bounties
INSERT INTO bounties (title, description, category, xp_reward, icon) VALUES
  ('Daily Warrior', 'Complete any workout today', 'daily', 50, '⚔️'),
  ('Streak Keeper', 'Log in for 3 consecutive days', 'daily', 100, '🔥'),
  ('Push-Up King', 'Complete 100 push-ups in a single session', 'challenge', 250, '💪'),
  ('Bodyweight Beast', 'Complete a full bodyweight workout', 'weekly', 200, '🦍'),
  ('Early Bird', 'Workout before 7 AM', 'daily', 75, '🌅'),
  ('Night Owl', 'Workout after 9 PM', 'daily', 75, '🦉'),
  ('Perfect Form', 'Complete a session with all sets verified', 'challenge', 150, '🎯'),
  ('Shadow Fighter', 'Complete 3 shadow boxing rounds', 'weekly', 100, '👊'),
  ('Nutrition Master', 'Log meals for 7 consecutive days', 'weekly', 300, '🥗'),
  ('Century Club', 'Complete 100 total workouts', 'lifetime', 1000, '👑')
ON CONFLICT (id) DO NOTHING;
