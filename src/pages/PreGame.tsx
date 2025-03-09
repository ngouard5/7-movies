
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { AvatarSelector } from "@/components/game/AvatarSelector";
import { useToast } from "@/hooks/use-toast";

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

  const isChallengeMode = localStorage.getItem("challengeMovies") !== null;

  return (
    <main className="relative w-full max-w-[393px] min-h-[852px] overflow-hidden bg-neutral-50 mx-auto my-0 max-md:w-full">
      <div className="relative">
        <BackgroundGradients />

        <div className="absolute left-4 top-[69px]">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 flex justify-center items-center border shadow-[0px_3px_3px_rgba(0,0,0,0.06)] bg-white rounded-xl border-solid border-[#CCC] hover:bg-gray-50 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-6 h-6 text-[#191919]" />
          </button>
        </div>

        <div
          className="absolute text-[64px] left-[165px] top-[117px]"
          role="img"
          aria-label="Popcorn emoji"
        >
          🍿
        </div>

        <h1 className="absolute w-[361px] text-[40px] leading-[48px] text-center text-[#191919] left-4 top-[229px] max-sm:text-[32px] max-sm:leading-10">
          {isChallengeMode ? "Accept the challenge!" : "Before we start..."}
        </h1>

        <div className="absolute left-4 top-[323px] w-[361px]">
          <div className="mb-6">
            <label htmlFor="nickname" className="block text-[18px] font-bold text-[#191919] mb-2">
              Your nickname
            </label>
            <input
              type="text"
              id="nickname"
              className="w-full h-14 px-4 border shadow-[0px_2px_5px_rgba(0,0,0,0.08)_inset] bg-white rounded-xl border-solid border-[#CCC] text-[18px]"
              placeholder="Enter your nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
            />
          </div>

          <div className="mb-12">
            <label className="block text-[18px] font-bold text-[#191919] mb-2">
              Choose your avatar
            </label>
            <AvatarSelector 
              selectedAvatar={selectedAvatar} 
              onSelect={setSelectedAvatar} 
            />
          </div>

          <button
            className="w-full h-14 border text-white text-xl font-bold shadow-[0px_3px_3px_rgba(0,0,0,0.08),0px_5px_7px_rgba(255,255,255,0.20)_inset] bg-[#E72F2F] rounded-2xl border-solid border-[#E72F2F] hover:bg-[#d62b2b] transition-colors"
            onClick={handleStartGame}
          >
            {isChallengeMode ? "Accept Challenge" : "Start the game!"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default PreGame;
