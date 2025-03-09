
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MenuButton } from "@/components/game/MenuButton";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { MovieSuggestion } from "@/components/game/MovieSuggestion";
import { useToast } from "@/hooks/use-toast";

// Mock movie data (we'll replace this with API calls)
const mockMovies = [
  { id: 1, emojis: "🚀 👽 🌌 👾", title: "Star Wars", year: 1977, image: "https://m.media-amazon.com/images/M/MV5BYmU1NDRjNDgtMzhiMi00NjZmLTg5NGItZDNiZjU5NTU4OTE0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg" },
  { id: 2, emojis: "🧙‍♂️ 💍 🏔️ 🌋", title: "The Lord of the Rings", year: 2001, image: "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg" },
  { id: 3, emojis: "🌊 🚢 💎 💔", title: "Titanic", year: 1997, image: "https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg" },
  { id: 4, emojis: "🤖 👦 ❤️", title: "WALL·E", year: 2008, image: "https://m.media-amazon.com/images/M/MV5BMjExMTg5OTU0NF5BMl5BanBnXkFtZTcwMjMxMzMzMw@@._V1_SX300.jpg" },
  { id: 5, emojis: "🦁 👑 🌍", title: "The Lion King", year: 1994, image: "https://m.media-amazon.com/images/M/MV5BYTYxNGMyZTYtMjE3MS00MzNjLWFjNmYtMDk3N2FmM2JiM2M1XkEyXkFqcGdeQXVyNjY5NDU4NzI@._V1_SX300.jpg" },
  { id: 6, emojis: "🏝️ 🏐 🤔", title: "Cast Away", year: 2000, image: "https://m.media-amazon.com/images/M/MV5BN2Y5ZTU4YjctMDRmMC00MTg4LWE1M2MtMjk4MzVmOTE4YjkzXkEyXkFqcGdeQXVyNTc1NTQxODI@._V1_SX300.jpg" },
  { id: 7, emojis: "🧠 💭 😴", title: "Inception", year: 2010, image: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg" },
];

interface MovieData {
  id: number;
  emojis: string;
  title: string;
  year: number;
  image: string;
}

interface MovieSuggestionType {
  id: string;
  title: string;
  year: string;
  poster: string;
}

const Game = () => {
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<MovieSuggestionType[]>([]);
  const [timer, setTimer] = useState(0);
  const [guessedMovies, setGuessedMovies] = useState<MovieData[]>([]);
  const [wrongGuess, setWrongGuess] = useState<string | null>(null);
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

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentMovieIndex]);

  // Fetch movie suggestions (mock implementation for now)
  useEffect(() => {
    if (searchTerm.length >= 2) {
      // Simulating API call with mock data
      const filteredMovies = [
        { id: "tt0076759", title: "Star Wars", year: "1977", poster: "https://m.media-amazon.com/images/M/MV5BYmU1NDRjNDgtMzhiMi00NjZmLTg5NGItZDNiZjU5NTU4OTE0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg" },
        { id: "tt0080684", title: "Star Wars: Episode V - The Empire Strikes Back", year: "1980", poster: "https://m.media-amazon.com/images/M/MV5BYmU1NDRjNDgtMzhiMi00NjZmLTg5NGItZDNiZjU5NTU4OTE0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg" },
        { id: "tt0086190", title: "Star Wars: Episode VI - Return of the Jedi", year: "1983", poster: "https://m.media-amazon.com/images/M/MV5BYmU1NDRjNDgtMzhiMi00NjZmLTg5NGItZDNiZjU5NTU4OTE0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg" },
      ].filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setSuggestions(filteredMovies);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleGuess = (movieTitle: string) => {
    const currentMovie = mockMovies[currentMovieIndex];
    
    if (movieTitle.toLowerCase() === currentMovie.title.toLowerCase()) {
      // Correct guess
      toast({
        title: "Correct!",
        description: `You found "${currentMovie.title}"!`,
      });
      
      setGuessedMovies(prev => [...prev, currentMovie]);
      setSearchTerm("");
      setWrongGuess(null);
      
      if (currentMovieIndex === mockMovies.length - 1) {
        // Game completed
        if (timerRef.current) clearInterval(timerRef.current);
        
        // Save results to localStorage
        localStorage.setItem("gameTime", timer.toString());
        localStorage.setItem("guessedMovies", JSON.stringify([...guessedMovies, currentMovie]));
        
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

  const currentMovie = mockMovies[currentMovieIndex];

  return (
    <main className="relative w-full max-w-[393px] min-h-[852px] overflow-hidden bg-neutral-50 mx-auto my-0 max-md:w-full">
      <div className="relative h-full">
        <BackgroundGradients />

        <div className="absolute left-4 top-[69px]">
          <MenuButton />
        </div>

        <div className="absolute right-4 top-[69px] w-[138px] h-12 flex items-center justify-center border shadow-[0px_3px_3px_rgba(0,0,0,0.06)] bg-white rounded-xl border-solid border-[#CCC]">
          <div className="text-[22px] font-bold text-[#E72F2F]">
            {formatTime(timer)}
          </div>
        </div>

        <div className="absolute left-2/4 -translate-x-2/4 top-[134px] text-center">
          <div className="text-[18px] font-bold text-[#191919] mb-2">
            Movie {currentMovieIndex + 1}/{mockMovies.length}
          </div>
          <div className="text-[64px]" role="img" aria-label="Movie emojis">
            {currentMovie.emojis}
          </div>
        </div>

        <div className="absolute w-[361px] left-4 top-[323px]">
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
            
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-[60px] bg-white border border-[#CCC] rounded-xl shadow-lg max-h-[300px] overflow-y-auto z-10">
                {suggestions.map((movie) => (
                  <MovieSuggestion
                    key={movie.id}
                    movie={movie}
                    onClick={() => {
                      handleGuess(movie.title);
                      setSearchTerm("");
                      setSuggestions([]);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {wrongGuess && (
            <div className="mt-6 p-4 bg-[#FADEDE] rounded-xl border border-[#E72F2F]">
              <p className="text-[18px] text-[#191919]">
                It's not "<span className="font-bold">{wrongGuess}</span>", but you're not that far, go on!
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Game;
