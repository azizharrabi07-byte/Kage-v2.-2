-- ============================================================================
-- KAGE Fitness App — Supabase Schema
-- Version 1.0.0
--
-- This migration creates the complete database schema for the KAGE fitness
-- app: 11 tables, Row Level Security policies, indexes, triggers, and
-- automated progression logic.
--
-- DEPLOYMENT:
--   1. Create a Supabase project (https://supabase.com/dashboard)
--   2. Open SQL Editor: https://supabase.com/dashboard/project/_/sql
--   3. Paste this file and click "Run"
--   4. Run seeds/002_seed_data.sql (exercises + templates) in the same editor
--   5. Get your anon + service_role keys from Settings → API
--   6. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
--      in your frontend .env file
-- ============================================================================

-- Required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- PROFILES (extends auth.users with KAGE-specific data)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT DEFAULT 'Ronin',
  avatar_url TEXT DEFAULT '',
  dojo_name TEXT DEFAULT 'Shadow Dojo',
  rank TEXT DEFAULT 'Initiate',
  total_xp INT DEFAULT 0,
  level INT DEFAULT 1,
  streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  workouts_completed INT DEFAULT 0,
  last_workout_date TIMESTAMPTZ,
  height_cm DECIMAL(5,1),
  weight_kg DECIMAL(5,1),
  goal TEXT DEFAULT 'strength',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_xp ON public.profiles(total_xp DESC);

-- ============================================================================
-- EXERCISES (53 KAGE exercises, mostly bodyweight with optional equipment)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  target TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('push','pull','legs','core','full','cardio')),
  kanji TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  difficulty TEXT DEFAULT 'intermediate' CHECK (difficulty IN ('beginner','intermediate','warrior')),
  equipment TEXT DEFAULT 'body only',
  primary_muscles TEXT[] DEFAULT '{}',
  secondary_muscles TEXT[] DEFAULT '{}',
  force TEXT,
  mechanic TEXT,
  instructions TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exercises_category ON public.exercises(category);
CREATE INDEX IF NOT EXISTS idx_exercises_target ON public.exercises(target);
CREATE INDEX IF NOT EXISTS idx_exercises_slug ON public.exercises(slug);
CREATE INDEX IF NOT EXISTS idx_exercises_active ON public.exercises(is_active);

-- ============================================================================
-- WORKOUT TEMPLATES (predefined + user custom)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.workout_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT,
  name TEXT NOT NULL,
  kanji TEXT NOT NULL,
  description TEXT DEFAULT '',
  difficulty TEXT DEFAULT 'intermediate' CHECK (difficulty IN ('beginner','intermediate','warrior')),
  duration_min INT DEFAULT 30,
  is_custom BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_templates_user ON public.workout_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_public ON public.workout_templates(is_public);

CREATE TABLE IF NOT EXISTS public.template_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.workout_templates(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  sort_order INT NOT NULL,
  sets INT DEFAULT 3,
  reps INT DEFAULT 10,
  weight_kg DECIMAL(6,2) DEFAULT 0,
  rest_seconds INT DEFAULT 60,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_template_ex_template ON public.template_exercises(template_id, sort_order);

-- ============================================================================
-- WORKOUT SESSIONS (every workout the user does)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.workout_templates(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  kanji TEXT DEFAULT '',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  total_xp INT DEFAULT 0,
  notes TEXT DEFAULT '',
  mood INT DEFAULT 3 CHECK (mood BETWEEN 1 AND 5),
  duration_seconds INT DEFAULT 0,
  is_pr_session BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON public.workout_sessions(user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_completed ON public.workout_sessions(user_id, completed_at);

CREATE TABLE IF NOT EXISTS public.session_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  sort_order INT NOT NULL,
  completed BOOLEAN DEFAULT false,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_session_ex_session ON public.session_exercises(session_id, sort_order);

CREATE TABLE IF NOT EXISTS public.workout_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_exercise_id UUID NOT NULL REFERENCES public.session_exercises(id) ON DELETE CASCADE,
  set_number INT NOT NULL,
  reps INT DEFAULT 10,
  weight_kg DECIMAL(6,2) DEFAULT 0,
  rpe INT CHECK (rpe BETWEEN 1 AND 10),
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  is_pr BOOLEAN DEFAULT false,
  is_warmup BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sets_session_exercise ON public.workout_sets(session_exercise_id, set_number);

-- ============================================================================
-- PERSONAL RECORDS (auto-updated via trigger)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.personal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  weight_kg DECIMAL(6,2) NOT NULL,
  reps INT DEFAULT 1,
  estimated_1rm DECIMAL(6,2),
  achieved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, exercise_id, weight_kg, reps)
);

CREATE INDEX IF NOT EXISTS idx_prs_user ON public.personal_records(user_id, achieved_at DESC);
CREATE INDEX IF NOT EXISTS idx_prs_exercise ON public.personal_records(user_id, exercise_id);

-- ============================================================================
-- XP BREAKDOWN (audit trail for every XP gain)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.xp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount INT NOT NULL,
  source TEXT DEFAULT 'workout',
  source_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_xp_user ON public.xp_events(user_id, created_at DESC);

-- ============================================================================
-- BODY MEASUREMENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.body_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight_kg DECIMAL(5,1),
  body_fat_pct DECIMAL(4,1),
  chest_cm DECIMAL(5,1),
  waist_cm DECIMAL(5,1),
  hip_cm DECIMAL(5,1),
  arm_cm DECIMAL(4,1),
  thigh_cm DECIMAL(4,1),
  notes TEXT DEFAULT '',
  measured_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_measurements_user ON public.body_measurements(user_id, measured_at DESC);

-- ============================================================================
-- ACHIEVEMENTS (auto-awarded via triggers)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  kanji TEXT NOT NULL,
  description TEXT DEFAULT '',
  tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze','silver','gold','platinum','legendary')),
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, code)
);

CREATE INDEX IF NOT EXISTS idx_achievements_user ON public.achievements(user_id, unlocked_at DESC);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Auto-create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Update profile XP / level when an XP event is recorded
CREATE OR REPLACE FUNCTION public.apply_xp_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_xp INT;
  new_level INT;
BEGIN
  UPDATE public.profiles
    SET total_xp = total_xp + NEW.amount
    WHERE id = NEW.user_id
    RETURNING total_xp INTO new_xp;

  -- Level curve: 0-99 = 1, 100-299 = 2, 300-599 = 3, 600-999 = 4, 1000-1499 = 5
  -- (loosely quadratic, see settings/levels.json)
  new_level := GREATEST(
    1,
    FLOOR(SQRT(new_xp / 100.0))::INT + 1
  );

  UPDATE public.profiles SET level = new_level WHERE id = NEW.user_id;

  -- Auto-award streak achievement at milestones
  INSERT INTO public.achievements (user_id, code, title, kanji, description, tier)
  SELECT NEW.user_id, 'xp_' || new_level, 'Level ' || new_level, '昇', 'Reached level ' || new_level, 'bronze'
  WHERE NOT EXISTS (SELECT 1 FROM public.achievements WHERE user_id = NEW.user_id AND code = 'xp_' || new_level);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS xp_event_applied ON public.xp_events;
CREATE TRIGGER xp_event_applied
  AFTER INSERT ON public.xp_events
  FOR EACH ROW EXECUTE FUNCTION public.apply_xp_event();

-- Update streak on session completion
CREATE OR REPLACE FUNCTION public.update_streak_on_session()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  prev_date DATE;
  today DATE := CURRENT_DATE;
  new_streak INT;
BEGIN
  IF NEW.completed_at IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT last_workout_date, streak INTO prev_date, new_streak
    FROM public.profiles WHERE id = NEW.user_id;

  IF prev_date IS NULL THEN
    new_streak := 1;
  ELSIF prev_date = today THEN
    -- same day, no change
    RETURN NEW;
  ELSIF prev_date = today - INTERVAL '1 day' THEN
    new_streak := new_streak + 1;
  ELSE
    new_streak := 1;
  END IF;

  UPDATE public.profiles
    SET streak = new_streak,
        longest_streak = GREATEST(longest_streak, new_streak),
        last_workout_date = today,
        workouts_completed = workouts_completed + 1
    WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS session_streak_update ON public.workout_sessions;
CREATE TRIGGER session_streak_update
  AFTER INSERT OR UPDATE OF completed_at ON public.workout_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_streak_on_session();

-- Detect PR when a workout set is logged
CREATE OR REPLACE FUNCTION public.detect_personal_record()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_exercise_id UUID;
  v_existing_max DECIMAL(6,2);
  v_1rm DECIMAL(6,2);
BEGIN
  IF NEW.completed = false OR NEW.is_warmup = true THEN
    RETURN NEW;
  END IF;

  SELECT se.session_id, s.user_id, se.exercise_id
    INTO v_user_id, v_exercise_id
    FROM public.session_exercises se
    JOIN public.workout_sessions s ON s.id = se.session_id
    WHERE se.id = NEW.session_exercise_id;

  -- Epley 1RM estimate
  v_1rm := CASE
    WHEN NEW.reps = 1 THEN NEW.weight_kg
    WHEN NEW.reps > 0 THEN ROUND(NEW.weight_kg * (1 + NEW.reps / 30.0), 2)
    ELSE 0
  END;

  -- Check for weight PR
  SELECT MAX(weight_kg) INTO v_existing_max
    FROM public.personal_records
    WHERE user_id = v_user_id AND exercise_id = v_exercise_id;

  IF v_existing_max IS NULL OR NEW.weight_kg > v_existing_max THEN
    INSERT INTO public.personal_records (user_id, exercise_id, weight_kg, reps, estimated_1rm)
      VALUES (v_user_id, v_exercise_id, NEW.weight_kg, NEW.reps, v_1rm)
      ON CONFLICT (user_id, exercise_id, weight_kg, reps) DO NOTHING;

    NEW.is_pr := true;

    UPDATE public.workout_sessions
      SET is_pr_session = true
      WHERE id = (SELECT session_id FROM public.session_exercises WHERE id = NEW.session_exercise_id);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_pr_detection ON public.workout_sets;
CREATE TRIGGER set_pr_detection
  BEFORE INSERT OR UPDATE OF completed ON public.workout_sets
  FOR EACH ROW EXECUTE FUNCTION public.detect_personal_record();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Helper: read own profile
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Exercises are public-readable, service-writable
CREATE POLICY "exercises_select_all" ON public.exercises
  FOR SELECT USING (true);

-- Templates: anyone can read public, owners can read their custom
CREATE POLICY "templates_select_public" ON public.workout_templates
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "templates_insert_own" ON public.workout_templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "templates_update_own" ON public.workout_templates
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "templates_delete_own" ON public.workout_templates
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "template_exercises_select" ON public.template_exercises
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workout_templates t
      WHERE t.id = template_id
        AND (t.is_public = true OR t.user_id = auth.uid())
    )
  );

CREATE POLICY "template_exercises_write_own" ON public.template_exercises
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.workout_templates t
      WHERE t.id = template_id AND t.user_id = auth.uid()
    )
  );

-- Sessions: full CRUD for own
CREATE POLICY "sessions_select_own" ON public.workout_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "sessions_insert_own" ON public.workout_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sessions_update_own" ON public.workout_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "sessions_delete_own" ON public.workout_sessions
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "session_exercises_select_own" ON public.session_exercises
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.workout_sessions s WHERE s.id = session_id AND s.user_id = auth.uid())
  );

CREATE POLICY "session_exercises_write_own" ON public.session_exercises
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.workout_sessions s WHERE s.id = session_id AND s.user_id = auth.uid())
  );

CREATE POLICY "sets_select_own" ON public.workout_sets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.session_exercises se
      JOIN public.workout_sessions s ON s.id = se.session_id
      WHERE se.id = session_exercise_id AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "sets_write_own" ON public.workout_sets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.session_exercises se
      JOIN public.workout_sessions s ON s.id = se.session_id
      WHERE se.id = session_exercise_id AND s.user_id = auth.uid()
    )
  );

-- PRs: own only
CREATE POLICY "prs_select_own" ON public.personal_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "prs_insert_own" ON public.personal_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "prs_delete_own" ON public.personal_records
  FOR DELETE USING (auth.uid() = user_id);

-- XP events: own only
CREATE POLICY "xp_select_own" ON public.xp_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "xp_insert_own" ON public.xp_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Measurements: own only
CREATE POLICY "measurements_select_own" ON public.body_measurements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "measurements_insert_own" ON public.body_measurements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "measurements_delete_own" ON public.body_measurements
  FOR DELETE USING (auth.uid() = user_id);

-- Achievements: own only
CREATE POLICY "achievements_select_own" ON public.achievements
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- VIEWS (denormalized for fast app reads)
-- ============================================================================

-- User stats summary
CREATE OR REPLACE VIEW public.user_stats AS
SELECT
  p.id AS user_id,
  p.email,
  p.display_name,
  p.avatar_url,
  p.dojo_name,
  p.rank,
  p.total_xp,
  p.level,
  p.streak,
  p.longest_streak,
  p.workouts_completed,
  p.last_workout_date,
  (SELECT COUNT(*) FROM public.personal_records WHERE user_id = p.id) AS total_prs,
  (SELECT COUNT(*) FROM public.achievements WHERE user_id = p.id) AS total_achievements,
  (SELECT MAX(weight_kg) FROM public.personal_records WHERE user_id = p.id) AS heaviest_lift
FROM public.profiles p;

GRANT SELECT ON public.user_stats TO authenticated;

-- Leaderboard by XP
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT
  id AS user_id,
  display_name,
  avatar_url,
  rank,
  total_xp,
  level,
  streak,
  workouts_completed,
  ROW_NUMBER() OVER (ORDER BY total_xp DESC) AS rank_position
FROM public.profiles
WHERE total_xp > 0
ORDER BY total_xp DESC
LIMIT 100;

GRANT SELECT ON public.leaderboard TO authenticated;

-- Recent activity feed
CREATE OR REPLACE VIEW public.recent_sessions AS
SELECT
  s.id,
  s.user_id,
  s.name,
  s.kanji,
  s.started_at,
  s.completed_at,
  s.total_xp,
  s.duration_seconds,
  s.is_pr_session,
  s.mood,
  p.display_name,
  p.avatar_url,
  p.rank
FROM public.workout_sessions s
JOIN public.profiles p ON p.id = s.user_id
WHERE s.completed_at IS NOT NULL
ORDER BY s.completed_at DESC
LIMIT 50;

GRANT SELECT ON public.recent_sessions TO authenticated;

-- ============================================================================
-- STORAGE (avatars bucket)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "avatars_select_all" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "avatars_upload_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars_update_own" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars_delete_own" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================================
-- DONE
-- ============================================================================
-- Next steps: run seeds/002_seed_data.sql to populate the 53 exercises
-- and 10 workout templates, then grab your API keys from Settings → API.
