
-- 1) Ajout d'une clé d'idempotence pour les sessions
ALTER TABLE public.game_sessions
ADD COLUMN IF NOT EXISTS session_hash text;

-- Unicité de session_hash (les valeurs NULL restent autorisées et non conflictuelles)
CREATE UNIQUE INDEX IF NOT EXISTS game_sessions_session_hash_key
ON public.game_sessions (session_hash);

-- 2) Nettoyage des doublons dans game_session_movies
-- Supprime toutes les lignes en double en gardant la plus ancienne (plus petit id)
DELETE FROM public.game_session_movies a
USING public.game_session_movies b
WHERE a.id > b.id
  AND a.session_id = b.session_id
  AND a.movie_id = b.movie_id
  AND a.status = b.status;

-- 3) Empêcher les futurs doublons de films par session
-- Crée un index unique sur (session_id, movie_id, status)
CREATE UNIQUE INDEX IF NOT EXISTS game_session_movies_unique_triplet
ON public.game_session_movies (session_id, movie_id, status);
