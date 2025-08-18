
import React from "react";
import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useLanguage } from "@/contexts/LanguageContext";

export const PlayButton = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handlePlay = () => {
    // Clear any existing challenge data when starting a new game
    localStorage.removeItem('challengeMovies');
    localStorage.removeItem('challengeSourceSessionId');
    localStorage.removeItem('challengeSourceScore');
    navigate("/pre-game");
  };
  
  return (
    <PrimaryButton onClick={handlePlay}>
      {t('play.button')}
    </PrimaryButton>
  );
};
