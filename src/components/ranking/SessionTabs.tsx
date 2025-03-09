
import React from "react";
import { Film, Trophy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParticipantList } from "./ParticipantList";
import { MovieList } from "./MovieList";
import { GameSession } from "@/utils/gameStorage";
import { Participant } from "@/utils/gameStorage";

interface SessionTabsProps {
  session: GameSession;
  participants: Participant[];
  moviePosters: Record<string, string>;
}

export const SessionTabs: React.FC<SessionTabsProps> = ({ session, participants, moviePosters }) => {
  return (
    <Tabs defaultValue="ranking" className="w-full">
      <TabsList className="w-full grid grid-cols-2 mb-6">
        <TabsTrigger value="ranking" className="data-[state=active]:bg-[#E72F2F] data-[state=active]:text-white">
          <Trophy className="h-4 w-4 mr-2" />
          Ranking
        </TabsTrigger>
        <TabsTrigger value="movies" className="data-[state=active]:bg-[#E72F2F] data-[state=active]:text-white">
          <Film className="h-4 w-4 mr-2" />
          Movies
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="ranking" className="mt-0">
        <ParticipantList participants={participants} />
      </TabsContent>
      
      <TabsContent value="movies" className="mt-0">
        <MovieList movies={session.movies} moviePosters={moviePosters} />
      </TabsContent>
    </Tabs>
  );
};
