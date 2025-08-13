
import React, { useState, useEffect } from "react";
import { getUniqueEmojis } from "@/data/movies";

export const EmojiCarousel = () => {
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0);
  const [animationState, setAnimationState] = useState("visible"); // "visible", "exit", "enter"

  // Get unique emoji sets from the movies array
  const uniqueEmojis = getUniqueEmojis(10);

  useEffect(() => {
    const interval = setInterval(() => {
      // Start exit animation
      setAnimationState("exit");
      
      // After exit animation completes, change the emoji and start enter animation
      setTimeout(() => {
        setCurrentEmojiIndex((prevIndex) => (prevIndex + 1) % uniqueEmojis.length);
        setAnimationState("enter");
        
        // After enter animation completes, set to visible state
        setTimeout(() => {
          setAnimationState("visible");
        }, 500);
      }, 500); // Match the duration of the exit animation
      
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval);
  }, [uniqueEmojis.length]);

  // Determine the animation classes based on the current state
  const getAnimationClass = () => {
    switch (animationState) {
      case "enter":
        return "translate-y-0 opacity-100 animate-slide-in-bottom";
      case "exit":
        return "-translate-y-full opacity-0 animate-slide-out-top";
      case "visible":
      default:
        return "translate-y-0 opacity-100";
    }
  };

  return (
    <div className="w-full h-[116px] shadow-[0px_2px_5px_rgba(0,0,0,0.10)_inset] bg-[#FFF2CC] border-y-[#FC3] border-t border-solid border-b flex items-center justify-center overflow-hidden">
      <div 
        className={`text-5xl transition-all duration-500 ${getAnimationClass()}`}
      >
        {uniqueEmojis[currentEmojiIndex]}
      </div>
    </div>
  );
};
