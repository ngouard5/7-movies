-- Let's ensure our public_game_sessions view is properly secured
-- and check if there are any custom views that might have security definer

-- First, let's recreate our view with explicit security settings to be absolutely sure
DROP VIEW IF EXISTS public.public_game_sessions CASCADE;

-- Create the view with explicit SECURITY INVOKER (which is the default but let's be explicit)
CREATE VIEW public.public_game_sessions 
WITH (security_invoker = true)
AS
SELECT 
  id,
  player_nickname,
  total_time,
  total_score,
  movies_guessed,
  movies_passed,
  created_at,
  player_avatar,
  challenge_id
FROM public.game_sessions;

-- Grant appropriate permissions
GRANT SELECT ON public.public_game_sessions TO anon;
GRANT SELECT ON public.public_game_sessions TO authenticated;

-- Add security documentation
COMMENT ON VIEW public.public_game_sessions IS 
'Secure public view of game sessions that excludes sensitive data (device_id, user_agent, session_hash). 
Uses SECURITY INVOKER for safer permissions and respects RLS policies of the underlying table.';

-- Also ensure we're not exposing any other sensitive views
-- Let's check what other views we might have created
SELECT 
  schemaname,
  viewname,
  viewowner
FROM pg_views 
WHERE schemaname = 'public' 
  AND viewname NOT IN ('public_game_sessions');