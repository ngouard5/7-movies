
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { AvatarSelector } from "@/components/game/AvatarSelector";
import { useToast } from "@/hooks/use-toast";
import { AppLayout } from "@/components/layout/AppLayout";

const PreGame = () => {
  const [nickname, setNickname] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load saved user data when component mounts
  useEffect(() => {
    const savedNickname = localStorage.getItem("playerNickname");
    const savedAvatar = localStorage.getItem("playerAvatar");
    
    if (savedNickname) {
      setNickname(savedNickname);
    }
    
    if (savedAvatar) {
      setSelectedAvatar(parseInt(savedAvatar));
    }
  }, []);

  const handleStartGame = () => {
    if (!nickname.trim()) {
      toast({
        title: "Nickname required",
        description: "Please enter a nickname to start the game",
        variant: "destructive",
      });
      return;
    }
    
    // Save player data
    localStorage.setItem("playerNickname", nickname);
    localStorage.setItem("playerAvatar", selectedAvatar.toString());
    
    // Navigate to countdown page
    navigate("/countdown");
  };

  const handleBackClick = () => {
    // Always navigate to index page
    navigate("/");
  };

  const isChallengeMode = localStorage.getItem("challengeMovies") !== null;

  return (
    <AppLayout>
      <main className="relative w-full min-h-[852px] overflow-auto bg-neutral-50 mx-auto my-0">
        <div className="relative flex flex-col items-center">
          <BackgroundGradients />

          <div className="absolute left-4 top-[69px]">
            <button 
              onClick={handleBackClick}
              className="w-12 h-12 flex justify-center items-center border shadow-[0px_3px_3px_rgba(0,0,0,0.06)] bg-white rounded-xl border-solid border-[#CCC] hover:bg-gray-50 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-6 h-6 text-[#E72F2F]" />
            </button>
          </div>

          <div
            className="absolute text-[64px] left-1/2 -translate-x-1/2 top-[117px]"
            role="img"
            aria-label="Popcorn emoji"
          >
            🍿
          </div>

          <h1 className="absolute w-[361px] text-[40px] leading-[48px] text-center text-[#191919] left-1/2 -translate-x-1/2 top-[200px] max-sm:text-[32px] max-sm:leading-10 font-fredoka">
            {isChallengeMode ? "Accept the challenge!" : ""}
          </h1>

          <div className="absolute left-1/2 -translate-x-1/2 max-w-[361px] w-full top-[260px] px-4">
            <div className="mb-6">
              <label htmlFor="nickname" className="block text-[18px] font-bold text-[#191919] mb-2 text-left font-sf">
                Your nickname
              </label>
              <input
                type="text"
                id="nickname"
                className="w-full h-14 px-4 border shadow-[0px_2px_5px_rgba(0,0,0,0.08)_inset] bg-white rounded-xl border-solid border-[#CCC] text-[18px] font-sf"
                placeholder="Enter your nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={20}
              />
            </div>

            <div className="mb-12">
              <label className="block text-[18px] font-bold text-[#191919] mb-2 text-left font-sf">
                Choose your avatar
              </label>
              <div className="flex justify-center">
                <AvatarSelector 
                  selectedAvatar={selectedAvatar} 
                  onSelect={setSelectedAvatar} 
                />
              </div>
            </div>

            <button
              className="w-full h-14 border text-white text-xl font-bold shadow-[0px_3px_3px_rgba(0,0,0,0.08),0px_5px_7px_rgba(255,255,255,0.20)_inset] bg-[#E72F2F] rounded-2xl border-solid border-[#E72F2F] hover:bg-[#d62b2b] transition-colors font-sf"
              onClick={handleStartGame}
            >
              {isChallengeMode ? "Accept Challenge" : "Start the game!"}
            </button>
          </div>
        </div>
      </main>
    </AppLayout>
  );
};

export default PreGame;
