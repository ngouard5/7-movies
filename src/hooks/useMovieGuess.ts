
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

  // Generate a hint for the current movie
  const generateHint = useCallback((title: string) => {
    // Extract first letter of the movie
    const firstLetter = title.charAt(0);
    
    // Count total words
    const wordCount = title.split(" ").length;
    
    // Create hint text
    return `Hint: Title starts with "${firstLetter}" and has ${wordCount} word${wordCount > 1 ? 's' : ''}.`;
  }, []);

  // Functions
  const handleGuess = useCallback(
    (guess: string) => {
      const currentMovie = gameMovies[currentMovieIndex];
      if (!currentMovie) return;

      if (guess.toLowerCase() === currentMovie.title.toLowerCase()) {
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
        
        // Show hint after first error
        if (newErrorCount === 1) {
          setShowHint(true);
          setHint(generateHint(currentMovie.title));
        } else {
          // Generate a random error message for subsequent errors
          setWrongGuess(true);
          setHint(getRandomErrorMessage(currentMovie.title));
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
      generateHint
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
