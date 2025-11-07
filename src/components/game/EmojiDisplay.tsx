
import React from "react";

interface MovieData {
  id: number;
  emojis: string;
  title: string;
  imdbID: string;
  image?: string;
  frenchTitle?: string;
}

interface EmojiDisplayProps {
  emojis: string;
  status: "default" | "correct" | "wrong";
  movieData?: MovieData;
  basePoints?: number;
  speedBonus?: number;
  totalPoints?: number;
  language?: string;
}

export const EmojiDisplay: React.FC<EmojiDisplayProps> = ({ 
  emojis, 
  status = "default",
  movieData,
  basePoints,
  speedBonus,
  totalPoints,
  language
}) => {
  const getBgColor = () => {
    switch (status) {
      case "correct":
        return "bg-[#DDFFDD] border-[#99CC99]"; // Green
      case "wrong":
        return "bg-[#FADEDE] border-[#E72F2F]"; // Red
      default:
        return "bg-[#FFF2CC] border-[#FFCC33]"; // Yellow
    }
  };

  const getMoviePosterUrl = (imdbID: string) => {
    return `https://img.omdbapi.com/?i=${imdbID}&apikey=8342f4b&h=150`;
  };

  const showScoreDetails = status === "correct" && movieData && basePoints !== undefined && totalPoints !== undefined;

  return (
    <div className={`w-full ${getBgColor()} border-t border-b transition-colors duration-300`}>
      {/* Emoji Section */}
      <div className="w-full h-[104px] flex items-center justify-center">
        <div className="text-[56px]" role="img" aria-label="Movie emojis">
          {emojis}
        </div>
      </div>

      {/* Score Details Section - Only shown when correct */}
      {showScoreDetails && (
        <div className="w-full border-t border-[#99CC99] bg-[#DDFFDD] px-4 py-4">
          <div className="flex items-center gap-4 max-w-[400px] mx-auto">
            {/* Movie Poster */}
            <img
              src={movieData.image || getMoviePosterUrl(movieData.imdbID)}
              alt={movieData.title}
              className="w-[60px] h-[90px] rounded object-cover flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            
            {/* Score Information */}
            <div className="flex-1 text-left">
              <div className="font-bold text-base mb-2 text-gray-900">
                {language === 'fr' && movieData.frenchTitle ? movieData.frenchTitle : movieData.title}
              </div>
              <div className="text-sm text-gray-700 space-y-0.5">
                <div>💯 Bonne réponse : {basePoints} pts</div>
                {speedBonus !== undefined && speedBonus > 0 && (
                  <div>⚡ Bonus vitesse : +{speedBonus} pts</div>
                )}
                {speedBonus === 0 && (
                  <div className="opacity-75">⏱️ Pas de bonus vitesse</div>
                )}
              </div>
            </div>

            {/* Total Points */}
            <div className="text-right flex-shrink-0">
              <div className="text-3xl font-bold text-gray-900">
                +{totalPoints}
              </div>
              <div className="text-xs text-gray-600">pts</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
