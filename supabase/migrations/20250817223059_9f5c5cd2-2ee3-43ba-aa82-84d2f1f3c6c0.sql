-- CRITICAL SECURITY FIX: Remove public access to sensitive user data

-- Step 1: Remove the overly permissive policy that allows public access to ALL game session data
DROP POLICY IF EXISTS "Service access to game sessions" ON public.game_sessions;

-- Step 2: Create a restrictive policy that completely blocks public access to the main table
-- This ensures sensitive data (device_id, user_agent, session_hash) cannot be accessed by anonymous users
CREATE POLICY "Block public access to sensitive game session data" ON public.game_sessions
FOR SELECT 
USING (false);  -- Completely block public access

-- Step 3: Create a service-level policy for authenticated operations only
-- This will be used by backend services when authentication is implemented
CREATE POLICY "Authenticated service access only" ON public.game_sessions
FOR SELECT 
TO authenticated
USING (true);

-- Step 4: Ensure our secure public view is the ONLY way for public users to access game data
-- (This view excludes device_id, user_agent, session_hash)
GRANT SELECT ON public.public_game_sessions TO anon;
GRANT SELECT ON public.public_game_sessions TO authenticated;

-- Step 5: Revoke any direct table access that might exist
REVOKE SELECT ON public.game_sessions FROM anon;
REVOKE SELECT ON public.game_sessions FROM public;

-- Step 6: Add security documentation
COMMENT ON POLICY "Block public access to sensitive game session data" ON public.game_sessions IS 
'SECURITY: Prevents public access to sensitive user tracking data (device_id, user_agent, session_hash). Public users must use public_game_sessions view instead.';

COMMENT ON POLICY "Authenticated service access only" ON public.game_sessions IS 
'SECURITY: Allows full table access only for authenticated services. Should be further restricted to session owners when user auth is implemented.';