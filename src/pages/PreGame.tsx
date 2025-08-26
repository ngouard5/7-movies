
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { AvatarSelector } from "@/components/game/AvatarSelector";
import { useToast } from "@/hooks/use-toast";
import { HeaderLayout } from "@/components/layout/HeaderLayout";
import { AppLayout } from "@/components/layout/AppLayout";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useLanguage } from "@/contexts/LanguageContext";

import { CategoryKey } from "@/utils/category";

const PreGame = () => {
  const [nickname, setNickname] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("all");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  // Category options with emojis
  const categoryOptions = [
    { value: 'all', label: t('category.all'), emoji: '🎬' },
    { value: 'blockbusters', label: t('category.blockbusters'), emoji: '💥' },
    { value: 'disney', label: t('category.disney'), emoji: '🏰' },
    { value: 'animation', label: t('category.animation'), emoji: '🎨' },
    { value: 'superheroes', label: t('category.superheroes'), emoji: '🦸' },
    { value: 'comedies', label: t('category.comedies'), emoji: '😂' },
    { value: 'fantasy', label: t('category.fantasy'), emoji: '🧙' },
    { value: 'scifi', label: t('category.scifi'), emoji: '🚀' },
    { value: 'true_stories', label: t('category.true_stories'), emoji: '📖' },
  ] as const;

  // Load saved user data when component mounts
  useEffect(() => {
    const savedNickname = localStorage.getItem("playerNickname");
    const savedAvatar = localStorage.getItem("playerAvatar");
    const savedCategory = localStorage.getItem("selectedCategory") as CategoryKey;
    
    if (savedNickname) {
      setNickname(savedNickname);
    }
    
    if (savedAvatar) {
      setSelectedAvatar(parseInt(savedAvatar));
    }
    
    if (savedCategory) {
      setSelectedCategory(savedCategory);
    }
  }, []);

  const handleStartGame = () => {
    if (!nickname.trim()) {
      toast({
        title: t('your.nickname'),
        description: t('enter.nickname'),
        variant: "destructive",
      });
      return;
    }
    
    // Save player data
    localStorage.setItem("playerNickname", nickname);
    localStorage.setItem("playerAvatar", selectedAvatar.toString());
    localStorage.setItem("selectedCategory", selectedCategory);
    
    // Navigate to countdown page
    navigate("/countdown");
  };

  const handleBackClick = () => {
    // Always navigate to index page
    navigate("/");
  };

  // Check for challenge mode - only consider it if we have both movies and source info
  const isChallengeMode = localStorage.getItem("challengeMovies") !== null && 
                         localStorage.getItem("challengeSourceSessionId") !== null;

  return (
    <AppLayout>
      <HeaderLayout
        leftButton={
          <button 
            onClick={handleBackClick}
            className="w-12 h-12 flex justify-center items-center border shadow-[0px_3px_3px_rgba(0,0,0,0.06)] bg-white rounded-xl border-solid border-[#CCC] hover:bg-gray-50 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-6 h-6 text-[#E72F2F]" />
          </button>
        }
      >
        <div className="relative flex-1 flex flex-col items-center">

          <div className="flex flex-col items-center pt-4 space-y-6 px-4 w-full">
            <div
              className="text-[48px]"
              role="img"
              aria-label="Popcorn emoji"
            >
              🍿
            </div>

            {isChallengeMode && (
              <h1 className="w-full max-w-[400px] text-[40px] leading-[48px] text-center text-[#191919] max-sm:text-[32px] max-sm:leading-10 font-fredoka">
                {t('accept.challenge')}
              </h1>
            )}

            <div className="max-w-[400px] w-full space-y-6">
              <div>
                <label htmlFor="nickname" className="block text-[18px] font-bold text-[#191919] mb-2 text-left font-sf">
                  {t('your.nickname')}
                </label>
                <input
                  type="text"
                  id="nickname"
                  className="w-full h-14 px-4 border shadow-[0px_2px_5px_rgba(0,0,0,0.08)_inset] bg-white rounded-xl border-solid border-[#CCC] text-[18px] font-sf"
                  placeholder={t('enter.nickname')}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={20}
                />
              </div>

              <div className="mb-8">
                <label className="block text-[18px] font-bold text-[#191919] mb-2 text-left font-sf">
                  {t('choose.avatar')}
                </label>
                <div className="flex justify-center">
                  <AvatarSelector 
                    selectedAvatar={selectedAvatar} 
                    onSelect={setSelectedAvatar} 
                  />
                </div>
              </div>

              {!isChallengeMode && (
                <div className="mb-6">
                  <label htmlFor="category" className="block text-[18px] font-bold text-[#191919] mb-2 text-left font-sf">
                    {t('choose.category')}
                  </label>
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as CategoryKey)}
                    className="w-full h-14 px-4 border shadow-[0px_2px_5px_rgba(0,0,0,0.08)_inset] bg-white rounded-xl border-solid border-[#CCC] text-[18px] font-sf"
                  >
                    {categoryOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.emoji} {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <PrimaryButton onClick={handleStartGame}>
                {isChallengeMode ? t('accept.challenge.button') : t('start.game')}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </HeaderLayout>
    </AppLayout>
  );
};

export default PreGame;
