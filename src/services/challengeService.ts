
import { supabase } from "@/integrations/supabase/client";
import type { Movie } from "@/data/movies";

interface ChallengeSessionInfo {
  playerNickname: string;
  totalScore: number;
}

export interface ChallengeMovieData {
  id: number;
  emojis: string;
  title: string;
  imdbID: string;
  image?: string;
  frenchTitle?: string;
  genre?: string;
  year?: number;
  director?: string;
  mainActor?: string;
  order: number;
}

export async function getChallengeMovies(sessionId: string): Promise<Movie[] | null> {
  try {
    console.log("Fetching challenge movies for session:", sessionId);
    
    const { data: movies, error } = await supabase
      .from('game_session_movies')
      .select('*')
      .eq('session_id', sessionId)
      .order('movie_order', { ascending: true });

    if (error) {
      console.error('Error fetching challenge movies:', error);
      return null;
    }

    if (!movies || movies.length === 0) {
      console.warn('No movies found for challenge session:', sessionId);
      return null;
    }

    // Convert database movies to Movie format
    // Note: Only use properties that exist in the database
    const challengeMovies: Movie[] = movies.map(movie => ({
      id: parseInt(movie.movie_id),
      title: movie.movie_title,
      emojis: movie.movie_emojis,
      imdbID: movie.movie_imdb_id || '',
      image: movie.movie_image,
      frenchTitle: movie.french_title
      // Note: genre, year, director, mainActor are not stored in game_session_movies
      // so we don't include them here
    }));

    console.log("Challenge movies loaded:", challengeMovies.length);
    return challengeMovies;
  } catch (error) {
    console.error('Unexpected error fetching challenge movies:', error);
    return null;
  }
}

export function setChallengeData(movies: Movie[], sourceSessionId: string) {
  localStorage.setItem('challengeMovies', JSON.stringify(movies));
  localStorage.setItem('challengeSourceSessionId', sourceSessionId);
}

export function getChallengeData(): { movies: Movie[]; sourceSessionId: string } | null {
  try {
    const moviesStr = localStorage.getItem('challengeMovies');
    const sourceSessionId = localStorage.getItem('challengeSourceSessionId');
    
    if (!moviesStr || !sourceSessionId) {
      return null;
    }
    
    const movies = JSON.parse(moviesStr);
    return { movies, sourceSessionId };
  } catch (error) {
    console.error('Error getting challenge data:', error);
    return null;
  }
}

export function clearChallengeData() {
  localStorage.removeItem('challengeMovies');
  localStorage.removeItem('challengeSourceSessionId');
}

/**
 * Fetch challenge session information (nickname and score)
 */
export async function getChallengeSessionInfo(sessionId: string): Promise<ChallengeSessionInfo | null> {
  try {
    console.log("Fetching challenge session info for:", sessionId);
    
    const { data: sessionData, error } = await supabase
      .from('game_sessions')
      .select('player_nickname, total_score')
      .eq('id', sessionId)
      .single();

    if (error) {
      console.error("Error fetching challenge session info:", error);
      return null;
    }

    if (!sessionData) {
      console.log("No session data found for session ID:", sessionId);
      return null;
    }

    return {
      playerNickname: sessionData.player_nickname,
      totalScore: sessionData.total_score
    };
  } catch (error) {
    console.error("Error fetching challenge session info:", error);
    return null;
  }
}
