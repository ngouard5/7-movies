import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { NavigationMenu } from "@/components/game/NavigationMenu";
import { AppLayout } from "@/components/layout/AppLayout";
import { HeaderLayout } from "@/components/layout/HeaderLayout";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

const HowToPlay = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <AppLayout>
      <HeaderLayout
        leftButton={
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 flex justify-center items-center border shadow-[0px_3px_3px_rgba(0,0,0,0.06)] bg-white rounded-xl border-solid border-[#CCC] hover:bg-gray-50 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-6 h-6 text-[#E72F2F]" />
          </button>
        }
      >
        <div className="relative flex-1">
          <BackgroundGradients />
          
          <div className="flex flex-col items-center px-4 pt-8 space-y-8">
            <h1 className="w-full max-w-[361px] text-[40px] leading-[48px] text-left text-[#191919] max-sm:text-[32px] max-sm:leading-10 font-fredoka">
              How to play
            </h1>

            <div className="max-w-[400px] w-full space-y-8">
              <section className="text-left">
                <h2 className="text-[24px] font-bold text-[#191919] mb-4 font-fredoka">
                  Guess the movie titles
                </h2>
                <ul className="text-[16px] text-[#191919] leading-[24px] space-y-2 font-sf">
                  <li>• Start a new game and choose your nickname and emoji</li>
                  <li>• Find movie titles as fast as you can</li>
                  <li>• You can write titles both in 🇫🇷 and 🇬🇧</li>
                  <li>• Once you've done, challenge your friend to beat your score!</li>
                </ul>
              </section>

              <section className="text-left">
                <h2 className="text-[24px] font-bold text-[#191919] mb-4 font-fredoka">
                  Examples
                </h2>
                <div className="space-y-2 text-[16px] text-[#191919] font-sf">
                  <div>🦁👑🌅🐗 → The Lion King</div>
                  <div>🦇👨‍💼🏙️🚗 → Batman</div>
                  <div>💊🕶️💻🌀 → The Matrix</div>
                </div>
              </section>

              <section className="text-left">
                <h2 className="text-[24px] font-bold text-[#191919] mb-4 font-fredoka">
                  How the scores work?
                </h2>
                <div className="text-[16px] text-[#191919] leading-[24px] font-sf">
                  <p className="mb-3">You earn 100 pts for each movie you find.</p>
                  <p className="mb-2">Then you get bonus points depending on your quickness:</p>
                  <ul className="space-y-1 ml-4 mb-4">
                    <li>• +50 pts before 10 seconds</li>
                    <li>• +30 pts between 10 and 20 seconds</li>
                    <li>• +10 pts between 20 and 30 seconds</li>
                  </ul>
                  <p className="mb-3">You can use the hints, but sparingly! Each hint costs you 5 points.</p>
                </div>
              </section>

              <div className="pt-4">
                <PrimaryButton onClick={() => navigate('/pre-game')}>
                  Start a new game
                </PrimaryButton>
              </div>
            </div>
          </div>

          <NavigationMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        </div>
      </HeaderLayout>
    </AppLayout>
  );
};

export default HowToPlay;