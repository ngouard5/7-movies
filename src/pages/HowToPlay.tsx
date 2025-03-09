
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { NavigationMenu } from "@/components/game/NavigationMenu";

const HowToPlay = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <main className="relative w-full max-w-[393px] min-h-[852px] overflow-hidden bg-neutral-50 mx-auto my-0 max-md:w-full">
      <div className="relative h-full pb-8">
        <BackgroundGradients />

        <div className="absolute left-4 top-[69px] flex">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 flex justify-center items-center border shadow-[0px_3px_3px_rgba(0,0,0,0.06)] bg-white rounded-xl border-solid border-[#CCC] hover:bg-gray-50 transition-colors mr-4"
            aria-label="Back"
          >
            <ArrowLeft className="w-6 h-6 text-[#191919]" />
          </button>

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

        <div className="absolute w-[361px] left-4 top-[134px]">
          <div className="text-[22px] font-bold text-[#191919] mb-6">How to play</div>
          
          <div className="space-y-6">
            <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-[#E72F2F] text-white rounded-full flex items-center justify-center font-bold mr-3">1</div>
                <div className="text-[18px] font-bold text-[#191919]">Choose your avatar</div>
              </div>
              <p className="text-[16px] text-gray-700">
                Select an emoji that represents you and enter your nickname.
              </p>
            </section>

            <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-[#E72F2F] text-white rounded-full flex items-center justify-center font-bold mr-3">2</div>
                <div className="text-[18px] font-bold text-[#191919]">Get ready</div>
              </div>
              <p className="text-[16px] text-gray-700">
                A countdown will give you time to prepare. When it reaches zero, the game starts!
              </p>
            </section>

            <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-[#E72F2F] text-white rounded-full flex items-center justify-center font-bold mr-3">3</div>
                <div className="text-[18px] font-bold text-[#191919]">Guess the movies</div>
              </div>
              <p className="text-[16px] text-gray-700">
                You'll see a series of emojis that represent a movie title. Type your guess in the search box.
              </p>
              <div className="mt-3 flex space-x-2">
                <div className="text-2xl">🧙‍♂️ 💍</div>
                <div className="text-gray-500">→</div>
                <div className="text-[16px] font-medium">The Lord of the Rings</div>
              </div>
            </section>

            <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-[#E72F2F] text-white rounded-full flex items-center justify-center font-bold mr-3">4</div>
                <div className="text-[18px] font-bold text-[#191919]">Beat the clock</div>
              </div>
              <p className="text-[16px] text-gray-700">
                Try to guess all 7 movies as quickly as possible. Your time is being recorded!
              </p>
            </section>

            <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-[#E72F2F] text-white rounded-full flex items-center justify-center font-bold mr-3">5</div>
                <div className="text-[18px] font-bold text-[#191919]">Challenge friends</div>
              </div>
              <p className="text-[16px] text-gray-700">
                Share your result with friends and challenge them to beat your time with the same movies!
              </p>
            </section>
          </div>

          <button
            className="w-full h-14 border text-white text-xl font-bold shadow-[0px_3px_3px_rgba(0,0,0,0.08),0px_5px_7px_rgba(255,255,255,0.20)_inset] bg-[#E72F2F] rounded-2xl border-solid border-[#E72F2F] hover:bg-[#d62b2b] transition-colors mt-8"
            onClick={() => navigate("/pregame")}
          >
            Play now
          </button>
        </div>

        <NavigationMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
    </main>
  );
};

export default HowToPlay;
