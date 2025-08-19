import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";

interface MovieAutocompleteProps {
  suggestions: Array<{title: string, year: number, frenchTitle?: string}>;
  isOpen: boolean;
  onSuggestionClick: (title: string) => void;
}

export const MovieAutocomplete: React.FC<MovieAutocompleteProps> = ({
  suggestions,
  isOpen,
  onSuggestionClick
}) => {
  const { language } = useLanguage();
  
  if (!isOpen || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto">
      {suggestions.map((movie, index) => {
        const primaryTitle = language === 'fr' && movie.frenchTitle ? movie.frenchTitle : movie.title;
        const secondaryTitle = language === 'fr' && movie.frenchTitle ? movie.title : movie.frenchTitle;
        
        return (
          <button
            key={`${movie.title}-${movie.year}`}
            className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border last:border-0 first:rounded-t-xl last:rounded-b-xl"
            onClick={() => onSuggestionClick(movie.title)}
          >
            <div className="font-medium text-foreground">
              {primaryTitle} ({movie.year})
            </div>
            {secondaryTitle && secondaryTitle !== primaryTitle && (
              <div className="text-sm text-muted-foreground italic mt-1">
                {secondaryTitle}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};