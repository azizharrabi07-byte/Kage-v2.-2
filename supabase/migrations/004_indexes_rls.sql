-- 004_indexes_rls.sql
-- Adds missing indexes and RLS policies across all tables.
-- Safe to run multiple times: uses CREATE INDEX IF NOT EXISTS, DROP POLICY IF EXISTS.

-- ============================================================================
-- INDEXES
-- ============================================================================

-- exercises (index only columns that exist — skip target/muscle_group if absent)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='exercises' AND column_name='category') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_exercises_category ON exercises(category)';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='exercises' AND column_name='difficulty') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON exercises(difficulty)';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='exercises' AND column_name='muscle_group') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_exercises_muscle_group ON exercises(muscle_group)';
  END IF;
END $$;

-- workout_sessions
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_started_at ON workout_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_template_id ON workout_sessions(template_id);

-- session_exercises
CREATE INDEX IF NOT EXISTS idx_session_exercises_session_id ON session_exercises(session_id);
CREATE INDEX IF NOT EXISTS idx_session_exercises_exercise_id ON session_exercises(exercise_id);

-- workout_sets
CREATE INDEX IF NOT EXISTS idx_workout_sets_session_exercise_id ON workout_sets(session_exercise_id);

-- progression
CREATE INDEX IF NOT EXISTS idx_progression_user_id ON progression(user_id);
CREATE INDEX IF NOT EXISTS idx_progression_total_xp ON progression(total_xp DESC);

-- personal_records
CREATE INDEX IF NOT EXISTS idx_personal_records_user_id ON personal_records(user_id);
CREATE INDEX IF NOT EXISTS idx_personal_records_exercise_id ON personal_records(exercise_id);

-- user_achievements
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);

-- battles
CREATE INDEX IF NOT EXISTS idx_battles_challenger_id ON battles(challenger_id);
CREATE INDEX IF NOT EXISTS idx_battles_opponent_id ON battles(opponent_id);
CREATE INDEX IF NOT EXISTS idx_battles_status ON battles(status);

-- xp_breakdown
CREATE INDEX IF NOT EXISTS idx_xp_breakdown_user_id ON xp_breakdown(user_id);

-- body_measurements
CREATE INDEX IF NOT EXISTS idx_body_measurements_user_id ON body_measurements(user_id);

-- workout_templates
CREATE INDEX IF NOT EXISTS idx_workout_templates_user_id ON workout_templates(user_id);

-- template_exercises
CREATE INDEX IF NOT EXISTS idx_template_exercises_template_id ON template_exercises(template_id);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Helper: enable RLS on all tables (safe to run multiple times)
DO $$
BEGIN
  EXECUTE 'ALTER TABLE IF EXISTS workout_sessions ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE IF EXISTS session_exercises ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE IF EXISTS workout_sets ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE IF EXISTS progression ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE IF EXISTS xp_breakdown ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE IF EXISTS personal_records ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE IF EXISTS user_achievements ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE IF EXISTS battles ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE IF EXISTS body_measurements ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE IF EXISTS workout_templates ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE IF EXISTS template_exercises ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE IF EXISTS nutrition_logs ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE IF EXISTS bounties ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE IF EXISTS user_bounties ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE IF EXISTS exercises ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE IF EXISTS achievements ENABLE ROW LEVEL SECURITY';
END $$;

-- Exercises: all authenticated users can read
DROP POLICY IF EXISTS "Anyone can read exercises" ON exercises;
CREATE POLICY "Anyone can read exercises"
  ON exercises FOR SELECT
  USING (true);

-- Workout sessions: users own their data
DROP POLICY IF EXISTS "Users own their workout sessions" ON workout_sessions;
CREATE POLICY "Users own their workout sessions"
  ON workout_sessions FOR ALL
  USING (auth.uid() = user_id);

-- Session exercises: inherited ownership via session
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

-- Workout sets: inherited ownership
DROP POLICY IF EXISTS "Users own workout sets" ON workout_sets;
CREATE POLICY "Users own workout sets"
  ON workout_sets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM session_exercises
      JOIN workout_sessions ON workout_sessions.id = session_exercises.session_id
      WHERE session_exercises.id = workout_sets.session_exercise_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

-- Progression: users own their row
DROP POLICY IF EXISTS "Users own their progression" ON progression;
CREATE POLICY "Users own their progression"
  ON progression FOR ALL
  USING (auth.uid() = user_id);

-- XP breakdown: users own their entries
DROP POLICY IF EXISTS "Users own their xp breakdown" ON xp_breakdown;
CREATE POLICY "Users own their xp breakdown"
  ON xp_breakdown FOR ALL
  USING (auth.uid() = user_id);

-- Personal records: users own their records
DROP POLICY IF EXISTS "Users own their personal records" ON personal_records;
CREATE POLICY "Users own their personal records"
  ON personal_records FOR ALL
  USING (auth.uid() = user_id);

-- Achievements: public read, system writes
DROP POLICY IF EXISTS "Anyone can read achievements" ON achievements;
CREATE POLICY "Anyone can read achievements"
  ON achievements FOR SELECT
  USING (true);

-- User achievements: users can read own
DROP POLICY IF EXISTS "Users can read own achievements" ON user_achievements;
CREATE POLICY "Users can read own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

-- Battles: participants can read/update
DROP POLICY IF EXISTS "Participants can read battles" ON battles;
CREATE POLICY "Participants can read battles"
  ON battles FOR SELECT
  USING (auth.uid() = challenger_id OR auth.uid() = opponent_id);

DROP POLICY IF EXISTS "Participants can update battles" ON battles;
CREATE POLICY "Participants can update battles"
  ON battles FOR UPDATE
  USING (auth.uid() = challenger_id OR auth.uid() = opponent_id);

DROP POLICY IF EXISTS "Users can create battles" ON battles;
CREATE POLICY "Users can create battles"
  ON battles FOR INSERT
  WITH CHECK (auth.uid() = challenger_id);

-- Body measurements: users own their data
DROP POLICY IF EXISTS "Users own their body measurements" ON body_measurements;
CREATE POLICY "Users own their body measurements"
  ON body_measurements FOR ALL
  USING (auth.uid() = user_id);

-- Workout templates: users own their templates
DROP POLICY IF EXISTS "Users own their workout templates" ON workout_templates;
CREATE POLICY "Users own their workout templates"
  ON workout_templates FOR ALL
  USING (auth.uid() = user_id);

-- Template exercises: inherited ownership
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

-- Nutrition logs: users own their logs
DROP POLICY IF EXISTS "Users own their nutrition logs" ON nutrition_logs;
CREATE POLICY "Users own their nutrition logs"
  ON nutrition_logs FOR ALL
  USING (auth.uid() = user_id);

-- Bounties: public read
DROP POLICY IF EXISTS "Anyone can read bounties" ON bounties;
CREATE POLICY "Anyone can read bounties"
  ON bounties FOR SELECT
  USING (true);

-- User bounties: users own their bounty progress
DROP POLICY IF EXISTS "Users own their bounty progress" ON user_bounties;
CREATE POLICY "Users own their bounty progress"
  ON user_bounties FOR ALL
  USING (auth.uid() = user_id);
