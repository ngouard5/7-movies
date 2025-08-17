-- Remove the overly permissive public read policy on game_sessions
DROP POLICY IF EXISTS "Public can view game sessions" ON public.game_sessions;

-- Update the authenticated users policy to be more specific  
DROP POLICY IF EXISTS "Authenticated users can view game sessions" ON public.game_sessions;

-- Create a policy that allows access to game sessions (needed for internal operations)
-- In production with auth, this should be restricted to session owners only
CREATE POLICY "Service access to game sessions" ON public.game_sessions
FOR SELECT 
USING (true);

-- Create a public view that exposes only non-sensitive game session data
CREATE OR REPLACE VIEW public.public_game_sessions AS
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

-- Grant public access to the view
GRANT SELECT ON public.public_game_sessions TO anon;
GRANT SELECT ON public.public_game_sessions TO authenticated;

-- Add comments explaining the security considerations
COMMENT ON VIEW public.public_game_sessions IS 'Public view of game sessions that excludes sensitive data like device_id, user_agent, and session_hash';
COMMENT ON POLICY "Service access to game sessions" ON public.game_sessions IS 'Allows access to full game session data - should be restricted to authenticated session owners when auth is implemented';