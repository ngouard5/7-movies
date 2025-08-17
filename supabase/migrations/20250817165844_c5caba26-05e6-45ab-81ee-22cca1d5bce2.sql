-- Create game sessions table
CREATE TABLE public.game_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_nickname text NOT NULL,
  player_avatar text NOT NULL,
  total_time integer NOT NULL,
  total_score integer NOT NULL DEFAULT 0,
  movies_guessed integer NOT NULL DEFAULT 0,
  movies_passed integer NOT NULL DEFAULT 0,
  device_id text,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create game session movies table
CREATE TABLE public.game_session_movies (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  movie_id text NOT NULL,
  movie_title text NOT NULL,
  movie_emojis text NOT NULL,
  movie_imdb_id text,
  movie_image text,
  french_title text,
  status text NOT NULL CHECK (status IN ('guessed', 'passed')),
  points integer DEFAULT 0,
  guess_time integer,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create game participants table (for future multiplayer)
CREATE TABLE public.game_participants (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  player_nickname text NOT NULL,
  player_avatar text NOT NULL,
  total_time integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_game_sessions_created_at ON public.game_sessions(created_at DESC);
CREATE INDEX idx_game_session_movies_session_id ON public.game_session_movies(session_id);
CREATE INDEX idx_game_session_movies_status ON public.game_session_movies(status);
CREATE INDEX idx_game_participants_session_id ON public.game_participants(session_id);

-- Enable Row Level Security
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_session_movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_participants ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for anonymous users (can insert but not select)
CREATE POLICY "Anyone can insert game sessions" 
ON public.game_sessions 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can insert game session movies" 
ON public.game_session_movies 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can insert game participants" 
ON public.game_participants 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Only authenticated users can view data (for admin stats)
CREATE POLICY "Authenticated users can view game sessions" 
ON public.game_sessions 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view game session movies" 
ON public.game_session_movies 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view game participants" 
ON public.game_participants 
FOR SELECT 
TO authenticated
USING (true);