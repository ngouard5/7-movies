import React from "react";

interface ScorePopupProps {
  show: boolean;
  basePoints: number;
  speedBonus: number;
  totalPoints: number;
}

export const ScorePopup: React.FC<ScorePopupProps> = ({
  show,
  basePoints,
  speedBonus,
  totalPoints,
}) => {
  if (!show) return null;

  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-[320px] w-full max-w-[361px] z-10">
      <div className="bg-green-500 text-white p-4 rounded-xl shadow-lg animate-fade-in">
        <div className="text-center">
          <div className="text-xl font-bold mb-2">
            🎉 +{totalPoints} points!
          </div>
          <div className="text-sm">
            💯 Base: {basePoints} pts
            {speedBonus > 0 && (
              <span className="ml-2">⚡ Speed bonus: +{speedBonus} pts</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};