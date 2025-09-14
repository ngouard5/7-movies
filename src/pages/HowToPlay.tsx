import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { NavigationMenu } from "@/components/game/NavigationMenu";
import { AppLayout } from "@/components/layout/AppLayout";
import { HeaderLayout } from "@/components/layout/HeaderLayout";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useLanguage } from "@/contexts/LanguageContext";

const HowToPlay = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>How to Play - movie.guessr | Learn the Rules</title>
        <meta name="description" content="Learn how to play movie.guessr! Complete guide with rules, scoring system, and tips to master the emoji movie guessing game." />
        <link rel="canonical" href="https://movie.guessr.app/how-to-play" />
        <meta property="og:title" content="How to Play - movie.guessr | Learn the Rules" />
        <meta property="og:description" content="Learn how to play movie.guessr! Complete guide with rules, scoring system, and tips to master the emoji movie guessing game." />
        <meta property="og:url" content="https://movie.guessr.app/how-to-play" />
      </Helmet>
      <AppLayout>
      <HeaderLayout
        leftButton={
            <button 
              onClick={() => navigate(-1)}
              className="w-12 h-12 flex justify-center items-center border shadow-[0px_3px_3px_rgba(0,0,0,0.06)] bg-white rounded-xl border-solid border-[#CCC] hover:bg-gray-50 transition-colors"
              aria-label={t('back')}
            >
              <ArrowLeft className="w-6 h-6 text-[#E72F2F]" />
            </button>
        }
      >
        <div className="relative flex-1">
          
          <div className="flex flex-col items-center px-4 pt-8 space-y-8">
            <h1 className="w-full max-w-[400px] text-[40px] leading-[48px] text-left text-[#191919] max-sm:text-[32px] max-sm:leading-10 font-fredoka">
              {t('how.to.play')}
            </h1>

            <div className="max-w-[400px] w-full space-y-8">
              <section className="text-left">
                <h2 className="text-[24px] font-bold text-[#191919] mb-4 font-fredoka">
                  {t('guess.titles')}
                </h2>
                <ul className="text-[16px] text-[#191919] leading-[24px] space-y-2 font-sf">
                  <li>• {t('step1.description')}</li>
                  <li>• {t('step2.description')}</li>
                  <li>• {t('step3.description')}</li>
                  <li>• {t('step4.description')}</li>
                </ul>
              </section>

              <section className="text-left">
                <h2 className="text-[24px] font-bold text-[#191919] mb-4 font-fredoka">
                  {t('examples')}
                </h2>
                <div className="space-y-2 text-[16px] text-[#191919] font-sf">
                  <div>🦁 👑 🌅 🐗 → {t('howtoplay.movie1')}</div>
                  <div>⚡️ 🏰 🧙‍♂️ 🧹 → {t('howtoplay.movie2')}</div>
                  <div>💊 🕶️ 💻 🌀 → {t('howtoplay.movie3')}</div>
                </div>
              </section>

              <section className="text-left">
                <h2 className="text-[24px] font-bold text-[#191919] mb-4 font-fredoka">
                  {t('how.scores.work')}
                </h2>
                <div className="text-[16px] text-[#191919] leading-[24px] font-sf">
                  <p className="mb-3">{t('scores.base')}</p>
                  <p className="mb-2">{t('scores.bonus.intro')}</p>
                  <ul className="space-y-1 ml-4">
                    <li>• {t('scores.bonus.50')}</li>
                    <li>• {t('scores.bonus.30')}</li>
                    <li>• {t('scores.bonus.10')}</li>
                  </ul>
                </div>
              </section>

              <div className="pt-4">
                <PrimaryButton onClick={() => navigate('/pre-game')}>
                  {t('start.new.game')}
                </PrimaryButton>
              </div>
            </div>
          </div>

          <NavigationMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        </div>
      </HeaderLayout>
    </AppLayout>
    </>
  );
};

export default HowToPlay;