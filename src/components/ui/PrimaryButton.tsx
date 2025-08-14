import React from "react";

interface PrimaryButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ 
  onClick, 
  children, 
  className = "",
  disabled = false 
}) => {
  return (
    <button
      className={`w-full h-14 border text-white text-xl font-bold shadow-[0px_3px_3px_rgba(0,0,0,0.08),0px_5px_7px_rgba(255,255,255,0.20)_inset] bg-[#E72F2F] rounded-2xl border-solid border-[#E72F2F] hover:bg-[#d62b2b] transition-colors font-sf ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};