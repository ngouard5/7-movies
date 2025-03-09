
import React from "react";

interface MovieCounterProps {
  currentIndex: number;
  totalMovies: number;
}

export const MovieCounter: React.FC<MovieCounterProps> = ({ currentIndex, totalMovies }) => {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-[134px] text-center">
      <div className="text-[18px] font-bold text-[#191919] mb-2">
        Movie {currentIndex + 1}/{totalMovies}
      </div>
    </div>
  );
};
