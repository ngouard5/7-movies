
import React from "react";
import { Calendar } from "lucide-react";
import { formatSessionDate } from "@/utils/gameStorage";
import { ShareButton } from "./ShareButton";
import { GameSession } from "@/utils/gameStorage";

interface SessionHeaderProps {
  session: GameSession;
  sessionId: string | undefined;
}

export const SessionHeader: React.FC<SessionHeaderProps> = ({ session, sessionId }) => {
  return (
    <div className="mb-4 w-full text-left">
      <div className="text-[22px] font-bold text-[#191919]">
        Game Session
      </div>
      <div className="flex justify-between items-center mt-1">
        <div className="text-[16px] text-gray-500 flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {formatSessionDate(session.date)}
        </div>
        
        <ShareButton session={session} sessionId={sessionId} />
      </div>
    </div>
  );
};
