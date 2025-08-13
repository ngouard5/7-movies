
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MovieCounterProps {
  currentIndex: number;
  totalMovies: number;
}

export const MovieCounter: React.FC<MovieCounterProps> = ({ currentIndex, totalMovies }) => {
  const { t } = useLanguage();
  
  return (
    <div className="text-left">
      <div className="text-[18px] font-bold text-foreground">
        {t('movie.counter')} {currentIndex + 1}/{totalMovies}
      </div>
    </div>
  );
};
