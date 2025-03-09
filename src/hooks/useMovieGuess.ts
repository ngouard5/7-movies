
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getMovieById } from "@/services/movieService";
import { MovieEmoji } from "@/data/movieEmojis";
import { getRandomErrorMessage } from "@/utils/movieUtils";
import { MovieData } from "@/types/gameTypes";
import { saveGameSession } from "@/utils/gameStorage";

type AnswerStatus = "default" | "correct" | "wrong";

interface UseMovieGuessProps {
  gameMovies: MovieEmoji[];
  currentMovieIndex: number;
  setCurrentMovieIndex: (index: number) => void;
  guessedMovies: MovieData[];
  setGuessedMovies: (movies: MovieData[]) => void;
  timer: number;
  movieStartTime: number;
  isChallenge: boolean;
  challengeId: string | null;
  timerRef: React.RefObject<NodeJS.Timeout>;
}

export const useMovieGuess = ({
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
}: UseMovieGuessProps) => {
  const [wrongGuess, setWrongGuess] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>("default");
  const navigate = useNavigate();
  const { toast } = useToast();
  const statusResetTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleGuess = async (movieTitle: string) => {
    // Ensure we have a valid current movie to compare against
    if (!gameMovies || gameMovies.length === 0 || currentMovieIndex >= gameMovies.length) {
      console.error("Invalid game state: No current movie available");
      return;
    }

    const currentMovie = gameMovies[currentMovieIndex];
    
    if (movieTitle.toLowerCase() === currentMovie.title.toLowerCase()) {
      // Correct guess
      setAnswerStatus("correct");
      
      toast({
        title: "Correct!",
        description: `You found "${currentMovie.title}"!`,
      });
      
      // Calculate time taken to guess this movie
      const guessTime = timer - movieStartTime;
      console.log(`Movie ${currentMovie.title} guessed in ${guessTime} seconds`);
      
      try {
        // Fetch movie details to get the poster
        const movieDetails = await getMovieById(currentMovie.imdbID);
        
        const newGuessedMovie = {
          id: currentMovie.id,
          emojis: currentMovie.emojis,
          title: currentMovie.title,
          imdbID: currentMovie.imdbID,
          image: movieDetails?.Poster,
          guessTime: guessTime
        };
        
        const updatedGuessedMovies = [...guessedMovies, newGuessedMovie];
        setGuessedMovies(updatedGuessedMovies);
        
        setWrongGuess(null);
        
        // Reset status after a delay before moving to next movie
        if (statusResetTimerRef.current) {
          clearTimeout(statusResetTimerRef.current);
        }
        
        statusResetTimerRef.current = setTimeout(() => {
          setAnswerStatus("default");
          
          if (currentMovieIndex === gameMovies.length - 1) {
            // Game completed - handle without relying on Firebase first
            handleGameCompletionSafely(updatedGuessedMovies);
          } else {
            // Move to next movie
            setCurrentMovieIndex(currentMovieIndex + 1);
          }
        }, 800); // Short delay to show the green color
        
      } catch (error) {
        console.error("Error fetching movie details:", error);
        // Continue even if there's an error fetching details
        const newGuessedMovie = {
          id: currentMovie.id,
          emojis: currentMovie.emojis,
          title: currentMovie.title,
          imdbID: currentMovie.imdbID,
          guessTime: guessTime
        };
        
        const updatedGuessedMovies = [...guessedMovies, newGuessedMovie];
        setGuessedMovies(updatedGuessedMovies);
        
        if (currentMovieIndex === gameMovies.length - 1) {
          // Game completed
          handleGameCompletionSafely(updatedGuessedMovies);
        } else {
          // Move to next movie
          setCurrentMovieIndex(currentMovieIndex + 1);
        }
      }
    } else {
      // Wrong guess
      setAnswerStatus("wrong");
      setWrongGuess(getRandomErrorMessage(movieTitle));
      
      toast({
        title: "Not quite!",
        description: `It's not "${movieTitle}", but you're not that far, go on!`,
        variant: "destructive",
      });
      
      // Reset status after a delay
      if (statusResetTimerRef.current) {
        clearTimeout(statusResetTimerRef.current);
      }
      
      statusResetTimerRef.current = setTimeout(() => {
        setAnswerStatus("default");
      }, 800); // Short delay to show the red color
    }
  };

  // Safe game completion method that doesn't rely on Firebase being available
  const handleGameCompletionSafely = (updatedGuessedMovies: MovieData[]) => {
    console.log("Game completed, handling completion safely");
    
    // Stop the timer first
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Get player info
    const playerNickname = localStorage.getItem("playerNickname") || "Player";
    const avatarIndex = parseInt(localStorage.getItem("playerAvatar") || "0");
    const avatars = ["👨‍🦰", "👩‍🦰", "👨‍🦱", "👩‍🦱", "👨‍🦳", "👩‍🦳", "👨‍🦲", "👩‍🦲"];
    const playerAvatar = avatars[avatarIndex] || "👨‍🦰";
    
    // Always save to localStorage first to ensure we have the data
    const localSessionId = saveGameSession(
      timer,
      updatedGuessedMovies,
      playerNickname,
      playerAvatar
    );

    // If this is a challenge, store the challenge ID
    if (isChallenge && challengeId) {
      localStorage.setItem("currentChallengeId", challengeId);
    }
    
    // Save results to localStorage for the results page to use
    localStorage.setItem("gameTime", timer.toString());
    localStorage.setItem("guessedMovies", JSON.stringify(updatedGuessedMovies));
    localStorage.setItem("lastSessionId", localSessionId);
    console.log("Saving guessed movies to localStorage:", updatedGuessedMovies);
    
    // Use a short timeout to ensure all state updates have completed
    setTimeout(() => {
      console.log("Navigating to results page");
      // Force navigation to results page
      window.location.href = "/results";
    }, 300);
  };

  return {
    wrongGuess,
    answerStatus,
    handleGuess
  };
};
