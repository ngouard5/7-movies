import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { searchMovies, MovieSearchResult, getMovieById } from "@/services/movieService";
import { movieEmojis, MovieEmoji } from "@/data/movieEmojis";
import { addParticipantToSession } from "@/utils/gameStorage";

export interface MovieData {
  id: number;
  emojis: string;
  title: string;
  imdbID: string;
  image?: string;
  guessTime?: number; // Time it took to guess this specific movie
}

// Helper function to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Error messages for wrong guesses
const errorMessages = [
  "That's not it! Try another movie.",
  "Not quite right, but you're on the right track!",
  "Good try, but not the movie we're looking for!",
  "Hmm, not that one. Keep guessing!",
  "Close, but not close enough. Try again!",
  "That's not the correct movie, try another one!",
  "Nice attempt, but that's not it!",
  "I'm thinking of a different movie. Try again!",
  "That's not right, but don't give up!",
  "Not that one, but you can do this!"
];

// Get random error message
const getRandomErrorMessage = (movieTitle: string) => {
  const randomIndex = Math.floor(Math.random() * errorMessages.length);
  return `${errorMessages[randomIndex]} "${movieTitle}" is not the answer.`;
};

export const useGameLogic = () => {
  const [gameMovies, setGameMovies] = useState<MovieEmoji[]>(() => {
    const challengeMoviesStr = localStorage.getItem("challengeMovies");
    
    if (challengeMoviesStr) {
      try {
        // This is a challenge game
        const challengeMovieIds = JSON.parse(challengeMoviesStr);
        const moviesForChallenge = challengeMovieIds
          .map((id: number) => movieEmojis.find(movie => movie.id === id))
          .filter(Boolean);
        
        // Clear the challenge data after loading
        localStorage.removeItem("challengeMovies");
        
        if (moviesForChallenge.length > 0) {
          return moviesForChallenge;
        }
      } catch (e) {
        console.error("Error parsing challenge movies:", e);
      }
    }
    
    // Regular game - get 7 random movies
    return shuffleArray(movieEmojis).slice(0, 7);
  });
  
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<MovieSearchResult[]>([]);
  const [timer, setTimer] = useState(0);
  const [movieStartTime, setMovieStartTime] = useState(0);
  const [guessedMovies, setGuessedMovies] = useState<MovieData[]>([]);
  const [wrongGuess, setWrongGuess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChallenge, setIsChallenge] = useState(false);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<"default" | "correct" | "wrong">("default");
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const statusResetTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if this is a challenge response
  useEffect(() => {
    const currentChallengeId = localStorage.getItem("currentChallengeId");
    if (currentChallengeId) {
      setIsChallenge(true);
      setChallengeId(currentChallengeId);
      // Don't remove it yet, we'll need it when the game is over
    }
  }, []);

  // Start timer when component mounts
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Set movie start time when movie changes
  useEffect(() => {
    setMovieStartTime(timer);
  }, [currentMovieIndex, timer]);

  // Focus input when component mounts or movie changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentMovieIndex]);

  // Fetch movie suggestions from OMDb API
  useEffect(() => {
    const fetchSuggestions = async () => {
      // Search with a minimum of 2 characters
      if (searchTerm.length >= 2) {
        setIsLoading(true);
        try {
          const results = await searchMovies(searchTerm);
          setSuggestions(results);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          toast({
            title: "Error",
            description: "Failed to fetch movie suggestions",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };

    // Small debounce timer to make search responsive without too many requests
    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, toast]);

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
        
        setSearchTerm("");
        setWrongGuess(null);
        
        // Reset status after a delay before moving to next movie
        if (statusResetTimerRef.current) {
          clearTimeout(statusResetTimerRef.current);
        }
        
        statusResetTimerRef.current = setTimeout(() => {
          setAnswerStatus("default");
          
          if (currentMovieIndex === gameMovies.length - 1) {
            // Game completed
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
          guessTime: guessTime
        };
        
        const updatedGuessedMovies = [...guessedMovies, newGuessedMovie];
        setGuessedMovies(updatedGuessedMovies);
        
        if (currentMovieIndex === gameMovies.length - 1) {
          // Game completed
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
          
          // Navigate to results page
          navigate("/results");
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentMovie = gameMovies[currentMovieIndex];

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
    formatTime,
    totalMovies: gameMovies.length,
    answerStatus
  };
};
