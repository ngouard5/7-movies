
-- 1) Ajouter l'ordre des films dans une session
ALTER TABLE public.game_session_movies
ADD COLUMN IF NOT EXISTS movie_order integer NOT NULL DEFAULT 0;

-- Index pour charger rapidement les films d'un challenge dans l'ordre
CREATE INDEX IF NOT EXISTS game_session_movies_session_order_idx
ON public.game_session_movies (session_id, movie_order);

-- 2) Lier une partie à un challenge d'origine
ALTER TABLE public.game_sessions
ADD COLUMN IF NOT EXISTS challenge_id uuid NULL;

-- (Optionnel mais recommandé) Contrainte de clé étrangère auto-référente
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'game_sessions_challenge_fk'
  ) THEN
    ALTER TABLE public.game_sessions
    ADD CONSTRAINT game_sessions_challenge_fk
    FOREIGN KEY (challenge_id)
    REFERENCES public.game_sessions(id)
    ON DELETE SET NULL
    DEFERRABLE INITIALLY DEFERRED;
  END IF;
END $$;

-- Index pour filtrer rapidement par challenge
CREATE INDEX IF NOT EXISTS game_sessions_challenge_id_idx
ON public.game_sessions (challenge_id);
