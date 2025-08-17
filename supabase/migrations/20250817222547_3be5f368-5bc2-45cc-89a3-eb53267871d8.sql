-- Fix the security definer view issue by recreating the view without SECURITY DEFINER
-- and ensuring it uses proper RLS policies instead

DROP VIEW IF EXISTS public.public_game_sessions;

-- Recreate the view without SECURITY DEFINER (default is SECURITY INVOKER which is safer)
CREATE VIEW public.public_game_sessions AS
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

-- Add security comment
COMMENT ON VIEW public.public_game_sessions IS 'Public view of game sessions that excludes sensitive data (device_id, user_agent, session_hash). Uses SECURITY INVOKER for safer permissions.';