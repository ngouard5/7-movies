
import React from "react";

interface GameTimerProps {
  timer: number;
  formatTime: (seconds: number) => string;
}

export const GameTimer: React.FC<GameTimerProps> = ({ timer, formatTime }) => {
  return (
    <div className="w-[138px] h-12 flex items-center justify-center border shadow-[0px_3px_3px_rgba(0,0,0,0.06)] bg-background rounded-xl border-border">
      <div className="text-[18px] font-bold text-black">
        {formatTime(timer)}
      </div>
    </div>
  );
};
