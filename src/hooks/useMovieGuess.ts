
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MovieData } from "@/types/gameTypes";
import { getRandomErrorMessage } from "@/utils/movieUtils";
import { calculateScore } from "@/utils/scoreCalculator";
import { isFuzzyMatch, isMovieVariant, getSuggestion } from "@/utils/fuzzyMatching";
import { getDecade } from "@/data/movies";
import { useLanguage } from "@/contexts/LanguageContext";

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
  inputRef: React.RefObject<HTMLInputElement>;
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
  timerRef,
  inputRef
}: UseMovieGuessProps) => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [wrongGuess, setWrongGuess] = useState(false);
  const [answerStatus, setAnswerStatus] = useState<"wrong" | "correct" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [hint, setHint] = useState("");
  const [uniqueHints, setUniqueHints] = useState<string[]>([]);
  const [showScorePopup, setShowScorePopup] = useState(false);
  const [lastScore, setLastScore] = useState<{basePoints: number, speedBonus: number, totalPoints: number, guessedMovie: MovieData} | null>(null);

  // Helper function to generate first letters + word count hint
  const generateLettersAndWordsHint = useCallback((movie: MovieData) => {
    // Choose title based on interface language
    const title = language === 'fr' ? (movie.frenchTitle || movie.title) : movie.title;
    
    // Split the title into words and get first letter of each
    const words = title.split(" ");
    const firstLetters = words.map(word => word.charAt(0).toUpperCase()).join(" ");
    const wordCount = words.length;
    
    // Create localized hint text
    return `${t('hint.label')}: ${firstLetters} (${wordCount} ${wordCount > 1 ? t('words') : t('word')})`;
  }, [language, t]);

  // Generate first hint: Genre + decade
  const generateFirstHint = useCallback((movie: MovieData) => {
    const hasGenre = movie.genre && movie.genre.trim() !== "";
    const hasYear = movie.year && movie.year > 0;
    
    if (hasGenre && hasYear) {
      const decade = getDecade(movie.year);
      return `${t('hint.label')}: ${movie.genre}, ${decade}`;
    } else {
      // Fallback to letters + words if genre or year missing
      return generateLettersAndWordsHint(movie);
    }
  }, [generateLettersAndWordsHint, t]);

  // Generate second hint: Director
  const generateSecondHint = useCallback((movie: MovieData) => {
    const hasDirector = movie.director && movie.director.trim() !== "";
    
    if (hasDirector) {
      return `${t('hint.label')}: ${t('hint.directed.by')} ${movie.director}`;
    } else {
      // Fallback to letters + words if no director info
      return generateLettersAndWordsHint(movie);
    }
  }, [generateLettersAndWordsHint, t]);

  // Generate third hint: Main actor
  const generateThirdHint = useCallback((movie: MovieData) => {
    const hasActor = movie.mainActor && movie.mainActor.trim() !== "";
    
    if (hasActor) {
      return `${t('hint.label')}: ${t('hint.starring')} ${movie.mainActor}`;
    } else {
      // Fallback to letters + words if no actor info
      return generateLettersAndWordsHint(movie);
    }
  }, [generateLettersAndWordsHint, t]);

  // Generate fourth hint: First letters + word count
  const generateFourthHint = useCallback((movie: MovieData) => {
    return generateLettersAndWordsHint(movie);
  }, [generateLettersAndWordsHint]);

  // Function to generate all unique hints for a movie
  const generateUniqueHints = useCallback((movie: MovieData) => {
    const allHints = [
      generateFirstHint(movie),
      generateSecondHint(movie),
      generateThirdHint(movie),
      generateFourthHint(movie)
    ];
    
    // Remove duplicates while preserving order
    const unique = [];
    const seen = new Set();
    
    for (const hint of allHints) {
      if (!seen.has(hint)) {
        seen.add(hint);
        unique.push(hint);
      }
    }
    
    return unique;
  }, [generateFirstHint, generateSecondHint, generateThirdHint, generateFourthHint]);

  // Function to request the first hint manually
  const requestHint = useCallback(() => {
    const currentMovie = gameMovies[currentMovieIndex];
    if (!currentMovie) return;

    const hints = generateUniqueHints(currentMovie);
    setUniqueHints(hints);
    setShowHint(true);
    setHintIndex(0);
    setHint(hints[0]);
  }, [gameMovies, currentMovieIndex, generateUniqueHints]);

  // Function to cycle through hints
  const cycleHint = useCallback(() => {
    if (uniqueHints.length === 0) return;

    const nextIndex = (hintIndex + 1) % uniqueHints.length;
    setHintIndex(nextIndex);
    setHint(uniqueHints[nextIndex]);
  }, [uniqueHints, hintIndex]);

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
        setHintIndex(0);
        setUniqueHints([]);
        setErrorCount(0);

        // Move to next movie or finish game
        if (currentMovieIndex < gameMovies.length - 1) {
          setTimeout(() => {
            setCurrentMovieIndex((prev) => prev + 1);
            setAnswerStatus(null);
            // Focus input after moving to next movie
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }, 1000);
        } else {
          // Game over, clear timer
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          
          // Navigate to results page after a delay to see the "correct" animation
          setTimeout(() => {
            const challengeSourceScore = localStorage.getItem('challengeSourceScore');
            const challengeSourceSessionId = localStorage.getItem('challengeSourceSessionId');
            
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
                totalMovies: gameMovies.length,
                challengeSourceSessionId: challengeSourceSessionId || null,
                challengeSourceScore: challengeSourceScore ? parseInt(challengeSourceScore) : null
              })
            );
            navigate("/results");
          }, 1000);
        }
      } else {
        // Wrong guess
        setWrongGuess(true);
        setAnswerStatus("wrong");
        
        // Hide wrong guess message after 3 seconds
        setTimeout(() => {
          setWrongGuess(false);
        }, 3000);
        
        // Increment error count
        const newErrorCount = errorCount + 1;
        setErrorCount(newErrorCount);
        
        // Check if we can provide a suggestion for close matches
        const suggestion = getSuggestion(guess, currentMovie.title) || 
                          (currentMovie.frenchTitle ? getSuggestion(guess, currentMovie.frenchTitle) : null);
        
        // No longer automatically show hints on wrong guesses
        // The user can now request hints manually

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
        generateThirdHint,
        generateFourthHint
    ]
  );

  // Function to reset hints (for passing movies)
  const resetHints = useCallback(() => {
    setWrongGuess(false);
    setShowHint(false);
    setHint("");
    setHintIndex(0);
    setUniqueHints([]);
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
    requestHint,
    cycleHint,
    showScorePopup,
    lastScore
  };
};
