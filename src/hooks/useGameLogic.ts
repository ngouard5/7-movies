
import { useState, useEffect, useRef } from "react";
import { movieEmojis } from "@/data/movieEmojis";
import { MovieData } from "@/types/gameTypes";
import { getGameMovies, formatGameTime } from "@/utils/movieUtils";
import { useMovieGuess } from "@/hooks/useMovieGuess";
import { useMovieSearch } from "@/hooks/useMovieSearch";
import { useLanguage } from "@/contexts/LanguageContext";
import { movieTitleTranslations } from "@/data/movieTranslations";

export type { MovieData } from "@/types/gameTypes";

export const useGameLogic = () => {
  const { language } = useLanguage();
  
  const [gameMovies, setGameMovies] = useState<any[]>(() => {
    // Get random movies and translate titles if needed
    const movies = getGameMovies(movieEmojis, 7);
    
    // Apply translations if language is French
    if (language === 'fr') {
      return movies.map(movie => ({
        ...movie,
        title: movieTitleTranslations[movie.title] || movie.title
      }));
    }
    
    return movies;
  });
  
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [movieStartTime, setMovieStartTime] = useState(0);
  const [guessedMovies, setGuessedMovies] = useState<MovieData[]>([]);
  
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
    handleGuess,
    showHint,
    hint
  } = useMovieGuess({
    gameMovies,
    currentMovieIndex,
    setCurrentMovieIndex,
    guessedMovies,
    setGuessedMovies,
    timer,
    movieStartTime,
    timerRef
  });

  // Effect to update movies when language changes
  useEffect(() => {
    // Get the same random movies but with translated titles if needed
    if (language === 'fr') {
      setGameMovies(prevMovies => 
        prevMovies.map(movie => ({
          ...movie,
          title: movieTitleTranslations[movie.originalTitle || movie.title] || movie.title,
          originalTitle: movie.originalTitle || movie.title // Store original title
        }))
      );
    } else {
      setGameMovies(prevMovies => 
        prevMovies.map(movie => ({
          ...movie,
          title: movie.originalTitle || movie.title
        }))
      );
    }
  }, [language]);

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
    showHint,
    hint
  };
};
