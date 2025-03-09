
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { searchMovies, MovieSearchResult, getMovieById } from "@/services/movieService";
import { movieEmojis, MovieEmoji } from "@/data/movieEmojis";

export interface MovieData {
  id: number;
  emojis: string;
  title: string;
  imdbID: string;
  image?: string;
  guessTime?: number; // Added to track time for each movie
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

export const useGameLogic = () => {
  // Get 7 random movies for this game session
  const [gameMovies, setGameMovies] = useState<MovieEmoji[]>(() => {
    // Shuffle the array and take the first 7 elements
    return shuffleArray(movieEmojis).slice(0, 7);
  });
  
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<MovieSearchResult[]>([]);
  const [timer, setTimer] = useState(0);
  const [movieStartTime, setMovieStartTime] = useState(0); // Track when user started guessing current movie
  const [guessedMovies, setGuessedMovies] = useState<MovieData[]>([]);
  const [wrongGuess, setWrongGuess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, toast]);

  const handleGuess = async (movieTitle: string) => {
    const currentMovie = gameMovies[currentMovieIndex];
    
    if (movieTitle.toLowerCase() === currentMovie.title.toLowerCase()) {
      // Correct guess
      toast({
        title: "Correct!",
        description: `You found "${currentMovie.title}"!`,
      });
      
      // Calculate time taken to guess this movie
      const guessTime = timer - movieStartTime;
      
      // Fetch movie details to get the poster
      const movieDetails = await getMovieById(currentMovie.imdbID);
      
      setGuessedMovies(prev => [...prev, {
        id: currentMovie.id,
        emojis: currentMovie.emojis,
        title: currentMovie.title,
        imdbID: currentMovie.imdbID,
        image: movieDetails?.Poster,
        guessTime: guessTime
      }]);
      
      setSearchTerm("");
      setWrongGuess(null);
      
      if (currentMovieIndex === gameMovies.length - 1) {
        // Game completed
        if (timerRef.current) clearInterval(timerRef.current);
        
        // Save results to localStorage
        localStorage.setItem("gameTime", timer.toString());
        localStorage.setItem("guessedMovies", JSON.stringify([...guessedMovies, {
          id: currentMovie.id,
          emojis: currentMovie.emojis,
          title: currentMovie.title,
          imdbID: currentMovie.imdbID,
          image: movieDetails?.Poster,
          guessTime: guessTime
        }]));
        
        // Navigate to results page
        navigate("/results");
      } else {
        // Move to next movie
        setCurrentMovieIndex(prev => prev + 1);
      }
    } else {
      // Wrong guess
      setWrongGuess(movieTitle);
      toast({
        title: "Not quite!",
        description: `It's not "${movieTitle}", but you're not that far, go on!`,
        variant: "destructive",
      });
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
    totalMovies: gameMovies.length
  };
};
