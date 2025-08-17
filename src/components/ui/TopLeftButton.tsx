import React from "react";

interface TopLeftButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  ariaLabel: string;
}

export const TopLeftButton: React.FC<TopLeftButtonProps> = ({ onClick, icon, ariaLabel }) => {
  return (
    <div className="absolute left-4 top-[16px] z-20">
      <button 
        onClick={onClick}
        className="w-12 h-12 flex justify-center items-center border shadow-[0px_3px_3px_rgba(0,0,0,0.06)] bg-white rounded-xl border-solid border-[#CCC] hover:bg-gray-50 transition-colors"
        aria-label={ariaLabel}
      >
        {icon}
      </button>
    </div>
  );
};