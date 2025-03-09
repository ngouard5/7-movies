
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { movieEmojis } from "@/data/movieEmojis";

interface ChallengeData {
  movies: number[];
  time: number;
  playerNickname: string;
  playerAvatar: string;
}

const Challenge = () => {
  const { id } = useParams<{ id: string }>();
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(null);
  const [challengeMovies, setChallengeMovies] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    // Load challenge data from localStorage
    const challengeInfo = localStorage.getItem(`challenge_${id}`);
    
    if (challengeInfo) {
      try {
        const parsedData = JSON.parse(challengeInfo);
        setChallengeData(parsedData);
        
        // Get the movie data for the challenge
        if (parsedData.movies && Array.isArray(parsedData.movies)) {
          const movies = parsedData.movies.map((movieId: number) => 
            movieEmojis.find(m => m.id === movieId)
          ).filter(Boolean);
          
          setChallengeMovies(movies);
        }
      } catch (e) {
        console.error("Error parsing challenge data:", e);
        toast({
          title: "Invalid Challenge",
          description: "This challenge is no longer available",
          variant: "destructive",
        });
        navigate("/");
      }
    } else {
      toast({
        title: "Challenge Not Found",
        description: "This challenge doesn't exist or has expired",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [id, navigate, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAcceptChallenge = () => {
    if (challengeData && challengeData.movies) {
      // Store the movie IDs to use for this challenge
      localStorage.setItem("challengeMovies", JSON.stringify(challengeData.movies));
      
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
            <div className="text-[18px] text-gray-700 mt-2">
              They completed this in:
            </div>
            <div className="text-[64px] font-bold text-[#E72F2F] mt-2">
              {formatTime(challengeData.time)}
            </div>
          </div>

          <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto w-full mb-6">
            <div className="text-lg font-bold mb-2">Movie list:</div>
            {challengeMovies.map((movie, index) => (
              <div 
                key={movie.id} 
                className="flex flex-col bg-white border border-[#CCC] rounded-xl shadow-[0px_3px_3px_rgba(0,0,0,0.06)]"
              >
                <div className="p-3">
                  <div className="font-bold text-[16px] text-[#191919]">Movie {index + 1}</div>
                  <div className="text-2xl mt-2">{movie.emojis}</div>
                </div>
              </div>
            ))}
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
