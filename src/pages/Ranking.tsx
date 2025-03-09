
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MenuButton } from "@/components/game/MenuButton";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { ArrowLeft, Calendar, Timer, Trophy, Share } from "lucide-react";
import { getGameSessionById, GameSession, formatTime, formatSessionDate } from "@/utils/gameStorage";
import { useToast } from "@/hooks/use-toast";

const Ranking = () => {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<GameSession | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!id) {
      navigate("/history");
      return;
    }

    // Load session data
    const sessionData = getGameSessionById(id);
    if (sessionData) {
      setSession(sessionData);
    } else {
      toast({
        title: "Session not found",
        description: "Could not find this game session",
        variant: "destructive",
      });
      navigate("/history");
    }
  }, [id, navigate, toast]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleShare = () => {
    if (!session) return;
    
    // Generate challenge URL (same as in Results.tsx)
    const challengeId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    
    // Store the game results in localStorage with the challenge ID
    localStorage.setItem(`challenge_${challengeId}`, JSON.stringify({
      movies: session.movies.map(movie => movie.id),
      time: session.totalTime,
      playerNickname: session.playerNickname,
      playerAvatar: session.playerAvatar
    }));
    
    // Create share URL
    const shareUrl = `${window.location.origin}/challenge/${challengeId}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast({
          title: "Link copied!",
          description: "Challenge URL has been copied to clipboard",
        });
      })
      .catch(() => {
        toast({
          title: "Unable to copy",
          description: "Please copy the URL manually",
          variant: "destructive",
        });
      });
  };

  if (!session) {
    return (
      <main className="relative w-full max-w-[393px] min-h-[852px] overflow-hidden bg-neutral-50 mx-auto my-0 max-md:w-full">
        <BackgroundGradients />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xl">Loading session data...</div>
        </div>
      </main>
    );
  }

  // Sort participants by time (ascending)
  const participants = session.participants || [{
    id: session.id,
    nickname: session.playerNickname,
    avatar: session.playerAvatar,
    totalTime: session.totalTime
  }];
  
  participants.sort((a, b) => a.totalTime - b.totalTime);

  // Helper function to get medal color
  const getMedalColor = (index: number): string => {
    switch (index) {
      case 0: return "text-yellow-500"; // Gold
      case 1: return "text-gray-400"; // Silver
      case 2: return "text-amber-700"; // Bronze
      default: return "text-gray-300"; // No medal
    }
  };

  return (
    <main className="relative w-full max-w-[393px] min-h-[852px] overflow-hidden bg-neutral-50 mx-auto my-0 max-md:w-full">
      <div className="relative h-full pb-8">
        <BackgroundGradients />

        <div className="absolute left-4 top-[69px]">
          <button 
            onClick={handleBack}
            className="flex items-center justify-center w-12 h-12 border shadow-[0px_3px_3px_rgba(0,0,0,0.06)] bg-white rounded-xl border-solid border-[#CCC]"
          >
            <ArrowLeft className="w-6 h-6 text-[#191919]" />
          </button>
        </div>

        <div className="absolute w-[361px] left-4 top-[134px] text-center flex flex-col items-center">
          <div className="mb-4 w-full text-left">
            <div className="text-[22px] font-bold text-[#191919]">
              Ranking
            </div>
            <div className="flex justify-between items-center mt-1">
              <div className="text-[16px] text-gray-500 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatSessionDate(session.date)}
              </div>
              
              <button
                onClick={handleShare}
                className="flex items-center text-[#E72F2F] text-[14px] font-medium"
              >
                <Share className="h-4 w-4 mr-1" />
                Share Challenge
              </button>
            </div>
          </div>

          {/* Movie preview */}
          <div className="w-full p-4 bg-white border border-[#CCC] rounded-xl shadow-[0px_3px_3px_rgba(0,0,0,0.06)] mb-6">
            <div className="text-[16px] font-bold text-[#191919] mb-2">Movies</div>
            <div className="flex flex-wrap gap-2">
              {session.movies.map((movie) => (
                <div 
                  key={movie.id} 
                  className="text-xl bg-gray-50 rounded-md px-2 py-1"
                >
                  {movie.emojis.split(' ')[0]}
                </div>
              ))}
            </div>
          </div>

          {/* Ranking list */}
          <div className="w-full">
            <div className="text-[16px] font-bold text-[#191919] mb-2 text-left">
              Leaderboard
            </div>
            
            <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto w-full">
              {participants.map((participant, index) => (
                <div 
                  key={participant.id}
                  className="flex items-center p-4 bg-white border border-[#CCC] rounded-xl shadow-[0px_3px_3px_rgba(0,0,0,0.06)]"
                >
                  <div className={`w-8 h-8 flex items-center justify-center ${getMedalColor(index)}`}>
                    {index < 3 ? (
                      <Trophy className="w-6 h-6" />
                    ) : (
                      <div className="font-bold text-[16px]">{index + 1}</div>
                    )}
                  </div>
                  
                  <div className="ml-3 flex-1">
                    <div className="font-bold text-[16px] text-[#191919]">
                      {participant.avatar} {participant.nickname}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-[16px] font-bold text-[#E72F2F]">
                    <Timer className="h-4 w-4 mr-1" />
                    {formatTime(participant.totalTime)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Ranking;
