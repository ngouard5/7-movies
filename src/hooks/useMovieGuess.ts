import { useState, useCallback } from "react";
import { MovieData } from "@/types/gameTypes";
import { getRandomErrorMessage } from "@/utils/movieUtils";

interface UseMovieGuessProps {
  gameMovies: MovieData[];
  currentMovieIndex: number;
  setCurrentMovieIndex: React.Dispatch<React.SetStateAction<number>>;
  guessedMovies: MovieData[];
  setGuessedMovies: React.Dispatch<React.SetStateAction<MovieData[]>>;
  timer: number;
  movieStartTime: number;
  timerRef: React.MutableRefObject<NodeJS.Timeout | null>;
}

export const useMovieGuess = ({
  gameMovies,
  currentMovieIndex,
  setCurrentMovieIndex,
  guessedMovies,
  setGuessedMovies,
  timer,
  movieStartTime,
  timerRef
}: UseMovieGuessProps) => {
  const [wrongGuess, setWrongGuess] = useState(false);
  const [answerStatus, setAnswerStatus] = useState<"wrong" | "correct" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [hint, setHint] = useState("");

  // Generate a first hint for the current movie - using French title
  const generateFirstHint = useCallback((movie: MovieData) => {
    // Use French title for the hint
    const title = movie.frenchTitle || movie.title;
    
    // Extract first letter of the movie
    const firstLetter = title.charAt(0);
    
    // Count total words
    const wordCount = title.split(" ").length;
    
    // Create hint text
    return `Hint: Title starts with "${firstLetter}" and has ${wordCount} word${wordCount > 1 ? 's' : ''}.`;
  }, []);

  // Generate a second hint showing first letter of each word - using French title
  const generateSecondHint = useCallback((movie: MovieData) => {
    // Use French title for the hint
    const title = movie.frenchTitle || movie.title;
    
    // Split the title into words and get first letter of each
    const words = title.split(" ");
    const firstLetters = words.map(word => word.charAt(0).toUpperCase()).join(" ");
    
    // Create hint text
    return `Hint: First letters of each word: ${firstLetters}`;
  }, []);

  // Functions
  const handleGuess = useCallback(
    (guess: string) => {
      const currentMovie = gameMovies[currentMovieIndex];
      if (!currentMovie) return;

      // Compare with both English and French titles
      const englishMatch = guess.toLowerCase() === currentMovie.title.toLowerCase();
      const frenchMatch = currentMovie.frenchTitle && 
                          guess.toLowerCase() === currentMovie.frenchTitle.toLowerCase();

      if (englishMatch || frenchMatch) {
        // Correct guess
        const guessTimeMs = (timer - movieStartTime) * 1000;
        const updatedMovie = {
          ...currentMovie,
          guessTime: guessTimeMs,
        };

        setAnswerStatus("correct");
        setGuessedMovies((prev) => [...prev, updatedMovie]);

        // Reset wrong guess state and hint
        setWrongGuess(false);
        setShowHint(false);
        setErrorCount(0);

        // Move to next movie or finish game
        if (currentMovieIndex < gameMovies.length - 1) {
          setTimeout(() => {
            setCurrentMovieIndex((prev) => prev + 1);
            setAnswerStatus(null);
          }, 1000);
        } else {
          // Game over, clear timer
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          
          // Navigate to results page after a delay to see the "correct" animation
          setTimeout(() => {
            localStorage.setItem(
              "gameResults",
              JSON.stringify({
                totalTime: timer,
                movies: [...guessedMovies, updatedMovie],
              })
            );
            window.location.href = "/results";
          }, 1000);
        }
      } else {
        // Wrong guess
        setWrongGuess(true);
        setAnswerStatus("wrong");
        
        // Increment error count
        const newErrorCount = errorCount + 1;
        setErrorCount(newErrorCount);
        
        // Show different hints based on error count
        if (newErrorCount === 1) {
          // First hint after first error
          setShowHint(true);
          setHint(generateFirstHint(currentMovie));
        } else if (newErrorCount === 2) {
          // Second hint after second error - first letter of each word
          setShowHint(true);
          setHint(generateSecondHint(currentMovie));
        } else {
          // Keep showing the second hint for subsequent errors
          setShowHint(true);
          // Keep the second hint for all subsequent errors
          setHint(generateSecondHint(currentMovie));
        }

        // Reset the answer status after a short delay
        setTimeout(() => {
          setAnswerStatus(null);
        }, 800);
      }
    },
    [
      gameMovies,
      currentMovieIndex,
      setCurrentMovieIndex,
      timer,
      movieStartTime,
      guessedMovies,
      setGuessedMovies,
      timerRef,
      errorCount,
      generateFirstHint,
      generateSecondHint
    ]
  );

  return {
    wrongGuess,
    answerStatus,
    handleGuess,
    showHint,
    hint
  };
};
