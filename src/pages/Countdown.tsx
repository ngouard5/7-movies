
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { AppLayout } from "@/components/layout/AppLayout";

const avatars = [
  "🫠", "🥶", "🥸", "🤬", "🤯", "🥳", "🧐", "😈"
];

const Countdown = () => {
  const [count, setCount] = useState<number | string>(3);
  const navigate = useNavigate();
  const nickname = localStorage.getItem("playerNickname") || "Player";
  const avatarIndex = parseInt(localStorage.getItem("playerAvatar") || "0");

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount === 1) {
          clearInterval(timer);
          // Show "GO!" for a brief moment before navigating
          setTimeout(() => {
            navigate("/game");
          }, 1000);
          return "GO!";
        }
        return Number(prevCount) - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <AppLayout>
      <main className="relative w-full h-[852px] overflow-hidden bg-neutral-50 mx-auto my-0 flex items-center justify-center">
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <BackgroundGradients />

          <div className="flex flex-col items-center justify-center">
            {/* Avatar */}
            <div className="w-[100px] h-[100px] flex items-center justify-center text-[64px] bg-[#FFF2CC] border-[#FC3] border-2 rounded-full mb-6">
              {avatars[avatarIndex]}
            </div>
            
            {/* Welcome message */}
            <h2 className="text-2xl font-bold mb-1 font-sf">
              Welcome, {nickname}!
            </h2>
            
            {/* Game will start in */}
            <p className="text-gray-600 mb-8 font-sf">The game will start in</p>
            
            {/* Counter */}
            <div className="text-[120px] font-bold text-[#E72F2F] animate-pulse mb-8 font-fredoka">
              {count}
            </div>
            
            {/* GIF */}
            <img 
              src="https://media.giphy.com/media/cmzp1CfhZRkMtlCuVj/giphy.gif" 
              alt="Countdown animation" 
              className="w-[200px] h-auto rounded-xl"
            />
          </div>
        </div>
      </main>
    </AppLayout>
  );
};

export default Countdown;
