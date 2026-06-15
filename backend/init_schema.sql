CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  target TEXT NOT NULL,
  category TEXT NOT NULL,
  kanji TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  difficulty TEXT DEFAULT 'intermediate',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES workout_templates(id),
  name TEXT NOT NULL,
  kanji TEXT DEFAULT '',
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  total_xp INT DEFAULT 0,
  notes TEXT DEFAULT '',
  mood INT DEFAULT 3,
  duration_seconds INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS session_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id),
  sort_order INT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workout_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_exercise_id UUID REFERENCES session_exercises(id) ON DELETE CASCADE,
  set_number INT NOT NULL,
  reps INT DEFAULT 10,
  weight_kg DECIMAL(5,1) DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS xp_breakdown (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount INT NOT NULL,
  source TEXT DEFAULT 'workout',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS personal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  weight_kg DECIMAL(5,1) NOT NULL,
  reps INT DEFAULT 1,
  achieved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, exercise_id, weight_kg, reps)
);

CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT '🏆',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT REFERENCES achievements(id),
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

INSERT INTO achievements (id, name, description, icon) VALUES
  ('first_workout', 'First Sweat', 'Complete your first workout', '💪'),
  ('five_workouts', 'Getting Started', 'Complete 5 workouts', '🔥'),
  ('ten_workouts', 'Dedicated', 'Complete 10 workouts', '⚔️'),
  ('twenty_five_workouts', 'Warrior Path', 'Complete 25 workouts', '🛡️'),
  ('fifty_workouts', 'Half Century', 'Complete 50 workouts', '🗡️'),
  ('hundred_workouts', 'Century Club', 'Complete 100 workouts', '👑'),
  ('first_streak_3', 'Streak Starter', 'Reach a 3-day streak', '📅'),
  ('first_streak_7', 'Weekly Warrior', 'Reach a 7-day streak', '📆'),
  ('first_streak_30', 'Monthly Master', 'Reach a 30-day streak', '🗓️'),
  ('first_pr', 'Personal Record', 'Set your first personal record', '🏆')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS battles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  opponent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed')),
  winner_id UUID REFERENCES auth.users(id),
  wager_xp INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

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
