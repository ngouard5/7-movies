
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MovieData } from "@/types/gameTypes";
import { getRandomErrorMessage } from "@/utils/movieUtils";
import { calculateScore } from "@/utils/scoreCalculator";
import { isFuzzyMatch, isMovieVariant, getSuggestion } from "@/utils/fuzzyMatching";
import { getDecade } from "@/data/movieDetails";

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
  const navigate = useNavigate();
  const [wrongGuess, setWrongGuess] = useState(false);
  const [answerStatus, setAnswerStatus] = useState<"wrong" | "correct" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [hint, setHint] = useState("");
  const [showScorePopup, setShowScorePopup] = useState(false);
  const [lastScore, setLastScore] = useState<{basePoints: number, speedBonus: number, totalPoints: number, guessedMovie: MovieData} | null>(null);

  // Helper function to generate first letters + word count hint
  const generateLettersAndWordsHint = useCallback((movie: MovieData) => {
    // Use French title for the hint
    const title = movie.frenchTitle || movie.title;
    
    // Split the title into words and get first letter of each
    const words = title.split(" ");
    const firstLetters = words.map(word => word.charAt(0).toUpperCase()).join(" ");
    const wordCount = words.length;
    
    // Create hint text
    return `Indice : ${firstLetters} (${wordCount} mot${wordCount > 1 ? 's' : ''})`;
  }, []);

  // Generate first hint: Genre + decade, fallback to letters + words
  const generateFirstHint = useCallback((movie: MovieData) => {
    const hasGenre = movie.genre && movie.genre.trim() !== "";
    const hasYear = movie.year && movie.year > 0;
    
    if (hasGenre && hasYear) {
      const decade = getDecade(movie.year);
      return `Indice : ${movie.genre}, ${decade}`;
    } else {
      // Fallback to letters + words if genre or year missing
      return generateLettersAndWordsHint(movie);
    }
  }, [generateLettersAndWordsHint]);

  // Generate second hint: First letters + word count - using French title
  const generateSecondHint = useCallback((movie: MovieData) => {
    return generateLettersAndWordsHint(movie);
  }, [generateLettersAndWordsHint]);

  // Generate third hint: Main actor or director, fallback to letters + words
  const generateThirdHint = useCallback((movie: MovieData) => {
    const hasActor = movie.mainActor && movie.mainActor.trim() !== "";
    const hasDirector = movie.director && movie.director.trim() !== "";
    
    if (hasActor && hasDirector) {
      // Randomly choose between main actor and director
      const showActor = Math.random() > 0.5;
      if (showActor) {
        return `Indice : Avec ${movie.mainActor}`;
      } else {
        return `Indice : Réalisé par ${movie.director}`;
      }
    } else if (hasActor) {
      return `Indice : Avec ${movie.mainActor}`;
    } else if (hasDirector) {
      return `Indice : Réalisé par ${movie.director}`;
    } else {
      // Fallback to letters + words if no actor/director info
      return generateLettersAndWordsHint(movie);
    }
  }, [generateLettersAndWordsHint]);

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

        // Show score popup with the movie we just guessed
        setLastScore({ basePoints, speedBonus, totalPoints: points, guessedMovie: updatedMovie });
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
            navigate("/results");
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
          // First hint: Genre + decade
          setShowHint(true);
          const baseHint = generateFirstHint(currentMovie);
          setHint(suggestion ? `${baseHint} ${suggestion}` : baseHint);
        } else if (newErrorCount === 2) {
          // Second hint: First letters + word count
          setShowHint(true);
          const baseHint = generateSecondHint(currentMovie);
          setHint(suggestion ? `${baseHint} ${suggestion}` : baseHint);
        } else {
          // Third hint and beyond: Main actor/director
          setShowHint(true);
          const baseHint = generateThirdHint(currentMovie);
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
      generateSecondHint,
      generateThirdHint
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
