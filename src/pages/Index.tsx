import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmojiCarousel } from "@/components/game/EmojiCarousel";
import { PlayButton } from "@/components/game/PlayButton";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { NavigationMenu } from "@/components/game/NavigationMenu";
import { MenuButton } from "@/components/game/MenuButton";
import { HeaderLayout } from "@/components/layout/HeaderLayout";
import { AppLayout } from "@/components/layout/AppLayout";
import { useLanguage } from "@/contexts/LanguageContext";
const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  return <AppLayout>
      <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Inter&family=SF+Pro+Display:wght@400;700&display=swap" rel="stylesheet" />

      <HeaderLayout
        leftButton={
          <div onClick={() => setMenuOpen(true)} aria-label="Menu" className="cursor-pointer">
            <MenuButton />
          </div>
        }
      >
        <div className="relative flex-1">
          
          <div className="flex flex-col items-center space-y-8 px-4 pt-8 pb-8">
            <div className="text-[64px]" role="img" aria-label="Popcorn emoji">
              🍿
            </div>

            <h1 className="w-[90%] max-w-[400px] text-[40px] leading-[48px] text-center text-[#191919] max-sm:text-[32px] max-sm:leading-10 font-fredoka whitespace-pre-line">
              {t('find.movies')}
            </h1>
          </div>

          <div className="w-full">
            <EmojiCarousel />
          </div>

          <div className="flex flex-col items-center space-y-8 px-4 pt-8">
            <section className="w-[90%] max-w-[400px] text-[22px] leading-[30px] text-[#191919] text-center max-sm:text-lg max-sm:leading-[26px] font-sf">
              <p>
                {t('game.description')}
              </p>
            </section>

            <div className="w-[90%] max-w-[400px]">
              <PlayButton />
            </div>

            <button onClick={() => navigate("/how-to-play")} className="text-xl font-bold text-[#191919] hover:text-[#E72F2F] transition-colors font-sf">
              {t('how.to.play')}
            </button>
          </div>

          <NavigationMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        </div>
      </HeaderLayout>
    </AppLayout>;
};
export default Index;