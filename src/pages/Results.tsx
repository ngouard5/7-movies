import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MenuButton } from "@/components/game/MenuButton";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { ClipboardList, Share, Timer } from "lucide-react";
import { toast } from "sonner";
import { 
  formatTime, 
  getGameSessionById
} from "@/utils/gameStorage";
import { 
  createGameSession, 
  addParticipantToSession, 
  getGameSession 
} from "@/services/gameSessionService";

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
  const [challengeSessionId, setChallengeSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const time = localStorage.getItem("gameTime");
    const movies = localStorage.getItem("guessedMovies");
    const nickname = localStorage.getItem("playerNickname");
    const avatar = localStorage.getItem("playerAvatar");
    const challengeId = localStorage.getItem("currentChallengeId");

    if (challengeId) {
      setChallengeSessionId(challengeId);
    }

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
      const avatars = ["👨‍🦰", "👩‍🦰", "👨‍🦱", "👩‍🦱", "👨‍🦳", "👨‍🦳", "👨‍🦲", "👩‍🦲"];
      setPlayerAvatar(avatars[avatarIndex] || "👨‍🦰");
    }

    if (time && movies && nickname) {
      handleSaveResults(parseInt(time), JSON.parse(movies), nickname, avatar);
    }
  }, []);

  const handleSaveResults = async (
    parsedTime: number, 
    parsedMovies: any[], 
    nickname: string, 
    avatarStr: string
  ) => {
    setIsLoading(true);
    
    try {
      const avatarIndex = parseInt(avatarStr || "0");
      const avatars = ["👨‍🦰", "👩‍🦰", "👨‍🦱", "👩‍🦱", "👨‍🦳", "👩‍🦳", "👨‍🦲", "👩‍🦲"];
      const avatarEmoji = avatars[avatarIndex] || "👨‍🦰";
      
      // Check if this was a challenge response
      if (challengeSessionId) {
        console.log("This was a challenge response for session:", challengeSessionId);
        
        // Try to get the session from Firestore first
        const firestoreSession = await getGameSession(challengeSessionId);
        
        if (firestoreSession) {
          console.log("Found challenge session in Firestore:", firestoreSession);
          
          // Add participant to the Firestore session
          const added = await addParticipantToSession(
            challengeSessionId,
            nickname,
            avatarEmoji,
            parsedTime
          );
          
          console.log(`Added participant to Firestore session ${challengeSessionId}: ${added}`);
          setSessionId(challengeSessionId);
        } else {
          // Fall back to local session if Firestore fails
          console.log("Challenge session not found in Firestore, checking local storage");
          
          // Check sessionStorage and localStorage
          const sharedSession = sessionStorage.getItem(`shared_session_${challengeSessionId}`);
          
          if (sharedSession) {
            console.log("Found shared session in sessionStorage:", JSON.parse(sharedSession));
            
            // Try to create this session in Firestore
            try {
              const parsedSession = JSON.parse(sharedSession);
              
              // Add the current player as a participant
              if (!parsedSession.participants) {
                parsedSession.participants = [];
              }
              
              // Create this session in Firestore
              const newSessionId = await createGameSession(
                parsedSession.totalTime,
                parsedSession.movies.length > 0 ? parsedSession.movies : parsedMovies, 
                parsedSession.playerNickname,
                parsedSession.playerAvatar
              );
              
              // Add the current player as a participant if they're not the original creator
              if (parsedSession.playerNickname !== nickname || parsedSession.playerAvatar !== avatarEmoji) {
                await addParticipantToSession(
                  newSessionId,
                  nickname,
                  avatarEmoji,
                  parsedTime
                );
              }
              
              setSessionId(newSessionId);
            } catch (error) {
              console.error("Error creating Firestore session from shared session:", error);
            }
          } else {
            // Fallback to localStorage
            const added = addParticipantToLocalSession(
              challengeSessionId,
              nickname,
              avatarEmoji,
              parsedTime
            );
            
            console.log(`Added participant to local session ${challengeSessionId}: ${added}`);
            setSessionId(challengeSessionId);
          }
        }
        
        // Clear the challenge ID
        localStorage.removeItem("currentChallengeId");
      } else {
        // Create a new session in Firestore
        try {
          const newSessionId = await createGameSession(
            parsedTime, 
            parsedMovies, 
            nickname, 
            avatarEmoji
          );
          
          console.log("Created new Firestore session:", newSessionId);
          setSessionId(newSessionId);
        } catch (error) {
          console.error("Error creating Firestore session:", error);
          
          // Fallback to local storage
          const localSessionId = saveGameSessionToLocalStorage(
            parsedTime, 
            parsedMovies, 
            nickname, 
            avatarEmoji
          );
          
          setSessionId(localSessionId);
        }
      }
    } catch (error) {
      console.error("Error saving game results:", error);
      toast("Error saving results", {
        description: "Your results have been saved locally only",
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fallback functions for localStorage
  const saveGameSessionToLocalStorage = (
    totalTime: number,
    movies: any[],
    playerNickname: string,
    playerAvatar: string
  ): string => {
    const sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const today = new Date();
    
    const session = {
      id: sessionId,
      date: today.toISOString(),
      totalTime,
      movies,
      playerNickname,
      playerAvatar,
      participants: [
        {
          id: sessionId,
          nickname: playerNickname,
          avatar: playerAvatar,
          totalTime,
        }
      ],
      isParticipant: true
    };
    
    // Get existing sessions
    const existingSessions = JSON.parse(localStorage.getItem('gameSessions') || '[]');
    
    // Add new session
    existingSessions.unshift(session);
    
    // Save updated sessions
    localStorage.setItem('gameSessions', JSON.stringify(existingSessions));
    
    // Also save to sessionStorage for shared challenges
    sessionStorage.setItem(`shared_session_${sessionId}`, JSON.stringify(session));
    
    return sessionId;
  };
  
  const addParticipantToLocalSession = (
    sessionId: string,
    nickname: string,
    avatar: string,
    totalTime: number
  ): boolean => {
    // Get from localStorage
    const sessions = JSON.parse(localStorage.getItem('gameSessions') || '[]');
    const sessionIndex = sessions.findIndex((s: any) => s.id === sessionId);
    
    if (sessionIndex === -1) {
      // Check sessionStorage
      const sharedSession = sessionStorage.getItem(`shared_session_${sessionId}`);
      if (sharedSession) {
        try {
          const parsedSession = JSON.parse(sharedSession);
          if (!parsedSession.participants) {
            parsedSession.participants = [];
          }
          
          const participantId = Date.now().toString(36) + Math.random().toString(36).substring(2);
          parsedSession.participants.push({
            id: participantId,
            nickname,
            avatar,
            totalTime
          });
          
          parsedSession.participants.sort((a: any, b: any) => a.totalTime - b.totalTime);
          parsedSession.isParticipant = true;
          
          // Add to localStorage
          sessions.unshift(parsedSession);
          localStorage.setItem('gameSessions', JSON.stringify(sessions));
          
          // Update sessionStorage
          sessionStorage.setItem(`shared_session_${sessionId}`, JSON.stringify(parsedSession));
          return true;
        } catch (e) {
          console.error("Error processing shared session:", e);
          return false;
        }
      }
      return false;
    }
    
    // Add participant to existing session
    if (!sessions[sessionIndex].participants) {
      sessions[sessionIndex].participants = [];
    }
    
    const participantId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const existingIndex = sessions[sessionIndex].participants.findIndex(
      (p: any) => p.nickname === nickname && p.avatar === avatar
    );
    
    if (existingIndex !== -1) {
      if (totalTime < sessions[sessionIndex].participants[existingIndex].totalTime) {
        sessions[sessionIndex].participants[existingIndex].totalTime = totalTime;
      }
    } else {
      sessions[sessionIndex].participants.push({
        id: participantId,
        nickname,
        avatar,
        totalTime
      });
    }
    
    sessions[sessionIndex].participants.sort((a: any, b: any) => a.totalTime - b.totalTime);
    sessions[sessionIndex].isParticipant = true;
    
    localStorage.setItem('gameSessions', JSON.stringify(sessions));
    sessionStorage.setItem(`shared_session_${sessionId}`, JSON.stringify(sessions[sessionIndex]));
    
    return true;
  };

  const handleShare = () => {
    // Use the current session ID for sharing
    const currentSessionId = sessionId;
    
    if (!currentSessionId) {
      toast.error("Cannot share challenge", {
        description: "Session ID not available",
        position: "top-right",
        duration: 3000,
      });
      return;
    }
    
    // Simply share the session ID directly
    const shareUrl = `${window.location.origin}/challenge/${currentSessionId}`;
    
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast("Link copied!", {
          description: "Challenge URL has been copied to clipboard",
          position: "top-right",
          duration: 3000,
        });
      })
      .catch(() => {
        toast.error("Unable to copy", {
          description: "Please copy the URL manually",
          position: "top-right",
          duration: 3000,
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
    // Use the challenge session ID if available, otherwise use the new session ID
    const rankingSessionId = challengeSessionId || sessionId;
    if (rankingSessionId) {
      navigate(`/ranking/${rankingSessionId}`);
    }
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

  if (isLoading) {
    return (
      <main className="relative w-full max-w-[393px] min-h-[852px] overflow-hidden bg-neutral-50 mx-auto my-0 max-md:w-full">
        <BackgroundGradients />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xl">Saving your results...</div>
        </div>
      </main>
    );
  }

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
            {guessedMovies.map((movie) => (
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
                    {displayTime(movie.guessTime)}
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
