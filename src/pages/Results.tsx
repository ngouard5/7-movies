
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { Timer, CheckCircle, XCircle, Home } from "lucide-react";
import { formatTime } from "@/utils/gameStorage";
import { AppLayout } from "@/components/layout/AppLayout";
import { saveGameSession, type GameSessionData } from "@/services/statsService";
import { supabase } from "@/integrations/supabase/client";
import { ShareButton } from "@/components/game/ShareButton";
import { ShareCopyButton } from "@/components/game/ShareCopyButton";
import { clearChallengeData } from "@/services/challengeService";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { MAX_TOTAL_SCORE } from "@/utils/scoreCalculator";

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
  const [isSaving, setIsSaving] = useState(false);
  const [savedSessionId, setSavedSessionId] = useState<string | null>(null);
  const [challengeSourceSessionId, setChallengeSourceSessionId] = useState<string | null>(null);
  const [challengeSourceScore, setChallengeSourceScore] = useState<number>(0);
  const navigate = useNavigate();
  const hasSaved = useRef(false);
  const { t, language } = useLanguage();

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
        setChallengeSourceSessionId(results.challengeSourceSessionId || null);
        setChallengeSourceScore(results.challengeSourceScore || localStorage.getItem('challengeSourceScore') ? parseInt(localStorage.getItem('challengeSourceScore') || '0') : 0);
      } catch (e) {
        console.error("Error parsing game results:", e);
      }
    }

    // Get player info from separate localStorage keys
    const nickname = localStorage.getItem("playerNickname") || "Anonymous";
    const avatarIndex = localStorage.getItem("playerAvatar");
    
    setPlayerNickname(nickname);
    
    if (avatarIndex) {
      const index = parseInt(avatarIndex);
      const avatars = ["🫠", "🥶", "🥸", "🤬", "🤯", "🥳", "🧐", "😈"];
      setPlayerAvatar(avatars[index] || "🫠");
    }

    // Save to database only once
    const saveToDatabase = async () => {
      // Prevent double saves (especially in React.StrictMode during development)
      if (hasSaved.current) {
        console.log("Save already attempted, skipping to prevent duplicates");
        return;
      }
      
      hasSaved.current = true;
      const results = localStorage.getItem("gameResults");
      
      if (results) {
        setIsSaving(true);
        try {
          const gameResults = JSON.parse(results);
          
          const sessionData: GameSessionData = {
            playerNickname: nickname,
            playerAvatar: avatarIndex ? (["🫠", "🥶", "🥸", "🤬", "🤯", "🥳", "🧐", "😈"][parseInt(avatarIndex)] || "🫠") : "🫠",
            totalTime: gameResults.totalTime || 0,
            totalScore: gameResults.totalScore || 0,
            moviesGuessed: gameResults.movies?.length || 0,
            moviesPassed: gameResults.passedMovies?.length || 0,
            guessedMovies: gameResults.movies || [],
            passedMovies: gameResults.passedMovies || [],
            challengeSourceSessionId: gameResults.challengeSourceSessionId || null,
          };

          console.log("Saving game session:", sessionData);
          const sessionId = await saveGameSession(sessionData);
          if (sessionId) {
            console.log("Game session saved with ID:", sessionId);
            setSavedSessionId(sessionId);
            
            // Verify what was actually saved to the database
            try {
              const { data: verificationData, error: verifyError } = await supabase
                .from('public_game_sessions')
                .select('id, total_score, movies_guessed, movies_passed, total_time')
                .eq('id', sessionId)
                .maybeSingle();
                
              if (verifyError) {
                console.error('Error verifying saved session:', verifyError);
              } else if (verificationData) {
                console.debug('Verification - Database contains:', verificationData);
                
                const expectedScore = sessionData.totalScore > 0 
                  ? sessionData.totalScore 
                  : sessionData.guessedMovies.reduce((sum, movie) => sum + (movie.points || 0), 0);
                
                if (verificationData.total_score !== expectedScore) {
                  console.warn(`Score mismatch! Expected: ${expectedScore}, Database: ${verificationData.total_score}`);
                  toast.error(`Attention: score enregistré (${verificationData.total_score}) diffère du score calculé (${expectedScore})`);
                } else {
                  console.debug('Score verification successful');
                }
              } else {
                console.warn('No verification data found for session:', sessionId);
              }
            } catch (verifyError) {
              console.error('Error during verification:', verifyError);
            }
            
            toast.success("Statistiques sauvegardées avec succès!");
          } else {
            console.warn("Failed to save game session - no session ID returned");
            toast.error("Erreur lors de la sauvegarde des statistiques");
          }
        } catch (error) {
          console.error("Failed to save game session:", error);
          toast.error("Erreur lors de la sauvegarde des statistiques");
        } finally {
          setIsSaving(false);
        }
      } else {
        console.warn("No game results found in localStorage");
      }
    };

    saveToDatabase();
  }, []);

  const handlePlayAgain = () => {
    // Clear challenge data when playing again (not repeating the same challenge)
    clearChallengeData();
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

  const getResultMessage = (score: number, maxScore: number): string => {
    const percentage = (score / maxScore) * 100;
    
    if (percentage === 100) {
      return t('results.message.perfect');
    } else if (percentage >= 80) {
      return t('results.message.excellent', { score, maxScore });
    } else if (percentage >= 60) {
      return t('results.message.great', { score, maxScore });
    } else if (percentage >= 40) {
      return t('results.message.good', { score, maxScore });
    } else {
      return t('results.message.okay', { score, maxScore });
    }
  };


  return (
    <AppLayout>
      <main className="relative w-full min-h-screen md:min-h-[600px]]">
        {/* Homepage button */}
        <button
          onClick={handleGoHome}
          className="absolute top-4 left-4 z-10 w-12 h-12 flex justify-center items-center border shadow-[0px_3px_3px_rgba(0,0,0,0.06)] bg-white rounded-xl border-solid border-[#CCC] hover:bg-gray-50 transition-colors"
          aria-label="Homepage"
        >
          <Home className="w-5 h-5 text-[#E72F2F]" />
        </button>
        
        <div className="relative flex flex-col items-center">

          <div id="results-content" className="w-[90%] max-w-[400px] mx-auto pt-[60px] text-center flex flex-col items-center">
            <div className="mb-6 w-full">
              <div className="text-[40px] leading-[48px] font-fredoka text-[#191919] mb-4">
                🎉🎉🎉
              </div>
              <div className="text-[32px] leading-[40px] font-fredoka text-[#191919] mb-4">
              {t('results.title')}
              </div>
              <div className="text-[18px] font-sf text-[#191919] mb-6">
                {getResultMessage(totalScore, MAX_TOTAL_SCORE)}
              </div>
              <div className="flex justify-center items-center gap-2 mt-2">
                <div className="text-[64px] font-bold text-[#E72F2F] font-sf">
                  {totalScore}
                </div>
                <div className="text-[22px] font-medium text-[#191919] font-sf">
                  {t('results.points')}
                </div>
              </div>
              <div className="text-[16px] font-medium text-[#191919] mt-1 font-sf">
                {t('results.movies.guessed')}: {score} / {totalMovies}
              </div>
              <div className="text-[16px] font-medium text-[#191919] font-sf">
                {t('results.total.time')}: {formatTime(gameTime)}
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full mt-4">
              {guessedMovies.length > 0 && (
                <div className="text-left text-[18px] font-bold flex items-center font-sf">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  {t('results.guessed.movies')}
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
                       <div className="font-bold text-[16px] text-[#191919] mb-1 font-sf">
                         {language === 'fr' && movie.frenchTitle ? movie.frenchTitle : movie.title}
                       </div>
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
                  {t('results.passed.movies')}
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
                       <div className="font-bold text-[16px] text-[#191919] mb-1 font-sf">
                         {language === 'fr' && movie.frenchTitle ? movie.frenchTitle : movie.title}
                       </div>
                       <div className="text-2xl mb-1">{movie.emojis}</div>
                     </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex w-full gap-2 mt-8 flex-col">
              {/* Share button - only show if session is saved and not from a challenge */}
              {savedSessionId && !challengeSourceSessionId && (
                <ShareButton 
                  sessionId={savedSessionId}
                  playerNickname={playerNickname}
                  score={score}
                  totalMovies={totalMovies}
                />
              )}

              {/* Share copy button for challenges */}
              {challengeSourceSessionId && (
                <ShareCopyButton 
                  challengeSourceScore={challengeSourceScore}
                  currentScore={totalScore}
                  moviesGuessed={score}
                  totalMovies={totalMovies}
                />
              )}
              
              <button
                className="w-full h-14 border text-[#191919] text-xl font-bold shadow-[0px_3px_3px_rgba(0,0,0,0.08)] bg-white rounded-2xl border-solid border-[#CCC] hover:bg-gray-50 transition-colors font-sf"
                onClick={handlePlayAgain}
              >
                {t('play.again')}
              </button>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
};

export default Results;
