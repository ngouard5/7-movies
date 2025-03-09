
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";

const Countdown = () => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();

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
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <main className="relative w-full max-w-[393px] min-h-[852px] overflow-hidden bg-neutral-50 mx-auto my-0 max-md:w-full">
      <div className="relative">
        <BackgroundGradients />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[120px] font-bold text-[#E72F2F] animate-pulse">
            {count}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Countdown;
