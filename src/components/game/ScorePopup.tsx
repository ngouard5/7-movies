import React from "react";

interface MovieData {
  id: number;
  emojis: string;
  title: string;
  imdbID: string;
  image?: string;
  frenchTitle?: string;
}

interface ScorePopupProps {
  show: boolean;
  basePoints: number;
  speedBonus: number;
  totalPoints: number;
  currentMovie: MovieData;
}

export const ScorePopup: React.FC<ScorePopupProps> = ({
  show,
  basePoints,
  speedBonus,
  totalPoints,
  currentMovie,
}) => {
  if (!show) return null;

  const getMoviePosterUrl = (imdbID: string) => {
    return `https://img.omdbapi.com/?i=${imdbID}&apikey=8342f4b&h=150`;
  };

  return (
    <div className="absolute top-full left-0 right-0 z-[100] mt-2">
      <div className="bg-green-500 text-white p-3 rounded-xl shadow-lg animate-fade-in">
        <div className="flex items-start gap-3">
          <img
            src={currentMovie.image || getMoviePosterUrl(currentMovie.imdbID)}
            alt={currentMovie.title}
            className="w-10 h-14 rounded object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <div className="flex-1 text-left">
            <div className="font-bold text-sm mb-1 font-sf">{currentMovie.title}</div>
            <div className="text-xs font-sf">
              <div>💯 Correct answer: {basePoints} pts</div>
              {speedBonus > 0 && (
                <div>⚡ Speed bonus: +{speedBonus} pts</div>
              )}
              {speedBonus === 0 && (
                <div className="opacity-75">⏱️ No speed bonus (&gt;30s)</div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold font-sf">
              +{totalPoints}
            </div>
            <div className="text-xs font-sf">points</div>
          </div>
        </div>
      </div>
    </div>
  );
};