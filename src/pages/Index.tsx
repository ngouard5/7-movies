import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmojiCarousel } from "@/components/game/EmojiCarousel";
import { PlayButton } from "@/components/game/PlayButton";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { NavigationMenu } from "@/components/game/NavigationMenu";
import { MenuButton } from "@/components/game/MenuButton";
import { AppLayout } from "@/components/layout/AppLayout";
const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  return <AppLayout>
      <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Inter&family=SF+Pro+Display:wght@400;700&display=swap" rel="stylesheet" />

      <main className="relative w-full min-h-[852px] overflow-auto bg-neutral-50">
        <div className="flex flex-col items-center px-4 pt-16 pb-8 space-y-8">
          <BackgroundGradients />

          <div className="absolute left-4 top-[69px]">
            <div onClick={() => setMenuOpen(true)} aria-label="Menu" className="cursor-pointer">
              <MenuButton />
            </div>
          </div>

          <div className="text-[64px] mt-4" role="img" aria-label="Popcorn emoji">
            🍿
          </div>

          <h1 className="w-[90%] max-w-[361px] text-[40px] leading-[48px] text-center text-[#191919] max-sm:text-[32px] max-sm:leading-10">
            Find 7 movies with emojis
          </h1>

          <div className="w-full">
            <EmojiCarousel />
          </div>

          <section className="w-[90%] max-w-[361px] text-[22px] leading-[30px] text-[#191919] text-center max-sm:text-lg max-sm:leading-[26px]">
            <p>
              Guess 7 movie titles based on emojis, in the shortest period of time!
            </p>
          </section>

          <div className="w-[90%] max-w-[361px]">
            <PlayButton />
          </div>

          <button onClick={() => navigate("/how-to-play")} className="text-xl font-bold text-[#191919] hover:text-[#E72F2F] transition-colors">
            How to play
          </button>
        </div>

        <NavigationMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      </main>
    </AppLayout>;
};
export default Index;