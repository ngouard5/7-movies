
-- Allow anonymous SELECT so insert().select('id') works for anon clients
-- Keep existing authenticated SELECT policies as-is; we just add anon access.

-- 1) game_sessions: public (anon) read
create policy "Public can view game sessions"
on public.game_sessions
for select
to anon
using (true);

-- 2) game_session_movies: public (anon) read
create policy "Public can view game session movies"
on public.game_session_movies
for select
to anon
using (true);
