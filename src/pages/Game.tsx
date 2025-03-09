
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MenuButton } from "@/components/game/MenuButton";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { MovieSuggestion } from "@/components/game/MovieSuggestion";
import { useToast } from "@/hooks/use-toast";
import { searchMovies, MovieSearchResult } from "@/services/movieService";
import { movieEmojis, MovieEmoji } from "@/data/movieEmojis";

interface MovieData {
  id: number;
  emojis: string;
  title: string;
  imdbID: string;
  image?: string;
}

const Game = () => {
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<MovieSearchResult[]>([]);
  const [timer, setTimer] = useState(0);
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

  const handleGuess = (movieTitle: string) => {
    const currentMovie = movieEmojis[currentMovieIndex];
    
    if (movieTitle.toLowerCase() === currentMovie.title.toLowerCase()) {
      // Correct guess
      toast({
        title: "Correct!",
        description: `You found "${currentMovie.title}"!`,
      });
      
      setGuessedMovies(prev => [...prev, {
        id: currentMovie.id,
        emojis: currentMovie.emojis,
        title: currentMovie.title,
        imdbID: currentMovie.imdbID,
      }]);
      
      setSearchTerm("");
      setWrongGuess(null);
      
      if (currentMovieIndex === movieEmojis.length - 1) {
        // Game completed
        if (timerRef.current) clearInterval(timerRef.current);
        
        // Save results to localStorage
        localStorage.setItem("gameTime", timer.toString());
        localStorage.setItem("guessedMovies", JSON.stringify([...guessedMovies, {
          id: currentMovie.id,
          emojis: currentMovie.emojis,
          title: currentMovie.title,
          imdbID: currentMovie.imdbID,
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

  const currentMovie = movieEmojis[currentMovieIndex];

  return (
    <main className="relative w-full max-w-[393px] min-h-[852px] overflow-hidden bg-neutral-50 mx-auto my-0 max-md:w-full">
      <BackgroundGradients />
      
      {/* Header with menu button */}
      <div className="absolute left-4 top-[69px]">
        <MenuButton />
      </div>
      
      {/* Timer */}
      <div className="absolute right-4 top-[69px] w-[138px] h-12 flex items-center justify-center border shadow-[0px_3px_3px_rgba(0,0,0,0.06)] bg-white rounded-xl border-solid border-[#CCC]">
        <div className="text-[22px] font-bold text-[#E72F2F]">
          {formatTime(timer)}
        </div>
      </div>
      
      {/* Movie counter */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[134px] text-center">
        <div className="text-[18px] font-bold text-[#191919] mb-2">
          Movie {currentMovieIndex + 1}/{movieEmojis.length}
        </div>
      </div>
      
      {/* Yellow emojis section */}
      <div className="absolute left-0 top-[180px] w-full h-[140px] bg-[#FFF2CC] border-t border-b border-[#FFCC33] flex items-center justify-center">
        <div className="text-[64px]" role="img" aria-label="Movie emojis">
          {currentMovie.emojis}
        </div>
      </div>
      
      {/* Input section */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[360px] w-[361px]">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            className="w-full h-14 px-4 border shadow-[0px_2px_5px_rgba(0,0,0,0.08)_inset] bg-white rounded-xl border-solid border-[#CCC] text-[18px]"
            placeholder="Type a movie title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
          />
          
          {isLoading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-[#E72F2F] rounded-full animate-spin"></div>
            </div>
          )}
          
          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-[60px] bg-white border border-[#CCC] rounded-xl shadow-lg max-h-[300px] overflow-y-auto z-10">
              {suggestions.map((movie) => (
                <MovieSuggestion
                  key={movie.imdbID}
                  movie={{
                    id: movie.imdbID,
                    title: movie.Title,
                    year: movie.Year,
                    poster: movie.Poster
                  }}
                  onClick={() => {
                    handleGuess(movie.Title);
                    setSearchTerm("");
                    setSuggestions([]);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Wrong guess message */}
        {wrongGuess && (
          <div className="mt-6 p-4 bg-[#FADEDE] rounded-xl border border-[#E72F2F]">
            <p className="text-[18px] text-[#191919]">
              It's not "<span className="font-bold">{wrongGuess}</span>", but you're not that far, go on!
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Game;
