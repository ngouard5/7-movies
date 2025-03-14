"use client";

import { EmojiCarousel } from "@/components/EmojiCarousel";
import { MenuButton } from "@/components/MenuButton";
import { PlayButton } from "@/components/PlayButton";
import { useAppContext } from "@/contexts/AppContext";

export default function Home() {
  const { setMenuOpen } = useAppContext();

  return (
    <div className="relative flex flex-col items-center px-4">
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
      <h1 className="font-fredoka font-semibold text-balance absolute w-[90%] max-w-[361px] text-[40px] leading-[48px] text-5xl text-center text-[#191919] left-1/2 -translate-x-1/2 top-[229px] max-sm:text-[32px] max-sm:leading-10">
        Find 7 movies with emojis
      </h1>
      <div className="absolute w-full left-0 top-[365px]">
        <EmojiCarousel />
      </div>
      <section className="absolute w-[90%] max-w-[361px] text-[22px] leading-[30px] text-[#191919] left-1/2 -translate-x-1/2 top-[521px] max-sm:text-lg max-sm:leading-[26px] mb-8">
        <p>
          Guess <span className="font-bold">7 movie titles</span> based on
          emojis, in the shortest period of time!
        </p>
        <p className="mt-6">Challenge your friends to beat your record!</p>
      </section>
      <div className="absolute left-1/2 -translate-x-1/2 w-[90%] max-w-[361px] top-[703px]">
        <PlayButton />
      </div>
      <button
        className="absolute left-1/2 -translate-x-1/2 text-xl font-bold text-[#191919] top-[755px] mt-4 hover:text-[#E72F2F] transition-colors"
        onClick={() => console.log("go to /how-to-play")}
      >
        How to play
      </button>
    </div>
  );
}
