-- 005_xp_breakdown_body_measurements.sql
-- Ensures xp_breakdown and body_measurements tables exist with all required columns.
-- These were in the original init_schema but may not be present in some deployments.
-- Safe to run multiple times.

-- 1. xp_breakdown: audit log for XP earnings
CREATE TABLE IF NOT EXISTS xp_breakdown (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount INT NOT NULL,
  source TEXT DEFAULT 'workout',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE xp_breakdown ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE xp_breakdown ADD COLUMN IF NOT EXISTS category TEXT NOT NULL;
ALTER TABLE xp_breakdown ADD COLUMN IF NOT EXISTS amount INT NOT NULL;
ALTER TABLE xp_breakdown ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'workout';
ALTER TABLE xp_breakdown ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 2. body_measurements: user body stats tracking
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

ALTER TABLE body_measurements ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE body_measurements ADD COLUMN IF NOT EXISTS weight_kg DECIMAL(5,1);
ALTER TABLE body_measurements ADD COLUMN IF NOT EXISTS body_fat DECIMAL(4,1);
ALTER TABLE body_measurements ADD COLUMN IF NOT EXISTS chest_cm DECIMAL(5,1);
ALTER TABLE body_measurements ADD COLUMN IF NOT EXISTS waist_cm DECIMAL(5,1);
ALTER TABLE body_measurements ADD COLUMN IF NOT EXISTS arm_cm DECIMAL(4,1);
ALTER TABLE body_measurements ADD COLUMN IF NOT EXISTS thigh_cm DECIMAL(4,1);
ALTER TABLE body_measurements ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';
ALTER TABLE body_measurements ADD COLUMN IF NOT EXISTS measured_at TIMESTAMPTZ DEFAULT NOW();
