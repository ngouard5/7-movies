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
        <div className="flex items-center gap-3">
          <img
            src={currentMovie.image || getMoviePosterUrl(currentMovie.imdbID)}
            alt={currentMovie.title}
            className="w-10 h-14 rounded object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <div className="flex-1">
            <div className="font-bold text-sm mb-1">{currentMovie.title}</div>
            <div className="text-xs">
              💯 Base: {basePoints} pts
              {speedBonus > 0 && (
                <span className="ml-2">⚡ Speed bonus: +{speedBonus} pts</span>
              )}
              {speedBonus === 0 && (
                <span className="ml-2 opacity-75">⏱️ No speed bonus (&gt;30s)</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">
              🎉 +{totalPoints}
            </div>
            <div className="text-xs">points</div>
          </div>
        </div>
      </div>
    </div>
  );
};