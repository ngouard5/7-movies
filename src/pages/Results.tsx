
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { Timer } from "lucide-react";
import { formatTime } from "@/utils/gameStorage";

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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve results from localStorage
    const resultsStr = localStorage.getItem("gameResults");
    if (resultsStr) {
      try {
        const results = JSON.parse(resultsStr);
        setGameTime(results.totalTime || 0);
        setGuessedMovies(results.movies || []);
      } catch (e) {
        console.error("Error parsing game results:", e);
      }
    }

    // Get player info
    const nickname = localStorage.getItem("playerNickname") || "Player";
    setPlayerNickname(nickname);
    
    const avatar = localStorage.getItem("playerAvatar");
    if (avatar) {
      const avatarIndex = parseInt(avatar);
      const avatars = ["👨‍🦰", "👩‍🦰", "👨‍🦱", "👩‍🦱", "👨‍🦳", "👩‍🦳", "👨‍🦲", "👩‍🦲"];
      setPlayerAvatar(avatars[avatarIndex] || "👨‍🦰");
    }
  }, []);

  const handlePlayAgain = () => {
    navigate("/pregame");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  // Helper function to format time or return an empty string if time is 0
  const displayTime = (time?: number) => {
    if (!time || time === 0) {
      return "";
    }
    return (
      <div className="flex items-center text-[14px] text-gray-500">
        <Timer className="h-3.5 w-3.5 mr-1 inline" />
        {formatTime(time)}
      </div>
    );
  };

  // Helper function to get a fallback movie poster URL
  const getMoviePosterUrl = (imdbID: string) => {
    return `https://img.omdbapi.com/?i=${imdbID}&apikey=8342f4b&h=150`;
  };

  if (isLoading) {
    return (
      <main className="relative w-full max-w-[393px] min-h-[852px] overflow-hidden bg-neutral-50 mx-auto my-0">
        <BackgroundGradients />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xl">Saving your results...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative w-full max-w-[393px] min-h-[852px] overflow-auto bg-neutral-50 mx-auto my-0">
      <div className="relative h-full pb-8 flex flex-col items-center">
        <BackgroundGradients />

        <div className="absolute w-full max-w-[340px] left-1/2 -translate-x-1/2 top-[100px] text-center flex flex-col items-center">
          <div className="mb-6 w-full">
            <div className="text-[22px] font-bold text-[#191919]">
              {playerAvatar} {playerNickname}'s score
            </div>
            <div className="text-[64px] font-bold text-[#E72F2F] mt-2">
              {formatTime(gameTime)}
            </div>
          </div>

          <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto w-full">
            {guessedMovies.map((movie) => (
              <div 
                key={movie.id} 
                className="flex flex-col bg-white border border-[#CCC] rounded-xl shadow-[0px_3px_3px_rgba(0,0,0,0.06)]"
              >
                <div className="flex items-center p-3">
                  <img
                    src={movie.image || getMoviePosterUrl(movie.imdbID)}
                    alt={movie.title}
                    className="w-12 h-[68px] rounded object-cover mr-3"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  <div className="flex-1 text-left">
                    <div className="font-bold text-[16px] text-[#191919]">{movie.title}</div>
                    {displayTime(movie.guessTime)}
                  </div>
                </div>
                <div className="px-3 pb-3 text-left">
                  <div className="text-2xl">{movie.emojis}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex w-full gap-2 mt-8 flex-col">
            <button
              className="w-full h-14 border text-white text-xl font-bold shadow-[0px_3px_3px_rgba(0,0,0,0.08),0px_5px_7px_rgba(255,255,255,0.20)_inset] bg-[#E72F2F] rounded-2xl border-solid border-[#E72F2F] hover:bg-[#d62b2b] transition-colors"
              onClick={handlePlayAgain}
            >
              Play again
            </button>
            <button
              className="w-full h-14 border text-[#191919] text-xl font-bold shadow-[0px_3px_3px_rgba(0,0,0,0.08)] bg-white rounded-2xl border-solid border-[#CCC] hover:bg-gray-50 transition-colors mt-3"
              onClick={handleGoHome}
            >
              Go to homepage
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Results;
