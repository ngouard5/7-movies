
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { toast } from "sonner";
import { getGameSession } from "@/services/gameSessionService";

const Challenge = () => {
  const { id } = useParams<{ id: string }>();
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    const loadChallengeData = async () => {
      setIsLoading(true);
      
      try {
        // Strip any 'local-' prefix if it exists
        const cleanId = id.startsWith('local-') ? id.substring(6) : id;
        console.log("Challenge session ID:", cleanId);
        
        // Verify the session exists in Firestore
        const firestoreSession = await getGameSession(cleanId);
        
        if (firestoreSession) {
          console.log("Found challenge session in Firestore:", firestoreSession);
          setGameSessionId(cleanId);
        } else {
          console.error("Challenge session not found");
          toast.error("Challenge not found", {
            description: "This challenge is not available or has expired",
            position: "top-right",
          });
          navigate("/");
        }
      } catch (e) {
        console.error("Error processing challenge:", e);
        toast.error("Invalid challenge", {
          description: "This challenge link is invalid",
          position: "top-right",
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadChallengeData();
  }, [id, navigate]);

  const handleAcceptChallenge = () => {
    if (gameSessionId) {
      // Store the challenge session ID to update ranking later
      localStorage.setItem("currentChallengeId", gameSessionId);
      console.log("Stored challenge session ID:", gameSessionId);
      
      // Start the game
      navigate("/pregame");
    }
  };

  if (isLoading) {
    return (
      <main className="relative w-full max-w-[393px] min-h-[852px] overflow-hidden bg-neutral-50 mx-auto my-0 max-md:w-full">
        <BackgroundGradients />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xl">Loading challenge...</div>
        </div>
      </main>
    );
  }

  if (!gameSessionId) {
    return (
      <main className="relative w-full max-w-[393px] min-h-[852px] overflow-hidden bg-neutral-50 mx-auto my-0 max-md:w-full">
        <BackgroundGradients />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xl">Invalid challenge</div>
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
              You've been challenged!
            </div>
            <div className="text-xl mt-12 mb-20 px-4">
              Can you guess the movie emoji faster?
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
