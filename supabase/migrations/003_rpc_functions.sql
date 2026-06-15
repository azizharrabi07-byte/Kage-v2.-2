-- 003_rpc_functions.sql
-- Helper RPC functions used by the FastAPI backend.
-- Safe to run multiple times: all use CREATE OR REPLACE FUNCTION.

-- 1. Increment workout count for a user
CREATE OR REPLACE FUNCTION increment_workout_count(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE progression
  SET
    workouts_completed = COALESCE(workouts_completed, 0) + 1,
    last_workout_date = NOW(),
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Also update streak: if last workout was yesterday, increment; otherwise reset to 1
  UPDATE progression
  SET streak = CASE
    WHEN last_workout_date::date = NOW()::date - INTERVAL '1 day' THEN COALESCE(streak, 0) + 1
    WHEN last_workout_date::date = NOW()::date THEN streak
    ELSE 1
  END
  WHERE user_id = p_user_id;
END;
$$;

-- 2. Add XP to a user (used by battles and achievements)
CREATE OR REPLACE FUNCTION add_xp(p_user_id UUID, p_amount INT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE progression
  SET
    total_xp = GREATEST(0, COALESCE(total_xp, 0) + p_amount),
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Level up: every 500 XP = 1 level
  UPDATE progression
  SET level = GREATEST(1, FLOOR(COALESCE(total_xp, 0) / 500)::INT + 1)
  WHERE user_id = p_user_id;
END;
$$;

-- 3. Transfer XP between users (for battle wagers)
CREATE OR REPLACE FUNCTION transfer_xp(p_from UUID, p_to UUID, p_amount INT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE progression SET total_xp = GREATEST(0, COALESCE(total_xp, 0) - p_amount), updated_at = NOW() WHERE user_id = p_from;
  UPDATE progression SET total_xp = COALESCE(total_xp, 0) + p_amount, updated_at = NOW() WHERE user_id = p_to;

  -- Recalc levels
  UPDATE progression SET level = GREATEST(1, FLOOR(COALESCE(total_xp, 0) / 500)::INT + 1) WHERE user_id IN (p_from, p_to);
END;
$$;

-- 4. Get or create progression row for a user
CREATE OR REPLACE FUNCTION ensure_progression(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO progression (user_id, total_xp, level, rank_index, streak, workouts_completed, lock_in_sessions)
  VALUES (p_user_id, 0, 1, 0, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;
