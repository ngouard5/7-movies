
import React from "react";

interface EmojiDisplayProps {
  emojis: string;
  status: "default" | "correct" | "wrong";
}

export const EmojiDisplay: React.FC<EmojiDisplayProps> = ({ 
  emojis, 
  status = "default" 
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

  return (
    <div className={`absolute left-0 top-[180px] w-full h-[140px] ${getBgColor()} border-t border-b flex items-center justify-center transition-colors duration-300`}>
      <div className="text-[64px]" role="img" aria-label="Movie emojis">
        {emojis}
      </div>
    </div>
  );
};
