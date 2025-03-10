
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { AvatarSelector } from "@/components/game/AvatarSelector";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/game/LanguageSwitcher";

const PreGame = () => {
  const [nickname, setNickname] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

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
    <main className="relative w-full max-w-[393px] min-h-[852px] overflow-auto bg-neutral-50 mx-auto my-0">
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

        {/* Language switcher */}
        <div className="absolute right-4 top-[69px]">
          <LanguageSwitcher />
        </div>

        <div
          className="absolute text-[64px] left-1/2 -translate-x-1/2 top-[117px]"
          role="img"
          aria-label="Popcorn emoji"
        >
          🍿
        </div>

        <h1 className="absolute w-[361px] text-[40px] leading-[48px] text-center text-[#191919] left-1/2 -translate-x-1/2 top-[229px] max-sm:text-[32px] max-sm:leading-10">
          {isChallengeMode ? t('accept.challenge') : t('before.we.start')}
        </h1>

        <div className="absolute left-1/2 -translate-x-1/2 max-w-[361px] w-full top-[323px] px-4">
          <div className="mb-6">
            <label htmlFor="nickname" className="block text-[18px] font-bold text-[#191919] mb-2">
              {t('your.nickname')}
            </label>
            <input
              type="text"
              id="nickname"
              className="w-full h-14 px-4 border shadow-[0px_2px_5px_rgba(0,0,0,0.08)_inset] bg-white rounded-xl border-solid border-[#CCC] text-[18px]"
              placeholder={t('enter.nickname')}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
            />
          </div>

          <div className="mb-12">
            <label className="block text-[18px] font-bold text-[#191919] mb-2">
              {t('choose.avatar')}
            </label>
            <div className="flex justify-center">
              <AvatarSelector 
                selectedAvatar={selectedAvatar} 
                onSelect={setSelectedAvatar} 
              />
            </div>
          </div>

          <button
            className="w-full h-14 border text-white text-xl font-bold shadow-[0px_3px_3px_rgba(0,0,0,0.08),0px_5px_7px_rgba(255,255,255,0.20)_inset] bg-[#E72F2F] rounded-2xl border-solid border-[#E72F2F] hover:bg-[#d62b2b] transition-colors"
            onClick={handleStartGame}
          >
            {isChallengeMode ? t('accept.challenge.button') : t('start.game')}
          </button>
        </div>
      </div>
    </main>
  );
};

export default PreGame;
