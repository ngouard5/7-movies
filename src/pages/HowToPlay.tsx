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
            className="w-12 h-12 flex justify-center items-center border shadow-[0px_3px_3px_rgba(0,0,0,0.06)] bg-white rounded-xl border-solid border-[#CCC] hover:bg-gray-50 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-6 h-6 text-[#191919]" />
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
        </div>

        <NavigationMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
    </main>
  );
};

export default HowToPlay;
