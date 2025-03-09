
import React from "react";

interface EmojiDisplayProps {
  emojis: string;
}

export const EmojiDisplay: React.FC<EmojiDisplayProps> = ({ emojis }) => {
  return (
    <div className="absolute left-0 top-[180px] w-full h-[140px] bg-[#FFF2CC] border-t border-b border-[#FFCC33] flex items-center justify-center">
      <div className="text-[64px]" role="img" aria-label="Movie emojis">
        {emojis}
      </div>
    </div>
  );
};
