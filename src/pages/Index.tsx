
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

  return (
    <AppLayout>
      <link
        href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Inter&family=SF+Pro+Display:wght@400;700&display=swap"
        rel="stylesheet"
      />

      <main className="relative w-full min-h-[852px] overflow-auto bg-neutral-50">
        <div className="relative flex flex-col items-center px-4">
          <BackgroundGradients />

          <div className="absolute left-4 top-[69px]">
            <div 
              onClick={() => setMenuOpen(true)}
              aria-label="Menu"
              className="cursor-pointer"
            >
              <MenuButton />
            </div>
          </div>

          <div
            className="absolute text-[64px] left-1/2 -translate-x-1/2 top-[117px]"
            role="img"
            aria-label="Popcorn emoji"
          >
            🍿
          </div>

          <h1 className="absolute w-[90%] max-w-[361px] text-[40px] leading-[48px] text-center text-[#191919] left-1/2 -translate-x-1/2 top-[229px] max-sm:text-[32px] max-sm:leading-10">
            Find 7 movies with emojis
          </h1>

          <div className="absolute w-full left-0 top-[365px]">
            <EmojiCarousel />
          </div>

          <section className="absolute w-[90%] max-w-[361px] text-[22px] leading-[30px] text-[#191919] left-1/2 -translate-x-1/2 top-[521px] max-sm:text-lg max-sm:leading-[26px]">
            <p>
              Guess 7 movie titles based on emojis, in the shortest period of time!
            </p>
            <p className="mt-6">Challenge your friends to beat your record!</p>
          </section>

          <div className="absolute left-1/2 -translate-x-1/2 w-[90%] max-w-[361px] top-[703px]">
            <PlayButton />
          </div>

          <button
            className="absolute left-1/2 -translate-x-1/2 text-xl font-bold text-[#191919] top-[755px] mt-4 hover:text-[#E72F2F] transition-colors"
            onClick={() => navigate("/how-to-play")}
          >
            How to play
          </button>
        </div>

        <NavigationMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      </main>
    </AppLayout>
  );
};

export default Index;
