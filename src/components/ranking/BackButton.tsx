
import React from "react";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  onBack: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onBack }) => {
  return (
    <button 
      onClick={onBack}
      className="flex items-center justify-center w-12 h-12 border shadow-[0px_3px_3px_rgba(0,0,0,0.06)] bg-white rounded-xl border-solid border-[#CCC]"
    >
      <ArrowLeft className="w-6 h-6 text-[#191919]" />
    </button>
  );
};
