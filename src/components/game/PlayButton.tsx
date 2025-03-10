
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const PlayButton = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handlePlay = () => {
    navigate("/pre-game");
  };
  
  return (
    <button
      className="w-full h-14 border text-white text-xl font-bold shadow-[0px_3px_3px_rgba(0,0,0,0.08),0px_5px_7px_rgba(255,255,255,0.20)_inset] bg-[#E72F2F] rounded-2xl border-solid border-[#E72F2F] hover:bg-[#d62b2b] transition-colors"
      onClick={handlePlay}
    >
      {t('play.button')}
    </button>
  );
};
