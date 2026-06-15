-- 004_indexes_rls.sql
-- Adds indexes and RLS for tables guaranteed to exist before this migration:
--   profiles (001), exercises, programs (002), program_exercises (002),
--   workout_sessions, workout_sets, achievements, user_achievements, battles
-- Tables from 005/006 manage their own indexes internally.
-- Safe to run multiple times.

-- ============================================================================
-- INDEXES
-- ============================================================================
DO $$
BEGIN
  -- exercises
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='exercises') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='exercises' AND column_name='category') THEN
      EXECUTE 'CREATE INDEX IF NOT EXISTS idx_exercises_category ON exercises(category)';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='exercises' AND column_name='difficulty') THEN
      EXECUTE 'CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON exercises(difficulty)';
    END IF;
  END IF;

  -- workout_sessions
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='workout_sessions') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='workout_sessions' AND column_name='user_id') THEN
      EXECUTE 'CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON workout_sessions(user_id)';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='workout_sessions' AND column_name='started_at') THEN
      EXECUTE 'CREATE INDEX IF NOT EXISTS idx_workout_sessions_started_at ON workout_sessions(started_at DESC)';
    END IF;
  END IF;

  -- workout_sets
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='workout_sets') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='workout_sets' AND column_name='user_id') THEN
      EXECUTE 'CREATE INDEX IF NOT EXISTS idx_workout_sets_user_id ON workout_sets(user_id)';
    END IF;
  END IF;

  -- achievements
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='achievements') THEN
    NULL;
  END IF;

  -- user_achievements
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='user_achievements') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_achievements' AND column_name='user_id') THEN
      EXECUTE 'CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id)';
    END IF;
  END IF;

  -- battles
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='battles') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='battles' AND column_name='challenger_id') THEN
      EXECUTE 'CREATE INDEX IF NOT EXISTS idx_battles_challenger_id ON battles(challenger_id)';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='battles' AND column_name='opponent_id') THEN
      EXECUTE 'CREATE INDEX IF NOT EXISTS idx_battles_opponent_id ON battles(opponent_id)';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='battles' AND column_name='status') THEN
      EXECUTE 'CREATE INDEX IF NOT EXISTS idx_battles_status ON battles(status)';
    END IF;
  END IF;
END $$;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================
DO $$
BEGIN
  -- exercises
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='exercises') THEN
    EXECUTE 'ALTER TABLE IF EXISTS exercises ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can read exercises" ON exercises';
    EXECUTE 'CREATE POLICY "Anyone can read exercises" ON exercises FOR SELECT USING (true)';
  END IF;

  -- workout_sessions
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='workout_sessions') THEN
    EXECUTE 'ALTER TABLE IF EXISTS workout_sessions ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "Users own their workout sessions" ON workout_sessions';
    EXECUTE 'CREATE POLICY "Users own their workout sessions" ON workout_sessions FOR ALL USING (auth.uid() = user_id)';
  END IF;

  -- workout_sets
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='workout_sets') THEN
    EXECUTE 'ALTER TABLE IF EXISTS workout_sets ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "Users own workout sets" ON workout_sets';
    EXECUTE 'CREATE POLICY "Users own workout sets" ON workout_sets FOR ALL USING (auth.uid() = user_id)';
  END IF;

  -- achievements
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='achievements') THEN
    EXECUTE 'ALTER TABLE IF EXISTS achievements ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can read achievements" ON achievements';
    EXECUTE 'CREATE POLICY "Anyone can read achievements" ON achievements FOR SELECT USING (true)';
  END IF;

  -- user_achievements
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='user_achievements') THEN
    EXECUTE 'ALTER TABLE IF EXISTS user_achievements ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "Users can read own achievements" ON user_achievements';
    EXECUTE 'CREATE POLICY "Users can read own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id)';
  END IF;

  -- battles
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='battles') THEN
    EXECUTE 'ALTER TABLE IF EXISTS battles ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "Participants can read battles" ON battles';
    EXECUTE 'CREATE POLICY "Participants can read battles" ON battles FOR SELECT USING (auth.uid() = challenger_id OR auth.uid() = opponent_id)';
    EXECUTE 'DROP POLICY IF EXISTS "Participants can update battles" ON battles';
    EXECUTE 'CREATE POLICY "Participants can update battles" ON battles FOR UPDATE USING (auth.uid() = challenger_id OR auth.uid() = opponent_id)';
    EXECUTE 'DROP POLICY IF EXISTS "Users can create battles" ON battles';
    EXECUTE 'CREATE POLICY "Users can create battles" ON battles FOR INSERT WITH CHECK (auth.uid() = challenger_id)';
  END IF;

  -- profiles (created in 001)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='profiles') THEN
    EXECUTE 'ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "Users can view own profile" ON profiles';
    EXECUTE 'CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id)';
    EXECUTE 'DROP POLICY IF EXISTS "Users can update own profile" ON profiles';
    EXECUTE 'CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id)';
  END IF;

  -- programs (created in 002)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='programs') THEN
    EXECUTE 'ALTER TABLE IF EXISTS programs ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can read programs" ON programs';
    EXECUTE 'CREATE POLICY "Anyone can read programs" ON programs FOR SELECT USING (true)';
  END IF;

  -- program_exercises (created in 002)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='program_exercises') THEN
    EXECUTE 'ALTER TABLE IF EXISTS program_exercises ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can read program_exercises" ON program_exercises';
    EXECUTE 'CREATE POLICY "Anyone can read program_exercises" ON program_exercises FOR SELECT USING (true)';
  END IF;
END $$;
