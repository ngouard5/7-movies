
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MenuButton } from "@/components/game/MenuButton";
import { EmojiCarousel } from "@/components/game/EmojiCarousel";
import { PlayButton } from "@/components/game/PlayButton";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { NavigationMenu } from "@/components/game/NavigationMenu";

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Inter&family=SF+Pro+Display:wght@400;700&display=swap"
        rel="stylesheet"
      />

      <main className="relative w-full max-w-[393px] min-h-[852px] overflow-hidden bg-neutral-50 mx-auto my-0 max-md:w-full">
        <div className="relative">
          <BackgroundGradients />

          <div className="absolute left-4 top-[69px]">
            <button 
              onClick={() => setMenuOpen(true)}
              className="w-12 h-12 flex justify-center items-center border shadow-[0px_3px_3px_rgba(0,0,0,0.06)] bg-white rounded-xl border-solid border-[#CCC] hover:bg-gray-50 transition-colors"
              aria-label="Menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_304_64"
                  style={{ maskType: "alpha" }}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                >
                  <rect width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_304_64)">
                  <path
                    d="M4 18C3.71667 18 3.47917 17.9042 3.2875 17.7125C3.09583 17.5208 3 17.2833 3 17C3 16.7167 3.09583 16.4792 3.2875 16.2875C3.47917 16.0958 3.71667 16 4 16H20C20.2833 16 20.5208 16.0958 20.7125 16.2875C20.9042 16.4792 21 16.7167 21 17C21 17.2833 20.9042 17.5208 20.7125 17.7125C20.5208 17.9042 20.2833 18 20 18H4ZM4 13C3.71667 13 3.47917 12.9042 3.2875 12.7125C3.09583 12.5208 3 12.2833 3 12C3 11.7167 3.09583 11.4792 3.2875 11.2875C3.47917 11.0958 3.71667 11 4 11H20C20.2833 11 20.5208 11.0958 20.7125 11.2875C20.9042 11.4792 21 11.7167 21 12C21 12.2833 20.9042 12.5208 20.7125 12.7125C20.5208 12.9042 20.2833 13 20 13H4ZM4 8C3.71667 8 3.47917 7.90417 3.2875 7.7125C3.09583 7.52083 3 7.28333 3 7C3 6.71667 3.09583 6.47917 3.2875 6.2875C3.47917 6.09583 3.71667 6 4 6H20C20.2833 6 20.5208 6.09583 20.7125 6.2875C20.9042 6.47917 21 6.71667 21 7C21 7.28333 20.9042 7.52083 20.7125 7.7125C20.5208 7.90417 20.2833 8 20 8H4Z"
                    fill="#E72F2F"
                  />
                </g>
              </svg>
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
            Find 7 movies with emojis
          </h1>

          <div className="absolute w-full top-[365px]">
            <EmojiCarousel />
          </div>

          <section className="absolute w-[361px] text-[22px] leading-[30px] text-[#191919] left-4 top-[521px] max-sm:text-lg max-sm:leading-[26px]">
            <p>
              Guess <strong>7 movie titles</strong> based on emojis, in the
              shortest period of time!
            </p>
            <p className="mt-6">Challenge your friends to beat your record!</p>
          </section>

          <div className="absolute left-4 top-[703px]">
            <PlayButton />
          </div>

          <button
            className="absolute left-2/4 -translate-x-2/4 text-xl font-bold text-[#191919] top-[755px] mt-4 hover:text-[#E72F2F] transition-colors"
            onClick={() => navigate("/how-to-play")}
          >
            How to play
          </button>
        </div>

        <NavigationMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      </main>
    </>
  );
};

export default Index;
