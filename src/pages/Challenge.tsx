
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { AppLayout } from "@/components/layout/AppLayout";
import { getChallengeMovies, setChallengeData } from "@/services/challengeService";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Home, Users } from "lucide-react";
import { TopLeftButton } from "@/components/ui/TopLeftButton";

const Challenge = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [challengeInfo, setChallengeInfo] = useState<{
    movieCount: number;
    playerNickname?: string;
  } | null>(null);

  useEffect(() => {
    const loadChallenge = async () => {
      if (!sessionId) {
        setError("ID de défi manquant");
        setIsLoading(false);
        return;
      }

      try {
        const movies = await getChallengeMovies(sessionId);
        
        if (!movies || movies.length === 0) {
          setError("Défi introuvable ou expiré");
          setIsLoading(false);
          return;
        }

        // Store challenge data for the game
        setChallengeData(movies, sessionId);
        
        setChallengeInfo({
          movieCount: movies.length,
        });
        
      } catch (error) {
        console.error("Error loading challenge:", error);
        setError("Erreur lors du chargement du défi");
      } finally {
        setIsLoading(false);
      }
    };

    loadChallenge();
  }, [sessionId]);

  const handleStartChallenge = () => {
    navigate("/pre-game");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <AppLayout>
        <main className="relative w-full min-h-screen overflow-hidden bg-neutral-50">
          <BackgroundGradients />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-xl font-sf">Chargement du défi...</div>
          </div>
        </main>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <main className="relative w-full min-h-screen overflow-hidden bg-neutral-50">
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
                Défi introuvable
              </div>
              <div className="text-[16px] mb-8 font-sf text-[#666]">
                {error}
              </div>
              <PrimaryButton onClick={handleGoHome}>
                Retour à l'accueil
              </PrimaryButton>
            </div>
          </div>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <main className="relative w-full min-h-screen overflow-hidden bg-neutral-50">
        <BackgroundGradients />
        
        <TopLeftButton
          onClick={handleGoHome}
          icon={<Home className="w-6 h-6 text-[#E72F2F]" />}
          ariaLabel="Home"
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[90%] max-w-[340px] text-center">
            <div className="text-[64px] mb-4">🎬</div>
            <div className="text-[32px] leading-[40px] font-fredoka text-[#191919] mb-4">
              Défi accepté !
            </div>
            <div className="text-[18px] font-sf text-[#191919] mb-2">
              Un ami vous a lancé un défi !
            </div>
            <div className="text-[16px] font-sf text-[#666] mb-8">
              Jouez avec les mêmes {challengeInfo?.movieCount} films et essayez de faire mieux !
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-8 p-4 bg-white border border-[#CCC] rounded-xl">
              <Users className="w-5 h-5 text-[#E72F2F]" />
              <span className="font-sf text-[#191919]">
                Même séquence de films
              </span>
            </div>

            <PrimaryButton onClick={handleStartChallenge}>
              Commencer le défi
            </PrimaryButton>
          </div>
        </div>
      </main>
    </AppLayout>
  );
};

export default Challenge;
