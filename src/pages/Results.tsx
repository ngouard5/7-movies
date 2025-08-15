import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { Timer, CheckCircle, XCircle, Home } from "lucide-react";
import { formatTime } from "@/utils/gameStorage";
import { TopLeftButton } from "@/components/ui/TopLeftButton";
import { AppLayout } from "@/components/layout/AppLayout";

interface MovieData {
  id: number;
  emojis: string;
  title: string;
  imdbID: string;
  image?: string;
  guessTime?: number;
  frenchTitle?: string;
  points?: number;
}

const Results = () => {
  const [gameTime, setGameTime] = useState<number>(0);
  const [guessedMovies, setGuessedMovies] = useState<MovieData[]>([]);
  const [passedMovies, setPassedMovies] = useState<MovieData[]>([]);
  const [score, setScore] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [totalMovies, setTotalMovies] = useState<number>(7);
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
        setPassedMovies(results.passedMovies || []);
        setScore(results.score || guessedMovies.length);
        setTotalScore(results.totalScore || 0);
        setTotalMovies(results.totalMovies || 7);
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
      const avatars = ["🫠", "🥶", "🥸", "🤬", "🤯", "🥳", "🧐", "😈"];
      setPlayerAvatar(avatars[avatarIndex] || "🫠");
    }
  }, []);

  const handlePlayAgain = () => {
    navigate("/pre-game");
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
      <AppLayout>
        <main className="relative w-full min-h-[852px] overflow-hidden bg-neutral-50">
          <BackgroundGradients />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-xl">Saving your results...</div>
          </div>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <main className="relative w-full min-h-screen md:min-h-[600px]] overflow-auto">
        <div className="relative flex flex-col items-center">
          <BackgroundGradients />
          
          <TopLeftButton
            onClick={handleGoHome}
            icon={<Home className="w-6 h-6 text-[#E72F2F]" />}
            ariaLabel="Home"
          />

          <div className="w-[90%] max-w-[340px] mx-auto pt-[60px] text-center flex flex-col items-center">
            <div className="mb-6 w-full">
              <div className="text-[40px] leading-[48px] font-fredoka text-[#191919] mb-4">
                🎉🎉🎉
              </div>
              <div className="text-[32px] leading-[40px] font-fredoka text-[#191919] mb-4">
                Aaaand... CUT!
              </div>
              <div className="text-[18px] font-sf text-[#191919] mb-6">
                {(() => {
                  if (score === 0) return `No movies this time, ${playerNickname}? Time for a movie marathon! 🍿`;
                  if (score === 1) return `${score} movie found, ${playerNickname}! Every journey starts with one step! 🎬`;
                  if (score <= 2) return `${score} movies found, ${playerNickname}! Getting warmed up! 🔥`;
                  if (score <= 4) return `${score} movies out of ${totalMovies}, solid work ${playerNickname}! 🎯`;
                  if (score <= 6) return `${score} movies out of ${totalMovies}, impressive ${playerNickname}! 🌟`;
                  return `${score} movies out of ${totalMovies}, absolutely crushing it ${playerNickname}! 🏆`;
                })()}
              </div>
              <div className="flex justify-center items-center gap-2 mt-2">
                <div className="text-[64px] font-bold text-[#E72F2F] font-sf">
                  {totalScore}
                </div>
                <div className="text-[22px] font-medium text-[#191919] font-sf">
                  points
                </div>
              </div>
              <div className="text-[16px] font-medium text-[#191919] mt-1 font-sf">
                Movies guessed: {score} / {totalMovies}
              </div>
              <div className="text-[16px] font-medium text-[#191919] font-sf">
                Total time: {formatTime(gameTime)}
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full mt-4">
              {guessedMovies.length > 0 && (
                <div className="text-left text-[18px] font-bold flex items-center font-sf">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  Guessed Movies
                </div>
              )}
              
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
                      <div className="font-bold text-[16px] text-[#191919] mb-1 font-sf">{movie.title}</div>
                      <div className="text-2xl mb-1">{movie.emojis}</div>
                    </div>
                    <div className="flex flex-col items-end">
                      {movie.points && (
                        <div className="text-[14px] font-bold text-[#E72F2F] font-sf">
                          +{movie.points} pts
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {passedMovies.length > 0 && (
                <div className="text-left text-[18px] font-bold mt-2 flex items-center font-sf">
                  <XCircle className="h-5 w-5 mr-2 text-red-500" />
                  Passed Movies
                </div>
              )}
              
              {passedMovies.map((movie) => (
                <div 
                  key={movie.id} 
                  className="flex flex-col bg-white border border-[#CCC] rounded-xl shadow-[0px_3px_3px_rgba(0,0,0,0.06)] opacity-80"
                >
                  <div className="flex items-center p-3">
                    <img
                      src={movie.image || getMoviePosterUrl(movie.imdbID)}
                      alt={movie.title}
                      className="w-12 h-[68px] rounded object-cover mr-3 grayscale"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                    <div className="flex-1 text-left">
                      <div className="font-bold text-[16px] text-[#191919] mb-1 font-sf">{movie.title}</div>
                      <div className="text-2xl mb-1">{movie.emojis}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex w-full gap-2 mt-8 flex-col">
              <button
                className="w-full h-14 border text-white text-xl font-bold shadow-[0px_3px_3px_rgba(0,0,0,0.08),0px_5px_7px_rgba(255,255,255,0.20)_inset] bg-[#E72F2F] rounded-2xl border-solid border-[#E72F2F] hover:bg-[#d62b2b] transition-colors font-sf"
                onClick={handlePlayAgain}
              >
                Play again
              </button>
              <button
                className="w-full h-14 border text-[#191919] text-xl font-bold shadow-[0px_3px_3px_rgba(0,0,0,0.08)] bg-white rounded-2xl border-solid border-[#CCC] hover:bg-gray-50 transition-colors mt-3 font-sf"
                onClick={handleGoHome}
              >
                Go to homepage
              </button>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
};

export default Results;
