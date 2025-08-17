
import React, { useState, useEffect } from "react";
import { getUniqueEmojis } from "@/data/movies";

export const EmojiCarousel = () => {
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0);
  const [animationState, setAnimationState] = useState("visible"); // "visible", "exit", "enter"

  // Get random emoji sets from the movies array - randomize them each time
  const [uniqueEmojis] = useState(() => {
    const emojis = getUniqueEmojis(50); // Get more emojis first
    // Shuffle the array to get random order
    const shuffled = [...emojis].sort(() => 0.5 - Math.random());
    // Take only 10 random ones
    return shuffled.slice(0, 10);
  });

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
        }, 300);
      }, 300); // Match the duration of the exit animation
      
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [uniqueEmojis.length]);

  // Determine the animation classes based on the current state
  const getAnimationClass = () => {
    switch (animationState) {
      case "enter":
        return "translate-x-0 opacity-100 animate-slide-in-right";
      case "exit":
        return "translate-x-full opacity-100 animate-slide-out-left";
      case "visible":
      default:
        return "translate-x-0 opacity-100";
    }
  };

  return (
    <div className="w-full h-[116px] shadow-[0px_2px_5px_rgba(0,0,0,0.10)_inset] bg-[#FFF2CC] border-y-[#FC3] border-t border-solid border-b flex items-center justify-center overflow-hidden">
      <div 
        className={`text-5xl transition-all duration-300 ${getAnimationClass()}`}
      >
        {uniqueEmojis[currentEmojiIndex]}
      </div>
    </div>
  );
};
