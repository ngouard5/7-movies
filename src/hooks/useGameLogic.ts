
import { useState, useEffect, useRef } from "react";
import { movieEmojis } from "@/data/movieEmojis";
import { MovieData } from "@/types/gameTypes";
import { getGameMovies, formatGameTime } from "@/utils/movieUtils";
import { useMovieGuess } from "@/hooks/useMovieGuess";
import { useMovieSearch } from "@/hooks/useMovieSearch";
import { isFirestoreWorking } from "@/services/firebase";
import { toast } from "sonner";

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
  const [firebaseConnected, setFirebaseConnected] = useState(isFirestoreWorking());
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Monitor Firebase connection status
  useEffect(() => {
    const checkFirebaseStatus = () => {
      const isConnected = isFirestoreWorking() && navigator.onLine;
      setFirebaseConnected(isConnected);
    };
    
    // Check immediately
    checkFirebaseStatus();
    
    // Then check whenever the online status changes
    window.addEventListener('online', checkFirebaseStatus);
    window.addEventListener('offline', checkFirebaseStatus);
    
    // If Firebase isn't working on start, show a toast
    if (!isFirestoreWorking()) {
      toast.warning("Firebase connection issue", {
        description: "The app will work offline, but data won't sync with the server",
        duration: 5000
      });
    }
    
    return () => {
      window.removeEventListener('online', checkFirebaseStatus);
      window.removeEventListener('offline', checkFirebaseStatus);
    };
  }, []);

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

  // Get current movie with safety check
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
    answerStatus,
    firebaseConnected
  };
};
