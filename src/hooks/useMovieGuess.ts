
import { useState, useCallback } from "react";
import { MovieData } from "@/types/gameTypes";
import { getRandomErrorMessage } from "@/utils/movieUtils";
import { calculateScore } from "@/utils/scoreCalculator";
import { isFuzzyMatch, isMovieVariant, getSuggestion } from "@/utils/fuzzyMatching";

interface UseMovieGuessProps {
  gameMovies: MovieData[];
  currentMovieIndex: number;
  setCurrentMovieIndex: React.Dispatch<React.SetStateAction<number>>;
  guessedMovies: MovieData[];
  setGuessedMovies: React.Dispatch<React.SetStateAction<MovieData[]>>;
  passedMovies: MovieData[];
  setPassedMovies: React.Dispatch<React.SetStateAction<MovieData[]>>;
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
  passedMovies,
  setPassedMovies,
  timer,
  movieStartTime,
  timerRef
}: UseMovieGuessProps) => {
  const [wrongGuess, setWrongGuess] = useState(false);
  const [answerStatus, setAnswerStatus] = useState<"wrong" | "correct" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [hint, setHint] = useState("");
  const [showScorePopup, setShowScorePopup] = useState(false);
  const [lastScore, setLastScore] = useState<{basePoints: number, speedBonus: number, totalPoints: number} | null>(null);

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

      // Use fuzzy matching for both English and French titles
      const englishMatch = isFuzzyMatch(guess, currentMovie.title) || isMovieVariant(guess, currentMovie.title);
      const frenchMatch = currentMovie.frenchTitle && 
                          (isFuzzyMatch(guess, currentMovie.frenchTitle) || isMovieVariant(guess, currentMovie.frenchTitle));

      if (englishMatch || frenchMatch) {
        // Correct guess
        const guessTimeMs = (timer - movieStartTime) * 1000;
        const points = calculateScore(guessTimeMs);
        
        // Calculate base points and speed bonus for popup
        const basePoints = 100;
        const speedBonus = points - basePoints;
        
        const updatedMovie = {
          ...currentMovie,
          guessTime: guessTimeMs,
          points: points,
        };

        setAnswerStatus("correct");
        setGuessedMovies((prev) => [...prev, updatedMovie]);

        // Show score popup
        setLastScore({ basePoints, speedBonus, totalPoints: points });
        setShowScorePopup(true);
        
        // Hide score popup after 2.5 seconds
        setTimeout(() => {
          setShowScorePopup(false);
        }, 2500);

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
            const allGuessedMovies = [...guessedMovies, updatedMovie];
            const totalScore = allGuessedMovies.reduce((sum, movie) => sum + (movie.points || 0), 0);
            localStorage.setItem(
              "gameResults",
              JSON.stringify({
                totalTime: timer,
                movies: allGuessedMovies,
                passedMovies: passedMovies,
                score: guessedMovies.length + 1,
                totalScore: totalScore,
                totalMovies: gameMovies.length
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
        
        // Check if we can provide a suggestion for close matches
        const suggestion = getSuggestion(guess, currentMovie.title) || 
                          (currentMovie.frenchTitle ? getSuggestion(guess, currentMovie.frenchTitle) : null);
        
        // Show different hints based on error count
        if (newErrorCount === 1) {
          // First hint after first error, with suggestion if available
          setShowHint(true);
          const baseHint = generateFirstHint(currentMovie);
          setHint(suggestion ? `${baseHint} ${suggestion}` : baseHint);
        } else if (newErrorCount === 2) {
          // Second hint after second error - first letter of each word
          setShowHint(true);
          const baseHint = generateSecondHint(currentMovie);
          setHint(suggestion ? `${baseHint} ${suggestion}` : baseHint);
        } else {
          // Keep showing the second hint for subsequent errors
          setShowHint(true);
          const baseHint = generateSecondHint(currentMovie);
          setHint(suggestion ? `${baseHint} ${suggestion}` : baseHint);
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
      passedMovies,
      timerRef,
      errorCount,
      generateFirstHint,
      generateSecondHint
    ]
  );

  // Function to reset hints (for passing movies)
  const resetHints = useCallback(() => {
    setWrongGuess(false);
    setShowHint(false);
    setHint("");
    setErrorCount(0);
    setAnswerStatus(null);
  }, []);

  return {
    wrongGuess,
    answerStatus,
    handleGuess,
    showHint,
    hint,
    resetHints,
    showScorePopup,
    lastScore
  };
};
