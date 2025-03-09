
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { getGameSessionById, GameSession, Participant } from "@/utils/gameStorage";
import { useToast } from "@/hooks/use-toast";
import { getMovieById } from "@/services/movieService";
import { BackButton } from "@/components/ranking/BackButton";
import { SessionHeader } from "@/components/ranking/SessionHeader";
import { SessionTabs } from "@/components/ranking/SessionTabs";

const Ranking = () => {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<GameSession | null>(null);
  const [moviePosters, setMoviePosters] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  // Function to load session data
  const loadSessionData = () => {
    if (!id) {
      navigate("/history");
      return;
    }

    // Load session data
    const sessionData = getGameSessionById(id);
    if (sessionData) {
      console.log("Loaded session data:", sessionData);
      setSession(sessionData);
      
      // Fetch movie posters for each movie in the session
      const fetchMoviePosters = async () => {
        const posters: Record<string, string> = {};
        
        for (const movie of sessionData.movies) {
          if (movie.imdbID) {
            try {
              const movieDetails = await getMovieById(movie.imdbID);
              if (movieDetails && movieDetails.Poster && movieDetails.Poster !== "N/A") {
                posters[movie.id] = movieDetails.Poster;
              }
            } catch (error) {
              console.error(`Failed to fetch poster for movie ${movie.title}:`, error);
            }
          }
        }
        
        setMoviePosters(posters);
      };
      
      fetchMoviePosters();
    } else {
      toast({
        title: "Session not found",
        description: "Could not find this game session",
        variant: "destructive",
      });
      navigate("/history");
    }
  };

  // Load session data on mount and when id changes
  useEffect(() => {
    loadSessionData();
  }, [id, navigate, toast]);

  // Set up periodic refresh to check for new participants
  useEffect(() => {
    // Refresh every 5 seconds to check for new participants
    const refreshInterval = setInterval(() => {
      loadSessionData();
    }, 5000);
    
    return () => clearInterval(refreshInterval);
  }, [id]);

  const handleBack = () => {
    navigate(-1);
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
  
  console.log("Current participants:", participants);

  return (
    <main className="relative w-full max-w-[393px] min-h-[852px] overflow-hidden bg-neutral-50 mx-auto my-0 max-md:w-full">
      <div className="relative h-full pb-8">
        <BackgroundGradients />

        <div className="absolute left-4 top-[69px]">
          <BackButton onBack={handleBack} />
        </div>

        <div className="absolute w-[361px] left-4 top-[134px] text-center flex flex-col items-center">
          <SessionHeader session={session} sessionId={id} />
          <SessionTabs 
            session={session} 
            participants={participants} 
            moviePosters={moviePosters} 
          />
        </div>
      </div>
    </main>
  );
};

export default Ranking;
