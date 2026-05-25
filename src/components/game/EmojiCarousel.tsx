
import React, { useState, useEffect, useRef } from "react";
import { getUniqueEmojis } from "@/data/movies";

export const EmojiCarousel = () => {
  const [uniqueEmojis] = useState(() => {
    const emojis = getUniqueEmojis(50);
    return [...emojis].sort(() => 0.5 - Math.random()).slice(0, 10);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  // phase: "visible" | "exit" | "enter"
  const [phase, setPhase] = useState<"visible" | "exit" | "enter">("visible");
  const nextIndex = useRef(1);

  useEffect(() => {
    const interval = setInterval(() => {
      nextIndex.current = (currentIndex + 1) % uniqueEmojis.length;

      // 1. Start exit
      setPhase("exit");

      // 2. After exit, swap emoji and set to "enter" (starts off-screen right, no transition)
      setTimeout(() => {
        setCurrentIndex(nextIndex.current);
        setPhase("enter");

        // 3. After a frame, animate to visible
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setPhase("visible");
          });
        });
      }, 280);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, uniqueEmojis.length]);

  const getStyle = (): React.CSSProperties => {
    switch (phase) {
      case "exit":
        return { opacity: 0, transform: "translateX(-40px)", transition: "opacity 280ms ease, transform 280ms ease" };
      case "enter":
        return { opacity: 0, transform: "translateX(40px)", transition: "none" };
      case "visible":
        return { opacity: 1, transform: "translateX(0)", transition: "opacity 280ms ease, transform 280ms ease" };
    }
  };

  return (
    <div className="w-full h-[116px] shadow-[0px_2px_5px_rgba(0,0,0,0.10)_inset] bg-[#FFF2CC] border-y-[#FC3] border-t border-solid border-b flex items-center justify-center overflow-hidden">
      <div className="text-5xl" style={getStyle()}>
        {uniqueEmojis[currentIndex]}
      </div>
    </div>
  );
};
