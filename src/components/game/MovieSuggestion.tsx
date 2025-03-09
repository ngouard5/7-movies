
import React from "react";

interface MovieSuggestionProps {
  movie: {
    id: string;
    title: string;
    year: string;
    poster: string;
  };
  onClick: () => void;
}

export const MovieSuggestion: React.FC<MovieSuggestionProps> = ({ movie, onClick }) => {
  return (
    <button
      className="w-full flex items-center p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
      onClick={onClick}
    >
      <img
        src={movie.poster !== "N/A" ? movie.poster : "/placeholder.svg"}
        alt={movie.title}
        className="w-12 h-[68px] rounded object-cover mr-3"
      />
      <div className="text-left">
        <div className="font-bold text-[16px] text-[#191919]">{movie.title}</div>
        <div className="text-[14px] text-gray-500">{movie.year}</div>
      </div>
    </button>
  );
};
