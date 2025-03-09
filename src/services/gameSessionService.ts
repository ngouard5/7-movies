
import { GameSession, Participant } from '@/utils/gameStorage';
import { MovieData } from '@/types/gameTypes';

// Session cache to improve performance
const sessionCache = new Map<string, {data: GameSession, timestamp: number}>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Helper function to clean session IDs (remove local- prefix)
const cleanSessionId = (id: string): string => {
  return id.replace(/^local-/, '');
};

// Helper function to generate a unique ID
const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Flag to simulate online/offline mode
let _onlineMode = false;

// Function to check if we're in online mode
export const isOnlineMode = (): boolean => {
  return _onlineMode;
};

// Function to toggle online mode for testing
export const toggleOnlineMode = (online: boolean): void => {
  _onlineMode = online;
  console.log(`Online mode set to: ${online}`);
};

// Create a new game session
export const createGameSession = async (
  totalTime: number,
  movies: MovieData[],
  playerNickname: string,
  playerAvatar: string
): Promise<string> => {
  try {
    // Generate a unique ID for the session
    const sessionId = generateUniqueId();
    const participantId = `anonymous-${generateUniqueId()}`;
    
    const participant: Participant = {
      id: participantId,
      nickname: playerNickname,
      avatar: playerAvatar,
      totalTime
    };
    
    const session: GameSession = {
      id: sessionId,
      date: new Date().toISOString(),
      totalTime,
      movies,
      playerNickname,
      playerAvatar,
      participants: [participant],
      isParticipant: true
    };
    
    // Save to localStorage
    const existingSessions = JSON.parse(localStorage.getItem('gameSessions') || '[]');
    existingSessions.unshift(session);
    localStorage.setItem('gameSessions', JSON.stringify(existingSessions));
    
    // Update the cache
    sessionCache.set(sessionId, {data: session, timestamp: Date.now()});
    
    return sessionId;
  } catch (error) {
    console.error("Error creating game session:", error);
    
    // Generate a local ID for offline fallback
    const localId = `local-${generateUniqueId()}`;
    
    // Create a local session
    const session: GameSession = {
      id: localId,
      date: new Date().toISOString(),
      totalTime,
      movies,
      playerNickname,
      playerAvatar,
      participants: [{
        id: localId,
        nickname: playerNickname,
        avatar: playerAvatar,
        totalTime
      }],
      isParticipant: true
    };
    
    // Save to localStorage
    const existingSessions = JSON.parse(localStorage.getItem('gameSessions') || '[]');
    existingSessions.unshift(session);
    localStorage.setItem('gameSessions', JSON.stringify(existingSessions));
    
    return localId;
  }
};

// Get a specific game session with caching
export const getGameSession = async (sessionId: string): Promise<GameSession | null> => {
  try {
    // Clean the session ID
    const cleanId = cleanSessionId(sessionId);
    
    // Check cache first
    const cachedSession = sessionCache.get(cleanId);
    if (cachedSession && (Date.now() - cachedSession.timestamp) < CACHE_DURATION) {
      console.log("Retrieved session from cache:", cleanId);
      return cachedSession.data;
    }
    
    // Check localStorage for sessions
    const localSessions = JSON.parse(localStorage.getItem('gameSessions') || '[]');
    const localSession = localSessions.find((s: GameSession) => 
      cleanSessionId(s.id) === cleanId || s.id === cleanId
    );
    
    if (localSession) {
      console.log("Found session in localStorage:", cleanId);
      
      // Ensure participants are sorted by time
      if (localSession.participants) {
        localSession.participants.sort((a, b) => a.totalTime - b.totalTime);
      } else {
        // If no participants array, create one with the original player
        localSession.participants = [{
          id: localSession.id,
          nickname: localSession.playerNickname,
          avatar: localSession.playerAvatar,
          totalTime: localSession.totalTime
        }];
      }
      
      // Update cache
      sessionCache.set(cleanId, {data: localSession, timestamp: Date.now()});
      
      return localSession;
    }
    
    // Check sessionStorage for shared sessions
    const sharedSession = sessionStorage.getItem(`shared_session_${cleanId}`);
    if (sharedSession) {
      try {
        const parsedSession = JSON.parse(sharedSession);
        // Ensure participants are sorted
        if (parsedSession.participants) {
          parsedSession.participants.sort((a, b) => a.totalTime - b.totalTime);
        }
        return parsedSession;
      } catch (e) {
        console.error("Error parsing shared session:", e);
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching game session:", error);
    return null;
  }
};

// Add a participant to a game session
export const addParticipantToSession = async (
  sessionId: string,
  nickname: string,
  avatar: string,
  totalTime: number
): Promise<boolean> => {
  try {
    // Clean the session ID
    const cleanId = cleanSessionId(sessionId);
    
    return updateLocalSession(cleanId, nickname, avatar, totalTime);
  } catch (error) {
    console.error("Error adding participant to session:", error);
    return false;
  }
};

// Helper function to update a local session
const updateLocalSession = (
  sessionId: string,
  nickname: string,
  avatar: string,
  totalTime: number
): boolean => {
  try {
    const cleanId = cleanSessionId(sessionId);
    const localSessions = JSON.parse(localStorage.getItem('gameSessions') || '[]');
    let sessionIndex = localSessions.findIndex((s: GameSession) => s.id === cleanId);
    
    // If not found, try with local- prefix
    if (sessionIndex === -1) {
      sessionIndex = localSessions.findIndex((s: GameSession) => s.id === sessionId);
    }
    
    if (sessionIndex !== -1) {
      const session = localSessions[sessionIndex];
      
      // Add or update participant
      const localParticipantId = `local-${generateUniqueId()}`;
      const participants = session.participants || [];
      
      const existingParticipantIndex = participants.findIndex(
        (p: Participant) => p.nickname === nickname && p.avatar === avatar
      );
      
      if (existingParticipantIndex !== -1) {
        if (participants[existingParticipantIndex].totalTime > totalTime) {
          participants[existingParticipantIndex].totalTime = totalTime;
        }
      } else {
        participants.push({
          id: localParticipantId,
          nickname,
          avatar,
          totalTime
        });
      }
      
      // Sort participants
      participants.sort((a: Participant, b: Participant) => a.totalTime - b.totalTime);
      
      // Update the session
      session.participants = participants;
      localSessions[sessionIndex] = session;
      
      // Save back to localStorage
      localStorage.setItem('gameSessions', JSON.stringify(localSessions));
      
      // Also update sessionStorage for shared sessions
      sessionStorage.setItem(`shared_session_${cleanId}`, JSON.stringify(session));
      
      return true;
    }
    
    // Check if there's a shared session in sessionStorage
    const sharedSession = sessionStorage.getItem(`shared_session_${cleanId}`);
    if (sharedSession) {
      try {
        const session = JSON.parse(sharedSession);
        
        if (!session.participants) {
          session.participants = [];
        }
        
        const localParticipantId = `local-${generateUniqueId()}`;
        const existingIndex = session.participants.findIndex(
          (p: Participant) => p.nickname === nickname && p.avatar === avatar
        );
        
        if (existingIndex !== -1) {
          if (session.participants[existingIndex].totalTime > totalTime) {
            session.participants[existingIndex].totalTime = totalTime;
          }
        } else {
          session.participants.push({
            id: localParticipantId,
            nickname,
            avatar,
            totalTime
          });
        }
        
        // Sort participants
        session.participants.sort((a: Participant, b: Participant) => a.totalTime - b.totalTime);
        
        // Save to sessionStorage
        sessionStorage.setItem(`shared_session_${cleanId}`, JSON.stringify(session));
        
        // Add to localStorage
        localSessions.unshift(session);
        localStorage.setItem('gameSessions', JSON.stringify(localSessions));
        
        return true;
      } catch (e) {
        console.error("Error processing shared session:", e);
      }
    }
    
    return false;
  } catch (e) {
    console.error("Error updating local session:", e);
    return false;
  }
};

// Subscribe to real-time updates for a session
export const subscribeToSession = (
  sessionId: string,
  callback: (session: GameSession) => void
) => {
  try {
    // Clean the ID
    const cleanId = cleanSessionId(sessionId);
    
    // Safety check for empty ID
    if (!cleanId) {
      console.error("Cannot subscribe to session with empty ID");
      return () => {}; // Return no-op unsubscribe function
    }

    // Try to fetch local session once
    try {
      const localSessions = JSON.parse(localStorage.getItem('gameSessions') || '[]');
      const localSession = localSessions.find((s: GameSession) => 
        cleanSessionId(s.id) === cleanId || s.id === cleanId
      );
      
      if (localSession) {
        callback(localSession);
      } else {
        // Check sessionStorage for shared sessions
        const sharedSession = sessionStorage.getItem(`shared_session_${cleanId}`);
        if (sharedSession) {
          try {
            callback(JSON.parse(sharedSession));
          } catch (e) {
            console.error("Error parsing shared session:", e);
          }
        }
      }
    } catch (localError) {
      console.error("Error fetching from localStorage:", localError);
    }
    
    // Return a no-op unsubscribe function
    return () => {};
  } catch (error) {
    console.error("Error setting up subscription:", error);
    
    // Return a no-op unsubscribe function
    return () => {};
  }
};

// Get user's participated sessions
export const getUserSessions = async (): Promise<GameSession[]> => {
  try {
    // Get sessions from localStorage
    const localSessions = JSON.parse(localStorage.getItem('gameSessions') || '[]');
    
    // Sort by most recent first
    return localSessions.sort((a: GameSession, b: GameSession) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    return [];
  }
};
