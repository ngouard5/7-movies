import { supabase } from "@/integrations/supabase/client";
import type { MovieData } from "@/types/gameTypes";

export interface GameSessionData {
  playerNickname: string;
  playerAvatar: string;
  totalTime: number;
  totalScore: number;
  moviesGuessed: number;
  moviesPassed: number;
  deviceId?: string;
  userAgent?: string;
  guessedMovies: MovieData[];
  passedMovies: MovieData[];
}

export interface GameStats {
  totalSessions: number;
  totalMoviesGuessed: number;
  averageScore: number;
  averageTime: number;
  topMovies: Array<{
    title: string;
    timesGuessed: number;
    averageTime: number;
  }>;
  recentSessions: Array<{
    id: string;
    playerNickname: string;
    totalScore: number;
    totalTime: number;
    createdAt: string;
  }>;
}

// Generate a simple device ID based on browser fingerprint
function generateDeviceId(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx?.fillText('fingerprint', 2, 2);
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
}

// Generate a deterministic session hash based on game data
function generateSessionHash(data: GameSessionData): string {
  const sessionData = [
    data.playerNickname,
    data.playerAvatar,
    data.totalTime,
    data.totalScore,
    data.moviesGuessed,
    data.moviesPassed,
    // Include movie titles to make session unique
    data.guessedMovies.map(m => m.title).sort().join(','),
    data.passedMovies.map(m => m.title).sort().join(','),
    Date.now().toString() // Add timestamp to ensure uniqueness
  ].join('|');
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < sessionData.length; i++) {
    const char = sessionData.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return Math.abs(hash).toString(36);
}

export async function saveGameSession(data: GameSessionData): Promise<string | null> {
  try {
    const sessionHash = generateSessionHash(data);
    const deviceId = data.deviceId || generateDeviceId();
    const userAgent = data.userAgent || navigator.userAgent;

    // Use upsert to avoid duplicates based on session_hash
    const { data: session, error: sessionError } = await supabase
      .from('game_sessions')
      .upsert({
        session_hash: sessionHash,
        player_nickname: data.playerNickname,
        player_avatar: data.playerAvatar,
        total_time: data.totalTime,
        total_score: data.totalScore,
        movies_guessed: data.moviesGuessed,
        movies_passed: data.moviesPassed,
        device_id: deviceId,
        user_agent: userAgent,
      }, {
        onConflict: 'session_hash',
        ignoreDuplicates: false
      })
      .select('id')
      .single();

    if (sessionError || !session) {
      console.error('Error saving game session:', sessionError);
      return null;
    }

    // Save all movies (guessed and passed) using upsert to avoid duplicates
    const allMovies = [
      ...data.guessedMovies.map(movie => ({
        session_id: session.id,
        movie_id: movie.id.toString(),
        movie_title: movie.title,
        movie_emojis: movie.emojis,
        movie_imdb_id: movie.imdbID,
        movie_image: movie.image,
        french_title: movie.frenchTitle,
        status: 'guessed' as const,
        points: movie.points,
        guess_time: movie.guessTime,
      })),
      ...data.passedMovies.map(movie => ({
        session_id: session.id,
        movie_id: movie.id.toString(),
        movie_title: movie.title,
        movie_emojis: movie.emojis,
        movie_imdb_id: movie.imdbID,
        movie_image: movie.image,
        french_title: movie.frenchTitle,
        status: 'passed' as const,
        points: 0,
        guess_time: null,
      }))
    ];

    if (allMovies.length > 0) {
      // Use upsert based on the unique constraint (session_id, movie_id, status)
      const { error: moviesError } = await supabase
        .from('game_session_movies')
        .upsert(allMovies, {
          onConflict: 'session_id,movie_id,status',
          ignoreDuplicates: true
        });

      if (moviesError) {
        console.error('Error saving game session movies:', moviesError);
        // Don't fail the entire operation if movies fail to save
      }
    }

    return session.id;
  } catch (error) {
    console.error('Unexpected error saving game session:', error);
    return null;
  }
}

export async function getGameStats(): Promise<GameStats | null> {
  try {
    // Get total sessions and basic stats
    const { data: sessions, error: sessionsError } = await supabase
      .from('game_sessions')
      .select('id, total_score, total_time, movies_guessed')
      .order('created_at', { ascending: false });

    if (sessionsError) {
      console.error('Error fetching game sessions:', sessionsError);
      return null;
    }

    const totalSessions = sessions.length;
    const totalMoviesGuessed = sessions.reduce((sum, s) => sum + s.movies_guessed, 0);
    const averageScore = totalSessions > 0 ? sessions.reduce((sum, s) => sum + s.total_score, 0) / totalSessions : 0;
    const averageTime = totalSessions > 0 ? sessions.reduce((sum, s) => sum + s.total_time, 0) / totalSessions : 0;

    // Get top movies
    const { data: movies, error: moviesError } = await supabase
      .from('game_session_movies')
      .select('movie_title, guess_time')
      .eq('status', 'guessed');

    if (moviesError) {
      console.error('Error fetching movies:', moviesError);
      return null;
    }

    // Calculate top movies stats
    const movieStats = movies.reduce((acc, movie) => {
      if (!acc[movie.movie_title]) {
        acc[movie.movie_title] = {
          title: movie.movie_title,
          timesGuessed: 0,
          totalTime: 0,
        };
      }
      acc[movie.movie_title].timesGuessed += 1;
      if (movie.guess_time) {
        acc[movie.movie_title].totalTime += movie.guess_time;
      }
      return acc;
    }, {} as Record<string, { title: string; timesGuessed: number; totalTime: number }>);

    const topMovies = Object.values(movieStats)
      .map(movie => ({
        title: movie.title,
        timesGuessed: movie.timesGuessed,
        averageTime: movie.timesGuessed > 0 ? Math.round(movie.totalTime / movie.timesGuessed) : 0,
      }))
      .sort((a, b) => b.timesGuessed - a.timesGuessed)
      .slice(0, 10);

    // Get recent sessions with player info
    const { data: recentSessions, error: recentError } = await supabase
      .from('game_sessions')
      .select('id, player_nickname, total_score, total_time, created_at')
      .order('created_at', { ascending: false })
      .limit(20);

    if (recentError) {
      console.error('Error fetching recent sessions:', recentError);
      return null;
    }

    return {
      totalSessions,
      totalMoviesGuessed,
      averageScore: Math.round(averageScore),
      averageTime: Math.round(averageTime),
      topMovies,
      recentSessions: (recentSessions || []).map(session => ({
        id: session.id,
        playerNickname: session.player_nickname,
        totalScore: session.total_score,
        totalTime: session.total_time,
        createdAt: session.created_at,
      })),
    };
  } catch (error) {
    console.error('Unexpected error fetching game stats:', error);
    return null;
  }
}
