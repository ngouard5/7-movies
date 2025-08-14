import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmojiCarousel } from "@/components/game/EmojiCarousel";
import { PlayButton } from "@/components/game/PlayButton";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { NavigationMenu } from "@/components/game/NavigationMenu";
import { TopLeftButton } from "@/components/ui/TopLeftButton";
import { AppLayout } from "@/components/layout/AppLayout";
const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  return <AppLayout>
      <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Inter&family=SF+Pro+Display:wght@400;700&display=swap" rel="stylesheet" />

      <main className="relative w-full min-h-[852px] overflow-auto bg-neutral-50">
        <div className="flex flex-col items-center pt-16 pb-8 space-y-8 px-0 py-0">
          <BackgroundGradients />

          <TopLeftButton
            onClick={() => setMenuOpen(true)}
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 18C3.71667 18 3.47917 17.9042 3.2875 17.7125C3.09583 17.5208 3 17.2833 3 17C3 16.7167 3.09583 16.4792 3.2875 16.2875C3.47917 16.0958 3.71667 16 4 16H20C20.2833 16 20.5208 16.0958 20.7125 16.2875C20.9042 16.4792 21 16.7167 21 17C21 17.2833 20.9042 17.5208 20.7125 17.7125C20.5208 17.9042 20.2833 18 20 18H4ZM4 13C3.71667 13 3.47917 12.9042 3.2875 12.7125C3.09583 12.5208 3 12.2833 3 12C3 11.7167 3.09583 11.4792 3.2875 11.2875C3.47917 11.0958 3.71667 11 4 11H20C20.2833 11 20.5208 11.0958 20.7125 11.2875C20.9042 11.4792 21 11.7167 21 12C21 12.2833 20.9042 12.5208 20.7125 12.7125C20.5208 12.9042 20.2833 13 20 13H4ZM4 8C3.71667 8 3.47917 7.90417 3.2875 7.7125C3.09583 7.52083 3 7.28333 3 7C3 6.71667 3.09583 6.47917 3.2875 6.2875C3.47917 6.09583 3.71667 6 4 6H20C20.2833 6 20.5208 6.09583 20.7125 6.2875C20.9042 6.47917 21 6.71667 21 7C21 7.28333 20.9042 7.52083 20.7125 7.7125C20.5208 7.90417 20.2833 8 20 8H4Z"
                  fill="#E72F2F"
                />
              </svg>
            }
            ariaLabel="Menu"
          />

          <div className="text-[64px] mt-4" role="img" aria-label="Popcorn emoji">
            🍿
          </div>

          <h1 className="w-[90%] max-w-[361px] text-[40px] leading-[48px] text-center text-[#191919] max-sm:text-[32px] max-sm:leading-10 font-fredoka">
            Find 7 movies with emojis
          </h1>

          <div className="w-full">
            <EmojiCarousel />
          </div>

          <section className="w-[90%] max-w-[361px] text-[22px] leading-[30px] text-[#191919] text-center max-sm:text-lg max-sm:leading-[26px] font-sf">
            <p>
              Guess 7 movie titles based on emojis, in the shortest period of time!
            </p>
          </section>

          <div className="w-[90%] max-w-[361px]">
            <PlayButton />
          </div>

          <button onClick={() => navigate("/how-to-play")} className="text-xl font-bold text-[#191919] hover:text-[#E72F2F] transition-colors font-sf">
            How to play
          </button>
        </div>

        <NavigationMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      </main>
    </AppLayout>;
};
export default Index;