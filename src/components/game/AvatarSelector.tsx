
import React from "react";

const avatars = [
  "🫠", "🥶", "🥸", "🤬", "🤯", "🥳", "🧐", "😈"
];

interface AvatarSelectorProps {
  selectedAvatar: number;
  onSelect: (index: number) => void;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({ 
  selectedAvatar, 
  onSelect 
}) => {
  return (
    <div className="grid grid-cols-4 gap-3 w-full">
      {avatars.map((avatar, index) => (
        <button
          key={index}
          className={`aspect-square flex items-center justify-center text-4xl border rounded-xl ${
            selectedAvatar === index
              ? "bg-[#FFF2CC] border-[#FC3] shadow-[0px_2px_5px_rgba(0,0,0,0.10)_inset]"
              : "bg-white border-[#CCC] shadow-[0px_3px_3px_rgba(0,0,0,0.06)]"
          }`}
          onClick={() => onSelect(index)}
          aria-label={`Avatar ${index + 1}`}
        >
          {avatar}
        </button>
      ))}
    </div>
  );
};
