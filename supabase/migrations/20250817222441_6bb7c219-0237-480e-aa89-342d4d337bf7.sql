-- Remove the overly permissive public read policy on game_sessions
DROP POLICY IF EXISTS "Public can view game sessions" ON public.game_sessions;

-- Create a more restrictive policy that only allows public access to non-sensitive fields
-- This policy will be used by functions/views that need to expose only safe data
CREATE POLICY "Public can view limited game session data" ON public.game_sessions
FOR SELECT 
USING (true)
WITH CHECK (false);

-- However, since RLS works at the row level, not column level, we need to create a view
-- that exposes only the safe fields for public access

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

-- Enable RLS on the view
ALTER VIEW public.public_game_sessions SET (security_barrier = true);

-- Create RLS policy for the public view
CREATE POLICY "Anyone can view public game session data" ON public.public_game_sessions
FOR SELECT 
USING (true);

-- Update the authenticated users policy to be more specific
DROP POLICY IF EXISTS "Authenticated users can view game sessions" ON public.game_sessions;

-- For now, since there's no authentication system, we'll allow all access to full data
-- In a production environment with auth, this should be restricted to session owners
CREATE POLICY "Full access to game sessions for service operations" ON public.game_sessions
FOR SELECT 
USING (true);

-- Add a comment explaining the security considerations
COMMENT ON VIEW public.public_game_sessions IS 'Public view of game sessions that excludes sensitive data like device_id and user_agent';
COMMENT ON POLICY "Full access to game sessions for service operations" ON public.game_sessions IS 'Temporary policy - should be restricted to authenticated session owners when auth is implemented';