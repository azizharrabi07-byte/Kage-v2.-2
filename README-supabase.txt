-- ============================================================
-- KAGE Complete Supabase Schema
-- Paste this in your Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROGRESSION (XP, level, rank, streak)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.progression (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  rank_index INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  workouts_completed INTEGER DEFAULT 0,
  lock_in_sessions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- PROGRAMS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  kanji TEXT DEFAULT '',
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'strength',
  difficulty TEXT DEFAULT 'intermediate',
  duration_weeks INTEGER DEFAULT 8,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  is_current BOOLEAN DEFAULT true,
  UNIQUE(user_id, program_id)
);

-- ============================================================
-- WORKOUT TEMPLATES & SESSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.workout_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.workout_templates(id) ON DELETE SET NULL,
  program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  notes TEXT DEFAULT ''
);

-- ============================================================
-- EXERCISES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  target TEXT DEFAULT '',
  category TEXT DEFAULT 'strength',
  kanji TEXT DEFAULT '',
  description TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS public.session_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  sets INTEGER DEFAULT 0,
  reps INTEGER DEFAULT 0,
  weight_kg NUMERIC(6,2) DEFAULT 0
);

-- ============================================================
-- PERSONAL RECORDS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.personal_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE SET NULL,
  exercise_name TEXT NOT NULL,
  value NUMERIC(8,2) NOT NULL,
  unit TEXT DEFAULT 'kg',
  achieved_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DIET
-- ============================================================
CREATE TABLE IF NOT EXISTS public.meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast','lunch','dinner','snack')),
  calories INTEGER DEFAULT 0,
  protein_grams NUMERIC(6,2) DEFAULT 0,
  carbs_grams NUMERIC(6,2) DEFAULT 0,
  fat_grams NUMERIC(6,2) DEFAULT 0,
  program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
  eaten_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.water_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cups NUMERIC(4,1) DEFAULT 0,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BODY MEASUREMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.body_measurements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  weight_kg NUMERIC(5,2),
  body_fat_pct NUMERIC(4,1),
  measured_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FEED
-- ============================================================
CREATE TABLE IF NOT EXISTS public.feed_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  workout_id UUID REFERENCES public.workout_sessions(id) ON DELETE SET NULL,
  like_count INTEGER DEFAULT 0,
  repost_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_reported BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.feed_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.feed_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.feed_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.feed_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.feed_reposts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.feed_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- ============================================================
-- PLANS / CALENDAR
-- ============================================================
CREATE TABLE IF NOT EXISTS public.calendar_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_date DATE NOT NULL,
  program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
  workout_name TEXT DEFAULT '',
  is_rest_day BOOLEAN DEFAULT false,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, plan_date)
);

-- ============================================================
-- ACHIEVEMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon TEXT DEFAULT '🏆',
  category TEXT DEFAULT 'consistency',
  xp_reward INTEGER DEFAULT 0,
  criteria TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_progression_user ON progression(user_id);
CREATE INDEX IF NOT EXISTS idx_user_programs_user ON user_programs(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user ON workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_meals_user ON meals(user_id, eaten_at);
CREATE INDEX IF NOT EXISTS idx_water_logs_user ON water_logs(user_id, logged_at);
CREATE INDEX IF NOT EXISTS idx_body_measurements_user ON body_measurements(user_id);
CREATE INDEX IF NOT EXISTS idx_feed_posts_created ON feed_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feed_comments_post ON feed_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_calendar_plans_user ON calendar_plans(user_id, plan_date);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_personal_records_user ON personal_records(user_id);

-- ============================================================
-- SEED DATA: Default programs
-- ============================================================
INSERT INTO public.programs (name, kanji, description, category, difficulty, duration_weeks) VALUES
  ('Ultra Workout 極', '極', 'The ultimate warrior workout - extreme intensity', 'strength', 'advanced', 12),
  ('Samurai Strength', '武', 'Build warrior strength with compound lifts', 'strength', 'intermediate', 8),
  ('Shadow Speed', '影', 'Agility and speed training program', 'cardio', 'intermediate', 6),
  ('Iron Will', '鉄', 'Endurance and mental fortitude', 'endurance', 'beginner', 4),
  ('Dragon Fire', '龍', 'Explosive power and dynamic movements', 'strength', 'advanced', 10)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED DATA: Default exercises
-- ============================================================
INSERT INTO public.exercises (name, target, category, kanji, description) VALUES
  ('Bench Press', 'Chest', 'Strength', 'ベンチプレス', 'Classic chest press'),
  ('Squat', 'Legs', 'Strength', 'スクワット', 'Foundation leg exercise'),
  ('Deadlift', 'Back', 'Strength', 'デッドリフト', 'Full body pull'),
  ('Overhead Press', 'Shoulders', 'Strength', 'ショルダープレス', 'Vertical push'),
  ('Pull Up', 'Back', 'Strength', '懸垂', 'Upper body pull'),
  ('Barbell Row', 'Back', 'Strength', 'バーベルロウ', 'Horizontal pull'),
  ('Dips', 'Chest', 'Strength', 'ディップス', 'Lower chest push'),
  ('Lunges', 'Legs', 'Strength', 'ランジ', 'Single leg strength'),
  ('Plank', 'Core', 'Strength', 'プランク', 'Core stability'),
  ('Burpee', 'Full Body', 'Cardio', 'バーピー', 'Explosive full body')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED DATA: Default achievements
-- ============================================================
INSERT INTO public.achievements (name, description, icon, category, xp_reward, criteria) VALUES
  ('First Workout', 'Complete your first workout', '💪', 'consistency', 50, 'Complete 1 workout session'),
  ('Week Warrior', 'Work out 7 days in a row', '🔥', 'consistency', 100, '7-day streak'),
  ('Protein King', 'Hit your protein target for 30 days', '🥩', 'nutrition', 150, '30 days of protein targets'),
  ('Social Butterfly', 'Post 10 times in the dojo feed', '🦋', 'social', 75, '10 feed posts'),
  ('Iron Will', 'Complete 30 workout sessions', '⚔️', 'consistency', 200, '30 workout sessions'),
  ('Weight Warrior', 'Log your weight for 30 days', '⚖️', 'tracking', 80, '30 weight logs'),
  ('Early Bird', 'Work out before 6 AM', '🌅', 'consistency', 60, '5 early workouts'),
  ('Night Owl', 'Work out after 10 PM', '🦉', 'consistency', 60, '5 night workouts'),
  ('Perfect Week', 'Complete all scheduled workouts in a week', '📅', 'consistency', 120, '7 workouts in 7 days'),
  ('Lifting Legend', 'Reach 100kg bench press', '🏋️', 'strength', 200, '100kg bench press PR')
ON CONFLICT DO NOTHING;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progression ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_reposts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_records ENABLE ROW LEVEL SECURITY;

-- User can read/update own profile
CREATE POLICY "profiles_own" ON public.profiles
  FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Progression: user can read own, service role can insert
CREATE POLICY "progression_own" ON public.progression
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- User programs
CREATE POLICY "user_programs_own" ON public.user_programs
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Workout sessions: owner can CRUD
CREATE POLICY "sessions_own" ON public.workout_sessions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Meals
CREATE POLICY "meals_own" ON public.meals
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Water logs
CREATE POLICY "water_own" ON public.water_logs
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Body measurements
CREATE POLICY "measurements_own" ON public.body_measurements
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Feed: everyone can read, only owner can write
CREATE POLICY "feed_read_all" ON public.feed_posts
  FOR SELECT USING (true);
CREATE POLICY "feed_write_own" ON public.feed_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "feed_update_own" ON public.feed_posts
  FOR UPDATE USING (auth.uid() = user_id);

-- Feed comments
CREATE POLICY "comments_read_all" ON public.feed_comments
  FOR SELECT USING (true);
CREATE POLICY "comments_write_own" ON public.feed_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Calendar plans
CREATE POLICY "plans_own" ON public.calendar_plans
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Achievements: everyone can read
CREATE POLICY "achievements_read_all" ON public.achievements
  FOR SELECT USING (true);

-- User achievements: everyone can read, only system can insert
CREATE POLICY "user_achievements_read" ON public.user_achievements
  FOR SELECT USING (true);
CREATE POLICY "user_achievements_insert" ON public.user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Personal records
CREATE POLICY "prs_own" ON public.personal_records
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
