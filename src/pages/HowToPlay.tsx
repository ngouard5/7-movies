import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { NavigationMenu } from "@/components/game/NavigationMenu";
import { AppLayout } from "@/components/layout/AppLayout";
import { TopLeftButton } from "@/components/ui/TopLeftButton";
import { Button } from "@/components/ui/button";

const HowToPlay = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <AppLayout>
      <main className="relative w-full min-h-[852px] overflow-auto bg-neutral-50 mx-auto my-0">
        <div className="relative h-full pb-8">
          <BackgroundGradients />

          <div className="absolute left-4 top-[69px]">
            <TopLeftButton 
              onClick={() => navigate(-1)}
              icon={<ArrowLeft className="w-6 h-6 text-[#E72F2F]" />}
              ariaLabel="Back"
            />
          </div>

          <h1 className="absolute w-[361px] text-[40px] leading-[48px] text-center text-[#191919] left-1/2 -translate-x-1/2 top-[117px] max-sm:text-[32px] max-sm:leading-10 font-fredoka">
            How to play
          </h1>

          <div className="absolute left-1/2 -translate-x-1/2 max-w-[400px] w-full top-[200px] px-4 space-y-8">
            <section className="text-left">
              <h2 className="text-[24px] font-bold text-[#191919] mb-4 font-sf">
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
              <h2 className="text-[24px] font-bold text-[#191919] mb-4 font-sf">
                Examples
              </h2>
              <div className="space-y-2 text-[16px] text-[#191919] font-sf">
                <div>🦁👑🌅🐗 → The Lion King</div>
                <div>🦇👨‍💼🏙️🚗 → Batman</div>
                <div>💊🕶️💻🌀 → The Matrix</div>
              </div>
            </section>

            <section className="text-left">
              <h2 className="text-[24px] font-bold text-[#191919] mb-4 font-sf">
                How the scores work?
              </h2>
              <div className="text-[16px] text-[#191919] leading-[24px] font-sf">
                <p className="mb-3">You earn 100 pts for each movie you find</p>
                <p className="mb-2">Then you get bonus points depending on your quickness:</p>
                <ul className="space-y-1 ml-4">
                  <li>• +50 pts before 10 seconds</li>
                  <li>• +30 pts between 10 and 20 seconds</li>
                  <li>• +10 pts between 20 and 30 seconds</li>
                </ul>
              </div>
            </section>

            {/* Start a new game button */}
            <div className="pt-8">
              <Button 
                onClick={() => navigate('/pre-game')}
                className="w-full h-[60px] bg-[#E72F2F] hover:bg-[#E72F2F]/90 text-white text-[20px] font-bold rounded-[16px] shadow-[0px_3px_3px_rgba(0,0,0,0.06)] font-sf"
              >
                Start a new game
              </Button>
            </div>
          </div>

          <NavigationMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        </div>
      </main>
    </AppLayout>
  );
};

export default HowToPlay;