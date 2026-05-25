
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { HeaderLayout } from "@/components/layout/HeaderLayout";
import { AppLayout } from "@/components/layout/AppLayout";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { CategoryKey } from "@/utils/category";

const PreGame = () => {
  const [nickname, setNickname] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<CategoryKey[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const categoryOptions: { value: CategoryKey; label: string; emoji: string }[] = [
    { value: 'blockbusters', label: t('category.blockbusters'), emoji: '💥' },
    { value: 'disney', label: t('category.disney'), emoji: '🏰' },
    { value: 'animation', label: t('category.animation'), emoji: '🎨' },
    { value: 'superheroes', label: t('category.superheroes'), emoji: '🦸' },
    { value: 'comedies', label: t('category.comedies'), emoji: '😂' },
    { value: 'fantasy', label: t('category.fantasy'), emoji: '🧙' },
    { value: 'scifi', label: t('category.scifi'), emoji: '🚀' },
    { value: 'true_stories', label: t('category.true_stories'), emoji: '📖' },
  ];

  useEffect(() => {
    const savedNickname = localStorage.getItem("playerNickname");
    const savedCategories = localStorage.getItem("selectedCategories");

    if (savedNickname) setNickname(savedNickname);
    if (savedCategories) setSelectedCategories(JSON.parse(savedCategories));
  }, []);

  const toggleCategory = (value: CategoryKey) => {
    setSelectedCategories(prev =>
      prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
    );
  };

  const handleStartGame = () => {
    if (!nickname.trim()) {
      toast({
        title: t('your.nickname'),
        description: t('enter.nickname'),
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("playerNickname", nickname);
    localStorage.setItem("playerAvatar", "0");
    localStorage.setItem("selectedCategories", JSON.stringify(selectedCategories));

    navigate("/countdown");
  };

  const isChallengeMode = localStorage.getItem("challengeMovies") !== null &&
    localStorage.getItem("challengeSourceSessionId") !== null;

  return (
    <AppLayout>
      <HeaderLayout
        leftButton={
          <button
            onClick={() => navigate("/")}
            className="w-12 h-12 flex justify-center items-center border shadow-[0px_3px_3px_rgba(0,0,0,0.06)] bg-white rounded-xl border-solid border-[#CCC] hover:bg-gray-50 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-6 h-6 text-[#E72F2F]" />
          </button>
        }
      >
        <div className="relative flex-1 flex flex-col items-center">
          <div className="flex flex-col items-center pt-4 space-y-6 px-4 w-full">
            <div className="text-[48px]" role="img" aria-label="Popcorn emoji">🍿</div>

            {isChallengeMode && (
              <h1 className="w-full max-w-[400px] text-[40px] leading-[48px] text-center text-[#191919] max-sm:text-[32px] max-sm:leading-10 font-fredoka">
                {t('accept.challenge')}
              </h1>
            )}

            <div className="max-w-[400px] md:max-w-[560px] w-full space-y-6">
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

              {!isChallengeMode && (
                <div>
                  <label className="block text-[18px] font-bold text-[#191919] mb-2 text-left font-sf">
                    {t('choose.category')}
                  </label>
                  <div className="flex flex-col gap-2">
                    <label
                      className={`flex items-center gap-3 px-4 h-14 border rounded-xl cursor-pointer transition-colors font-sf ${
                        selectedCategories.length === 0
                          ? "bg-[#FFF2CC] border-[#FC3]"
                          : "bg-white border-[#CCC] hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-xl">🎬</span>
                      <span className="flex-1 text-[16px] text-[#191919] font-bold">{t('category.all')}</span>
                      <input
                        type="checkbox"
                        checked={selectedCategories.length === 0}
                        onChange={() => setSelectedCategories([])}
                        className="w-5 h-5 accent-[#E72F2F] cursor-pointer"
                      />
                    </label>

                    {categoryOptions.map(opt => {
                      const isSelected = selectedCategories.includes(opt.value);
                      return (
                        <label
                          key={opt.value}
                          className={`flex items-center gap-3 px-4 h-14 border rounded-xl cursor-pointer transition-colors font-sf ${
                            isSelected
                              ? "bg-[#FFF2CC] border-[#FC3]"
                              : "bg-white border-[#CCC] hover:bg-gray-50"
                          }`}
                        >
                          <span className="text-xl">{opt.emoji}</span>
                          <span className="flex-1 text-[16px] text-[#191919]">{opt.label}</span>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleCategory(opt.value)}
                            className="w-5 h-5 accent-[#E72F2F] cursor-pointer"
                          />
                        </label>
                      );
                    })}
                  </div>
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
