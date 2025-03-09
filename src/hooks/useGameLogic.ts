import { useState, useEffect, useRef } from "react";
import { movieEmojis } from "@/data/movieEmojis";
import { MovieData } from "@/types/gameTypes";
import { getGameMovies, formatGameTime } from "@/utils/movieUtils";
import { useMovieGuess } from "@/hooks/useMovieGuess";
import { useMovieSearch } from "@/hooks/useMovieSearch";

export type { MovieData } from "@/types/gameTypes";

export const useGameLogic = () => {
  const [gameMovies, setGameMovies] = useState<any[]>(() => {
    // Check if this is a challenge with predefined movies
    const challengeMoviesIds = localStorage.getItem("challengeMovies");
    
    if (challengeMoviesIds) {
      try {
        // Parse the movie IDs from the challenge
        const movieIds = JSON.parse(challengeMoviesIds);
        console.log("Challenge movie IDs:", movieIds);
        
        // Find the actual movie objects that match these IDs
        const selectedMovies = movieEmojis.filter(movie => movieIds.includes(movie.id));
        console.log("Selected challenge movies:", selectedMovies);
        
        // Make sure we found all the movies
        if (selectedMovies.length === movieIds.length) {
          // Clear the localStorage item as we've now loaded it
          localStorage.removeItem("challengeMovies");
          return selectedMovies;
        }
      } catch (e) {
        console.error("Error parsing challenge movies:", e);
      }
    }
    
    // Default to random movies if no challenge or if there was an error
    // Changed from 5 to 1 movie
    return getGameMovies(movieEmojis, 1);
  });
  
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [movieStartTime, setMovieStartTime] = useState(0);
  const [guessedMovies, setGuessedMovies] = useState<MovieData[]>([]);
  const [isChallenge, setIsChallenge] = useState(false);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Import search functionality
  const { 
    searchTerm, 
    setSearchTerm, 
    suggestions, 
    isLoading 
  } = useMovieSearch();

  // Import guess handling functionality with correct navigation handling
  const { 
    wrongGuess, 
    answerStatus, 
    handleGuess 
  } = useMovieGuess({
    gameMovies,
    currentMovieIndex,
    setCurrentMovieIndex,
    guessedMovies,
    setGuessedMovies,
    timer,
    movieStartTime,
    isChallenge,
    challengeId,
    timerRef
  });

  // Check if this is a challenge response
  useEffect(() => {
    const currentChallengeId = localStorage.getItem("currentChallengeId");
    if (currentChallengeId) {
      console.log("This is a challenge response for session:", currentChallengeId);
      setIsChallenge(true);
      setChallengeId(currentChallengeId);
      // Don't remove it yet, we'll need it when the game is over
    }
  }, []);

  // Start timer when component mounts
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Update movie start time when movie changes
  useEffect(() => {
    setMovieStartTime(timer);
  }, [currentMovieIndex, timer]);

  // Focus input when component mounts or movie changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentMovieIndex]);

  // Get current movie
  const currentMovie = gameMovies[currentMovieIndex] || gameMovies[0];

  return {
    currentMovieIndex,
    searchTerm,
    setSearchTerm,
    suggestions,
    timer,
    wrongGuess,
    isLoading,
    inputRef,
    currentMovie,
    handleGuess,
    formatTime: formatGameTime,
    totalMovies: gameMovies.length,
    answerStatus
  };
};
