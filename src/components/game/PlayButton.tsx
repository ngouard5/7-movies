
import React from "react";
import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

export const PlayButton = () => {
  const navigate = useNavigate();
  
  const handlePlay = () => {
    navigate("/pre-game");
  };
  
  return (
    <PrimaryButton onClick={handlePlay}>
      Play now
    </PrimaryButton>
  );
};
