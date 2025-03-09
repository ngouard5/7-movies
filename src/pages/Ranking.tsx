
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
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const navigate = useNavigate();

  // Function to load session data with optimized performance
  const loadSessionData = async () => {
    if (!id) {
      navigate("/history");
      return;
    }

    try {
      console.time('LoadSessionData');
      
      // Clean the ID (remove any 'local-' prefix)
      const cleanId = id.replace(/^local-/, '');
      console.log("Loading session data for ID:", cleanId);
      
      // Check if we have it in sessionStorage first (for shared challenges)
      const cachedSession = sessionStorage.getItem(`shared_session_${cleanId}`);
      if (cachedSession) {
        try {
          const parsedSession = JSON.parse(cachedSession);
          console.log("Found session in sessionStorage:", parsedSession);
          
          // Ensure we have participants array properly sorted
          if (parsedSession.participants) {
            parsedSession.participants.sort((a, b) => a.totalTime - b.totalTime);
          } else {
            parsedSession.participants = [{
              id: parsedSession.id,
              nickname: parsedSession.playerNickname,
              avatar: parsedSession.playerAvatar,
              totalTime: parsedSession.totalTime
            }];
          }
          
          setSession(parsedSession);
          fetchMoviePosters(parsedSession.movies);
          setIsLoading(false);
          return;
        } catch (e) {
          console.error("Error parsing cached session:", e);
        }
      }
      
      // Attempt to get session data from localStorage
      const sessionData = await getGameSession(cleanId);
      
      console.timeEnd('LoadSessionData');
      
      if (sessionData) {
        console.log("Loaded session data:", sessionData);
        
        // Ensure we have participants array properly sorted
        if (sessionData.participants) {
          sessionData.participants.sort((a, b) => a.totalTime - b.totalTime);
        } else {
          sessionData.participants = [{
            id: sessionData.id,
            nickname: sessionData.playerNickname,
            avatar: sessionData.playerAvatar,
            totalTime: sessionData.totalTime
          }];
        }
        
        setSession(sessionData);
        
        // Fetch movie posters in parallel
        fetchMoviePosters(sessionData.movies);
      } else {
        console.error("Session not found:", cleanId);
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
            // First check if the movie already has an image property
            if (movie.image && movie.image !== "N/A") {
              posters[movie.id] = movie.image;
              return;
            }
            
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

  // Subscribe to local storage updates
  useEffect(() => {
    if (!id || subscriptionActive || !session) return;
    
    // Clean the ID
    const cleanId = id.replace(/^local-/, '');
    
    try {
      console.log("Setting up subscription for session:", cleanId);
      
      // Set up listener
      const unsubscribe = subscribeToSession(cleanId, (updatedSession) => {
        console.log("Session update received");
        
        // Ensure we have participants array properly sorted
        if (updatedSession.participants) {
          updatedSession.participants.sort((a, b) => a.totalTime - b.totalTime);
        }
        
        setSession(updatedSession);
      });

      setSubscriptionActive(true);
      
      // Clean up subscription when component unmounts
      return () => {
        console.log("Cleaning up subscription");
        unsubscribe();
        setSubscriptionActive(false);
      };
    } catch (error) {
      console.error("Failed to subscribe to session updates:", error);
      // Don't try to subscribe again if it fails
      setSubscriptionActive(true);
      return () => setSubscriptionActive(false);
    }
  }, [id, session, subscriptionActive]);

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
