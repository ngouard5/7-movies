
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MenuButton } from "@/components/game/MenuButton";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { ArrowLeft, Calendar, Timer, Users } from "lucide-react";
import { getUserGameSessions, GameSession, formatTime, formatSessionDate } from "@/utils/gameStorage";

const History = () => {
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user's game sessions (both created and participated)
    const userSessions = getUserGameSessions();
    setSessions(userSessions);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleViewSession = (sessionId: string) => {
    navigate(`/ranking/${sessionId}`);
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
          <div className="mb-6 w-full text-left">
            <div className="text-[22px] font-bold text-[#191919]">
              Game History
            </div>
            <div className="text-[16px] text-gray-500 mt-1">
              Your past game sessions
            </div>
          </div>

          <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto w-full">
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <button
                  key={session.id}
                  className="flex flex-col bg-white border border-[#CCC] rounded-xl shadow-[0px_3px_3px_rgba(0,0,0,0.06)] p-4 text-left transition-all hover:bg-gray-50"
                  onClick={() => handleViewSession(session.id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-bold text-[18px] text-[#191919]">
                      {session.playerAvatar} {session.playerNickname}
                    </div>
                    <div className="flex items-center text-[16px] font-bold text-[#E72F2F]">
                      <Timer className="h-4 w-4 mr-1 inline" />
                      {formatTime(session.totalTime)}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-[14px] text-gray-500">
                    <Calendar className="h-4 w-4 mr-1 inline" />
                    {formatSessionDate(session.date)}
                  </div>
                  
                  <div className="mt-2 text-[14px] text-gray-700 flex items-center">
                    <Users className="h-4 w-4 mr-1 inline" />
                    {session.participants?.length || 1} participant{(session.participants?.length || 1) > 1 ? 's' : ''}
                  </div>
                  
                  <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                    {session.movies.slice(0, 4).map((movie) => (
                      <div key={movie.id} className="text-xl flex-shrink-0">
                        {movie.emojis.split(' ')[0]}
                      </div>
                    ))}
                    {session.movies.length > 4 && (
                      <div className="text-xl flex-shrink-0">...</div>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                No game sessions yet. Play a game to see your history!
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default History;
