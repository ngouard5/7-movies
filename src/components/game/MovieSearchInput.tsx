
import React from "react";
import { MovieSearchResult } from "@/services/movieService";
import { MovieSuggestion } from "./MovieSuggestion";

interface MovieSearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  suggestions: MovieSearchResult[];
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  handleGuess: (movieTitle: string) => void;
  wrongGuess: string | null;
  showHint?: boolean;
}

export const MovieSearchInput: React.FC<MovieSearchInputProps> = ({
  searchTerm,
  setSearchTerm,
  suggestions,
  isLoading,
  inputRef,
  handleGuess,
  wrongGuess,
  showHint = false,
}) => {
  return (
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
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Wrong guess message or hint */}
      {wrongGuess && (
        <div className={`mt-6 p-4 rounded-xl border ${showHint ? 'bg-[#FFF8E0] border-[#F0C000]' : 'bg-[#FADEDE] border-[#E72F2F]'}`}>
          <p className="text-[18px] text-[#191919]">{wrongGuess}</p>
        </div>
      )}
    </div>
  );
};
