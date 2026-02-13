
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
    
    const response = await fetch(
      `https://beibpjlcoriuebctohcm.supabase.co/functions/v1/get-challenge-movies?sessionId=${encodeURIComponent(sessionId)}`,
      {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlaWJwamxjb3JpdWViY3RvaGNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NDg3NDcsImV4cCI6MjA3MTAyNDc0N30.KJ3VQN-HQ_Mk92Macxd4YKtg4QyN5nkrzkdOnFUAUYQ',
        },
      }
    );

    if (!response.ok) {
      console.error('Error fetching challenge movies:', response.statusText);
      return null;
    }

    const { movies } = await response.json();

    if (!movies || movies.length === 0) {
      console.warn('No movies found for challenge session:', sessionId);
      return null;
    }

    const challengeMovies: Movie[] = movies.map((movie: any) => ({
      id: parseInt(movie.movie_id),
      title: movie.movie_title,
      emojis: movie.movie_emojis,
      imdbID: movie.movie_imdb_id || '',
      image: movie.movie_image,
      frenchTitle: movie.french_title,
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
  localStorage.removeItem('challengeSourceScore');
}

/**
 * Fetch challenge session information (nickname and score)
 */
export async function getChallengeSessionInfo(sessionId: string): Promise<ChallengeSessionInfo | null> {
  try {
    console.log("Fetching challenge session info for:", sessionId);
    
    // Use the secure public view that excludes sensitive data
    const { data: sessionData, error } = await supabase
      .from('public_game_sessions')
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
