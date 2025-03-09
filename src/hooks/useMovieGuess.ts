
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getMovieById } from "@/services/movieService";
import { MovieEmoji } from "@/data/movieEmojis";
import { getRandomErrorMessage } from "@/utils/movieUtils";
import { MovieData } from "@/types/gameTypes";
import { addParticipantToSession } from "@/utils/gameStorage";

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
            // Game completed
            handleGameCompletion(updatedGuessedMovies);
          } else {
            // Move to next movie
            setCurrentMovieIndex(prev => prev + 1);
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
          guessTime: timer - movieStartTime
        };
        
        const updatedGuessedMovies = [...guessedMovies, newGuessedMovie];
        setGuessedMovies(updatedGuessedMovies);
        
        if (currentMovieIndex === gameMovies.length - 1) {
          // Game completed
          handleGameCompletion(updatedGuessedMovies);
        } else {
          // Move to next movie
          setCurrentMovieIndex(prev => prev + 1);
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

  const handleGameCompletion = (updatedGuessedMovies: MovieData[]) => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Check if this was a challenge response
    if (isChallenge && challengeId) {
      // Get player info
      const playerNickname = localStorage.getItem("playerNickname") || "Player";
      const avatarIndex = parseInt(localStorage.getItem("playerAvatar") || "0");
      const avatars = ["👨‍🦰", "👩‍🦰", "👨‍🦱", "👩‍🦱", "👨‍🦳", "👩‍🦳", "👨‍🦲", "👩‍🦲"];
      const playerAvatar = avatars[avatarIndex] || "👨‍🦰";
      
      // Add participant to the session identified by the challengeId
      addParticipantToSession(
        challengeId,
        playerNickname,
        playerAvatar,
        timer
      );
      
      // Clear the challenge id
      localStorage.removeItem("currentChallengeId");
    }
    
    // Save results to localStorage
    localStorage.setItem("gameTime", timer.toString());
    localStorage.setItem("guessedMovies", JSON.stringify(updatedGuessedMovies));
    console.log("Saving guessed movies to localStorage:", updatedGuessedMovies);
    
    // Navigate to results page
    navigate("/results");
  };

  return {
    wrongGuess,
    answerStatus,
    handleGuess
  };
};
