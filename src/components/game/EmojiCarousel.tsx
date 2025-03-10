
import React, { useState, useEffect } from "react";
import { movieEmojis } from "@/data/movieEmojis";

export const EmojiCarousel = () => {
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Get unique emoji sets from the movieEmojis array
  const uniqueEmojis = Array.from(
    new Set(movieEmojis.map((movie) => movie.emojis))
  ).slice(0, 10); // Limit to 10 unique emoji sets

  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade out
      setIsVisible(false);
      
      // After fade out completes, change the emoji and fade in
      setTimeout(() => {
        setCurrentEmojiIndex((prevIndex) => (prevIndex + 1) % uniqueEmojis.length);
        setIsVisible(true);
      }, 500); // Half of the transition time for fade out
      
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval);
  }, [uniqueEmojis.length]);

  return (
    <div className="w-full h-[116px] shadow-[0px_2px_5px_rgba(0,0,0,0.10)_inset] bg-[#FFF2CC] border-y-[#FC3] border-t border-solid border-b flex items-center justify-center overflow-hidden">
      <div 
        className={`text-5xl transition-opacity duration-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {uniqueEmojis[currentEmojiIndex]}
      </div>
    </div>
  );
};
