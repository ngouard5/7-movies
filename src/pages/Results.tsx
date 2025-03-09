
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MenuButton } from "@/components/game/MenuButton";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { ClipboardList, Share, Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveGameSession, formatTime } from "@/utils/gameStorage";

interface MovieData {
  id: number;
  emojis: string;
  title: string;
  imdbID: string;
  image?: string;
  guessTime?: number;
}

const Results = () => {
  const [gameTime, setGameTime] = useState<number>(0);
  const [guessedMovies, setGuessedMovies] = useState<MovieData[]>([]);
  const [playerNickname, setPlayerNickname] = useState<string>("");
  const [playerAvatar, setPlayerAvatar] = useState<string>("👨‍🦰");
  const [sessionId, setSessionId] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Load game results from localStorage
    const time = localStorage.getItem("gameTime");
    const movies = localStorage.getItem("guessedMovies");
    const nickname = localStorage.getItem("playerNickname");
    const avatar = localStorage.getItem("playerAvatar");

    if (time) setGameTime(parseInt(time));
    if (movies) {
      try {
        const parsedMovies = JSON.parse(movies);
        console.log("Loaded movies from localStorage:", parsedMovies);
        setGuessedMovies(parsedMovies);
      } catch (e) {
        console.error("Error parsing guessed movies:", e);
      }
    }
    if (nickname) setPlayerNickname(nickname);
    if (avatar) {
      const avatarIndex = parseInt(avatar);
      const avatars = ["👨‍🦰", "👩‍🦰", "👨‍🦱", "👩‍🦱", "👨‍🦳", "👩‍🦳", "👨‍🦲", "👩‍🦲"];
      setPlayerAvatar(avatars[avatarIndex] || "👨‍🦰");
    }

    // Save the game session
    if (time && movies && nickname) {
      try {
        const parsedTime = parseInt(time);
        const parsedMovies = JSON.parse(movies);
        const avatarEmoji = avatar 
          ? (["👨‍🦰", "👩‍🦰", "👨‍🦱", "👩‍🦱", "👨‍🦳", "👩‍🦳", "👨‍🦲", "👩‍🦲"][parseInt(avatar)] || "👨‍🦰")
          : "👨‍🦰";
        
        const newSessionId = saveGameSession(parsedTime, parsedMovies, nickname, avatarEmoji);
        setSessionId(newSessionId);
      } catch (e) {
        console.error("Error saving game session:", e);
      }
    }
  }, []);

  const handleShare = () => {
    // Generate a unique ID for this challenge
    const challengeId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    
    // Store the current game results in localStorage with the challenge ID
    localStorage.setItem(`challenge_${challengeId}`, JSON.stringify({
      movies: guessedMovies.map(movie => movie.id),
      time: gameTime,
      playerNickname,
      playerAvatar
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

  const handlePlayAgain = () => {
    navigate("/");
  };

  const handleViewHistory = () => {
    navigate("/history");
  };

  const handleViewRanking = () => {
    if (sessionId) {
      navigate(`/ranking/${sessionId}`);
    }
  };

  return (
    <main className="relative w-full max-w-[393px] min-h-[852px] overflow-hidden bg-neutral-50 mx-auto my-0 max-md:w-full">
      <div className="relative h-full pb-8">
        <BackgroundGradients />

        <div className="absolute left-4 top-[69px]">
          <MenuButton />
        </div>

        <div className="absolute w-[361px] left-4 top-[134px] text-center flex flex-col items-center">
          <div className="mb-6 w-full">
            <div className="text-[22px] font-bold text-[#191919]">
              {playerAvatar} {playerNickname}'s score
            </div>
            <div className="text-[64px] font-bold text-[#E72F2F] mt-2">
              {formatTime(gameTime)}
            </div>
          </div>

          <div className="flex gap-2 w-full mb-6">
            <button
              className="flex-1 flex items-center justify-center px-4 h-12 border shadow-[0px_3px_3px_rgba(0,0,0,0.06)] bg-white rounded-xl border-solid border-[#CCC] hover:bg-gray-50 transition-colors"
              onClick={handleShare}
            >
              <Share className="w-5 h-5 mr-2 text-[#E72F2F]" />
              <span className="text-[16px] font-bold text-[#191919]">
                Challenge
              </span>
            </button>
            
            <button
              className="flex-1 flex items-center justify-center px-4 h-12 border shadow-[0px_3px_3px_rgba(0,0,0,0.06)] bg-white rounded-xl border-solid border-[#CCC] hover:bg-gray-50 transition-colors"
              onClick={handleViewRanking}
            >
              <ClipboardList className="w-5 h-5 mr-2 text-[#E72F2F]" />
              <span className="text-[16px] font-bold text-[#191919]">
                Ranking
              </span>
            </button>
          </div>

          <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto w-full">
            {guessedMovies.map((movie, index) => (
              <div 
                key={movie.id} 
                className="flex flex-col bg-white border border-[#CCC] rounded-xl shadow-[0px_3px_3px_rgba(0,0,0,0.06)]"
              >
                <div className="flex items-center p-3">
                  <img
                    src={movie.image || "/placeholder.svg"}
                    alt={movie.title}
                    className="w-12 h-[68px] rounded object-cover mr-3"
                  />
                  <div className="flex-1 text-left">
                    <div className="font-bold text-[16px] text-[#191919]">{movie.title}</div>
                    <div className="flex items-center text-[14px] text-gray-500">
                      <Timer className="h-3.5 w-3.5 mr-1 inline" />
                      {formatTime(movie.guessTime || 0)}
                    </div>
                  </div>
                </div>
                <div className="px-3 pb-3 text-left">
                  <div className="text-2xl">{movie.emojis}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex w-full gap-2 mt-8">
            <button
              className="flex-1 h-14 border text-white text-xl font-bold shadow-[0px_3px_3px_rgba(0,0,0,0.08),0px_5px_7px_rgba(255,255,255,0.20)_inset] bg-[#E72F2F] rounded-2xl border-solid border-[#E72F2F] hover:bg-[#d62b2b] transition-colors"
              onClick={handlePlayAgain}
            >
              Play again
            </button>
            
            <button
              className="flex-1 h-14 border text-[#191919] text-xl font-bold shadow-[0px_3px_3px_rgba(0,0,0,0.06)] bg-white rounded-2xl border-solid border-[#CCC] hover:bg-gray-50 transition-colors"
              onClick={handleViewHistory}
            >
              History
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Results;
