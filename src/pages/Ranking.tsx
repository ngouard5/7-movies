
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BackgroundGradients } from "@/components/game/BackgroundGradients";
import { GameSession } from "@/utils/gameStorage";
import { getMovieById } from "@/services/movieService";
import { BackButton } from "@/components/ranking/BackButton";
import { SessionHeader } from "@/components/ranking/SessionHeader";
import { SessionTabs } from "@/components/ranking/SessionTabs";
import { getGameSession, subscribeToSession } from "@/services/gameSessionService";
import { toast } from "sonner";

const Ranking = () => {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<GameSession | null>(null);
  const [moviePosters, setMoviePosters] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Function to load session data from Firestore with optimized performance
  const loadSessionData = async () => {
    if (!id) {
      navigate("/history");
      return;
    }

    try {
      console.time('LoadSessionData');
      
      // Attempt to get session data
      const firestoreSession = await getGameSession(id);
      
      console.timeEnd('LoadSessionData');
      
      if (firestoreSession) {
        console.log("Loaded session data:", firestoreSession);
        
        // Ensure we have participants array properly sorted
        if (firestoreSession.participants) {
          firestoreSession.participants.sort((a, b) => a.totalTime - b.totalTime);
        }
        
        setSession(firestoreSession);
        
        // Fetch movie posters in parallel
        fetchMoviePosters(firestoreSession.movies);
      } else {
        console.error("Session not found:", id);
        toast.error("Session not found", {
          description: "Could not find this game session"
        });
        navigate("/history");
      }
    } catch (error) {
      console.error("Error loading session:", error);
      toast.error("Error loading session", {
        description: "There was a problem loading this game session"
      });
      navigate("/history");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch movie posters with optimized performance
  const fetchMoviePosters = async (movies: any[]) => {
    if (!movies || movies.length === 0) return;
    
    try {
      console.time('FetchMoviePosters');
      
      const posters: Record<string, string> = {};
      const fetchPromises = movies.map(async (movie) => {
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
      });
      
      // Wait for all poster fetches to complete
      await Promise.all(fetchPromises);
      
      console.timeEnd('FetchMoviePosters');
      setMoviePosters(posters);
    } catch (error) {
      console.error("Error fetching movie posters:", error);
    }
  };

  // Load session data on mount and when id changes
  useEffect(() => {
    setIsLoading(true);
    loadSessionData();
  }, [id]);

  // Subscribe to real-time updates from Firestore
  useEffect(() => {
    if (!id) return;
    
    // Set up real-time listener for this session
    const unsubscribe = subscribeToSession(id, (updatedSession) => {
      console.log("Real-time update received");
      
      // Ensure we have participants array properly sorted
      if (updatedSession.participants) {
        updatedSession.participants.sort((a, b) => a.totalTime - b.totalTime);
      }
      
      setSession(updatedSession);
    });
    
    // Clean up subscription when component unmounts
    return () => unsubscribe();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <main className="relative w-full max-w-[393px] min-h-[852px] overflow-hidden bg-neutral-50 mx-auto my-0 max-md:w-full">
        <BackgroundGradients />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xl">Loading session data...</div>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="relative w-full max-w-[393px] min-h-[852px] overflow-hidden bg-neutral-50 mx-auto my-0 max-md:w-full">
        <BackgroundGradients />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xl">Session not found</div>
        </div>
      </main>
    );
  }

  // Ensure participants is always an array
  const participants = session.participants || [{
    id: session.id,
    nickname: session.playerNickname,
    avatar: session.playerAvatar,
    totalTime: session.totalTime
  }];
  
  console.log("Current participants in render:", participants);

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

