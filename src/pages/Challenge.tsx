
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { toast } from "sonner";

interface ChallengeData {
  movies: number[];
  time: number;
  playerNickname: string;
  playerAvatar: string;
  sessionId: string;
}

const Challenge = () => {
  const { id } = useParams<{ id: string }>();
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    try {
      // Decode the challenge data from the URL using decodeURIComponent
      const decodedJsonString = decodeURIComponent(id);
      const decodedData = JSON.parse(decodedJsonString);
      setChallengeData(decodedData);
    } catch (e) {
      console.error("Error parsing challenge data:", e);
      toast.error("Défi invalide", {
        description: "Ce défi n'est plus disponible ou est invalide",
        position: "top-right",
      });
      navigate("/");
    }
  }, [id, navigate]);

  const handleAcceptChallenge = () => {
    if (challengeData && challengeData.movies) {
      // Store the movie IDs to use for this challenge
      localStorage.setItem("challengeMovies", JSON.stringify(challengeData.movies));
      
      // Store the original challenge info to update ranking later
      if (challengeData.sessionId) {
        localStorage.setItem("currentChallengeId", challengeData.sessionId);
      }
      
      // Start the game
      navigate("/pregame");
    }
  };

  if (!challengeData) {
    return (
      <main className="relative w-full max-w-[393px] min-h-[852px] overflow-hidden bg-neutral-50 mx-auto my-0 max-md:w-full">
        <BackgroundGradients />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xl">Loading challenge...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative w-full max-w-[393px] min-h-[852px] overflow-hidden bg-neutral-50 mx-auto my-0 max-md:w-full">
      <div className="relative h-full pb-8">
        <BackgroundGradients />

        <div className="absolute w-[361px] left-4 top-[134px] text-center flex flex-col items-center">
          <div className="mb-6 w-full">
            <div className="text-[22px] font-bold text-[#191919]">
              {challengeData.playerAvatar} {challengeData.playerNickname} challenges you!
            </div>
            <div className="text-xl mt-12 mb-20 px-4">
              Can you guess all the movie emojis faster?
            </div>
          </div>

          <button
            className="w-full h-14 border text-white text-xl font-bold shadow-[0px_3px_3px_rgba(0,0,0,0.08),0px_5px_7px_rgba(255,255,255,0.20)_inset] bg-[#E72F2F] rounded-2xl border-solid border-[#E72F2F] hover:bg-[#d62b2b] transition-colors mt-8"
            onClick={handleAcceptChallenge}
          >
            Accept Challenge
          </button>
        </div>
      </div>
    </main>
  );
};

export default Challenge;
