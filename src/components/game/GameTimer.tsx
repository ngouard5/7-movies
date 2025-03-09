
import React from "react";

interface GameTimerProps {
  timer: number;
  formatTime: (seconds: number) => string;
}

export const GameTimer: React.FC<GameTimerProps> = ({ timer, formatTime }) => {
  return (
    <div className="absolute right-4 top-[69px] w-[138px] h-12 flex items-center justify-center border shadow-[0px_3px_3px_rgba(0,0,0,0.06)] bg-white rounded-xl border-solid border-[#CCC]">
      <div className="text-[22px] font-bold text-[#E72F2F]">
        {formatTime(timer)}
      </div>
    </div>
  );
};
