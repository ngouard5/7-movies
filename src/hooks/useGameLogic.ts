
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getRandomMovies, movies, type Movie } from "@/data/movies";
import { MovieData } from "@/types/gameTypes";
import { formatGameTime } from "@/utils/movieUtils";
import { useMovieGuess } from "@/hooks/useMovieGuess";

export type { MovieData } from "@/types/gameTypes";

export const useGameLogic = () => {
  const navigate = useNavigate();
  
  // Get random movies for the game
  const [gameMovies] = useState<Movie[]>(() => {
    // Get random movies - all data is already unified in the movies array
    return getRandomMovies(movies, 7);
  });
  
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [movieStartTime, setMovieStartTime] = useState(0);
  const [guessedMovies, setGuessedMovies] = useState<MovieData[]>([]);
  const [passedMovies, setPassedMovies] = useState<MovieData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Import guess handling functionality
  const { 
    wrongGuess, 
    answerStatus, 
    handleGuess,
    showHint,
    hint,
    resetHints,
    requestHint,
    cycleHint,
    showScorePopup,
    lastScore
  } = useMovieGuess({
    gameMovies,
    currentMovieIndex,
    setCurrentMovieIndex,
    guessedMovies,
    setGuessedMovies,
    passedMovies,
    setPassedMovies,
    timer,
    movieStartTime,
    timerRef,
    inputRef
  });

  // Function to handle passing a movie
  const handlePass = () => {
    const currentMovie = gameMovies[currentMovieIndex];
    
    // Reset hints when passing
    resetHints();
    
    // Add to passed movies list
    setPassedMovies(prev => [...prev, currentMovie]);
    
    // Move to next movie or finish game
    if (currentMovieIndex < gameMovies.length - 1) {
      setCurrentMovieIndex(prev => prev + 1);
    } else {
      // Game over, clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Navigate to results page
      const totalScore = guessedMovies.reduce((sum, movie) => sum + (movie.points || 0), 0);
      localStorage.setItem(
        "gameResults",
        JSON.stringify({
          totalTime: timer,
          movies: guessedMovies,
          passedMovies: [...passedMovies, currentMovie],
          score: guessedMovies.length,
          totalScore: totalScore,
          totalMovies: gameMovies.length
        })
      );
      navigate("/results");
    }
  };

  // Start timer when component mounts
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Update movie start time when movie changes (only when movie index changes)
  useEffect(() => {
    setMovieStartTime(timer);
  }, [currentMovieIndex]);

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
    timer,
    wrongGuess,
    inputRef,
    currentMovie,
    handleGuess,
    handlePass,
    formatTime: formatGameTime,
    totalMovies: gameMovies.length,
    answerStatus,
    showHint,
    hint,
    requestHint,
    cycleHint,
    showScorePopup,
    lastScore
  };
};
