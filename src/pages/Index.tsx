import React from "react";
import { StatusBar } from "@/components/game/StatusBar";
import { MenuButton } from "@/components/game/MenuButton";
import { EmojiCarousel } from "@/components/game/EmojiCarousel";
import { PlayButton } from "@/components/game/PlayButton";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";

const Index = () => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Inter&family=SF+Pro+Display:wght@400;700&display=swap"
        rel="stylesheet"
      />

      <main className="relative w-full max-w-[393px] min-h-[852px] overflow-hidden bg-neutral-50 mx-auto my-0 max-md:w-full">
        <StatusBar />

        <div className="relative">
          <BackgroundGradients />

          <div className="absolute left-4 top-[69px]">
            <MenuButton />
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
            className="absolute left-2/4 -translate-x-2/4 text-xl font-bold text-[#191919] bottom-[45px] hover:text-[#E72F2F] transition-colors"
            onClick={() => console.log("How to play clicked")}
          >
            How to play
          </button>
        </div>
      </main>
    </>
  );
};

export default Index;
