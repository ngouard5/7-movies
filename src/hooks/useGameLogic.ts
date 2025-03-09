
import { useState, useEffect, useRef } from "react";
import { movieEmojis } from "@/data/movieEmojis";
import { MovieData } from "@/types/gameTypes";
import { getGameMovies, formatGameTime } from "@/utils/movieUtils";
import { useMovieGuess } from "@/hooks/useMovieGuess";
import { useMovieSearch } from "@/hooks/useMovieSearch";

// Change the re-export to use 'export type'
export type { MovieData } from "@/types/gameTypes";

export const useGameLogic = () => {
  const [gameMovies, setGameMovies] = useState(() => getGameMovies(movieEmojis, 1)); // Reduced to 1 for testing
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

  // Import guess handling functionality
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

  // Set movie start time when movie changes
  useEffect(() => {
    setMovieStartTime(timer);
  }, [currentMovieIndex, timer]);

  // Focus input when component mounts or movie changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentMovieIndex]);

  const currentMovie = gameMovies[currentMovieIndex];

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
