"use client";

import { EmojiCarousel } from "@/components/EmojiCarousel";
import { MenuButton } from "@/components/MenuButton";
import { PlayButton } from "@/components/PlayButton";

export default function Home() {
  return (
    <div className="relative h-full flex flex-col justify-between">
      <div className="absolute left-4 top-4 md:top-8">
        <MenuButton />
      </div>
      <div className="flex flex-col">
        <div
          className="mt-32 text-6xl text-center"
          role="img"
          aria-label="Popcorn emoji"
        >
          🍿
        </div>
        <h1 className="mt-12 px-4 font-fredoka font-semibold text-balance text-5xl text-center">
          Find 7 movies with emojis
        </h1>
        <div className="mt-10 w-full">
          <EmojiCarousel />
        </div>
        <div className="mt-10 px-4 text-xl">
          <p>
            Guess <span className="font-bold">7 movie titles</span> based on
            emojis, in the shortest period of time!
          </p>
          <p className="mt-6">Challenge your friends to beat your record!</p>
        </div>
      </div>
      <div className="flex flex-col items-center pb-8 mt-8">
        <div className="w-[360px]">
          <PlayButton />
        </div>
        <button
          className="text-xl font-bold text-foreground mt-4 hover:text-[#E72F2F] transition-colors"
          onClick={() => console.log("go to /how-to-play")}
        >
          How to play
        </button>
      </div>
    </div>
  );
}
