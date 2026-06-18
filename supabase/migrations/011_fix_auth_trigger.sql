-- 011_fix_auth_trigger.sql
-- Fixes the auto-create profile trigger to match the actual profiles table schema.
-- The profiles table has: id, username, avatar_url, level, xp, ...
-- NOT: id, email, name (which the old trigger tried to insert)
-- Safe to run multiple times.

-- Drop the broken trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate function with correct columns matching the actual profiles table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
