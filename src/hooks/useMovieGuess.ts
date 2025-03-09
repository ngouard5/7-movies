
import { useState, useCallback } from "react";
import { MovieData } from "@/types/gameTypes";

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

        // Reset wrong guess state
        setWrongGuess(false);

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
      timerRef
    ]
  );

  return {
    wrongGuess,
    answerStatus,
    handleGuess,
  };
};
