
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { AppLayout } from "@/components/layout/AppLayout";
import { getChallengeMovies, getChallengeSessionInfo, setChallengeData } from "@/services/challengeService";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Home, Target } from "lucide-react";
import { TopLeftButton } from "@/components/ui/TopLeftButton";
import { useLanguage } from "@/contexts/LanguageContext";

const Challenge = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [challengeInfo, setChallengeInfo] = useState<{
    movieCount: number;
    playerNickname?: string;
    totalScore?: number;
  } | null>(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    const loadChallenge = async () => {
      if (!sessionId) {
        setError(t('challenge.not.found'));
        setIsLoading(false);
        return;
      }

      try {
        // Load both movies and session info in parallel
        const [movies, sessionInfo] = await Promise.all([
          getChallengeMovies(sessionId),
          getChallengeSessionInfo(sessionId)
        ]);
        
        if (!movies || movies.length === 0) {
          setError(t('challenge.not.found'));
          setIsLoading(false);
          return;
        }

        // Store challenge data for the game
        setChallengeData(movies, sessionId);
        
        setChallengeInfo({
          movieCount: movies.length,
          playerNickname: sessionInfo?.playerNickname,
          totalScore: sessionInfo?.totalScore,
        });
        
      } catch (error) {
        console.error("Error loading challenge:", error);
        setError(t('challenge.not.found'));
      } finally {
        setIsLoading(false);
      }
    };

    loadChallenge();
  }, [sessionId, t]);

  const handleStartChallenge = () => {
    navigate("/pre-game");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <AppLayout>
        <main className="relative w-full min-h-screen min-h-screen md:min-h-[600px] overflow-hidden">
          <BackgroundGradients />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-xl font-sf">{t('challenge.loading')}</div>
          </div>
        </main>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <main className="relative w-full min-h-screen md:min-h-[600px] overflow-hidden">
          <BackgroundGradients />
          
          <TopLeftButton
            onClick={handleGoHome}
            icon={<Home className="w-6 h-6 text-[#E72F2F]" />}
            ariaLabel="Home"
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[90%] max-w-[340px] text-center">
              <div className="text-[40px] mb-4">❌</div>
              <div className="text-[24px] font-bold mb-4 font-sf text-[#191919]">
                {t('challenge.not.found')}
              </div>
              <div className="text-[16px] mb-8 font-sf text-[#666]">
                {t('challenge.not.found.desc')}
              </div>
              <PrimaryButton onClick={handleGoHome}>
                {t('challenge.back.home')}
              </PrimaryButton>
            </div>
          </div>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <main className="relative w-full min-h-screen md:min-h-[600px] overflow-hidden">
        <BackgroundGradients />
        
        <TopLeftButton
          onClick={handleGoHome}
          icon={<Home className="w-6 h-6 text-[#E72F2F]" />}
          ariaLabel="Home"
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[90%] max-w-[340px] text-center">
            <div className="text-[64px] mb-4">🍿</div>
            <div className="text-[32px] leading-[40px] font-fredoka text-[#191919] mb-4">
              {t('challenge.accepted')}
            </div>
            <div className="text-[18px] font-sf text-[#191919] mb-2">
              {challengeInfo?.playerNickname 
                ? language === 'fr' 
                  ? `${challengeInfo.playerNickname} vous lance un défi Movie Emoji !`
                  : `${challengeInfo.playerNickname} challenges you to a Movie Emoji game!`
                : language === 'fr'
                  ? 'Un ami vous lance un défi Movie Emoji !'
                  : 'A friend challenges you to a Movie Emoji game!'
              }
            </div>
            <div className="text-[16px] font-sf text-[#666] mb-8">
              {t('challenge.description')}
            </div>
            
            {challengeInfo?.totalScore && (
              <div className="flex items-center justify-center gap-2 mb-8 p-4 bg-white border border-[#CCC] rounded-xl">
                <Target className="w-5 h-5 text-[#E72F2F]" />
                <span className="font-sf text-[#191919]">
                  {t('challenge.score.beat')} {challengeInfo.totalScore} pts
                </span>
              </div>
            )}

            <PrimaryButton onClick={handleStartChallenge}>
              {t('challenge.start')}
            </PrimaryButton>
          </div>
        </div>
      </main>
    </AppLayout>
  );
};

export default Challenge;
