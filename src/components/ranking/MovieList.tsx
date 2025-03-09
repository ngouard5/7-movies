
import React from "react";
import { MovieData } from "@/hooks/useGameLogic";

interface MovieListProps {
  movies: MovieData[];
  moviePosters: Record<string, string>;
}

export const MovieList: React.FC<MovieListProps> = ({ movies, moviePosters }) => {
  return (
    <div className="w-full">
      <div className="text-[16px] font-bold text-[#191919] mb-2 text-left">
        Movie List
      </div>
      
      <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto w-full">
        {movies.map((movie) => (
          <div 
            key={movie.id}
            className="flex p-4 bg-white border border-[#CCC] rounded-xl shadow-[0px_3px_3px_rgba(0,0,0,0.06)]"
          >
            <div className="w-12 h-16 flex-shrink-0 mr-3 rounded-lg overflow-hidden">
              {moviePosters[movie.id] ? (
                <img 
                  src={moviePosters[movie.id]} 
                  alt={movie.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <div className="text-2xl">{movie.emojis.split(' ')[0]}</div>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="font-bold text-[16px] text-[#191919] text-left">
                {movie.title}
              </div>
              <div className="text-[14px] text-gray-500 text-left flex items-center mt-1">
                <div className="flex">
                  {movie.emojis.split(' ').map((emoji, i) => (
                    <span key={i} className="mr-1">{emoji}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
