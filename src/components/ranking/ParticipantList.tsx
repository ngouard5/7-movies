
import React from "react";
import { Timer, Trophy } from "lucide-react";
import { Participant } from "@/utils/gameStorage";
import { formatTime } from "@/utils/gameStorage";

interface ParticipantListProps {
  participants: Participant[];
}

export const ParticipantList: React.FC<ParticipantListProps> = ({ participants }) => {
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
    <div className="w-full">
      <div className="text-[16px] font-bold text-[#191919] mb-2 text-left">
        Leaderboard
      </div>
      
      <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto w-full">
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
  );
};
