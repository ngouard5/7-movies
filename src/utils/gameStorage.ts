
import { MovieData } from "@/hooks/useGameLogic";

export interface GameSession {
  id: string;
  date: string;
  totalTime: number;
  movies: MovieData[];
  playerNickname: string;
  playerAvatar: string;
  participants?: Participant[];
  isParticipant?: boolean; // Flag to identify if user participated in this session
}

export interface Participant {
  id: string;
  nickname: string;
  avatar: string;
  totalTime: number;
}

// Store a new game session
export const saveGameSession = (
  totalTime: number,
  movies: MovieData[],
  playerNickname: string,
  playerAvatar: string
): string => {
  const sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);
  const today = new Date();
  
  const session: GameSession = {
    id: sessionId,
    date: today.toISOString(),
    totalTime,
    movies,
    playerNickname,
    playerAvatar,
    participants: [
      {
        id: sessionId, // Initial creator is first participant
        nickname: playerNickname,
        avatar: playerAvatar,
        totalTime: totalTime,
      }
    ],
    isParticipant: true // This is the user's own session
  };
  
  // Get existing sessions
  const existingSessions = getGameSessions();
  
  // Add new session
  existingSessions.unshift(session);
  
  // Save updated sessions
  localStorage.setItem('gameSessions', JSON.stringify(existingSessions));
  
  return sessionId;
};

// Get all game sessions
export const getGameSessions = (): GameSession[] => {
  const sessions = localStorage.getItem('gameSessions');
  if (!sessions) return [];
  
  try {
    return JSON.parse(sessions);
  } catch (e) {
    console.error('Error parsing game sessions:', e);
    return [];
  }
};

// Get a specific game session by ID
export const getGameSessionById = (id: string): GameSession | undefined => {
  const sessions = getGameSessions();
  return sessions.find(session => session.id === id);
};

// Add a participant to a game session (for challenges)
export const addParticipantToSession = (
  sessionId: string, 
  nickname: string, 
  avatar: string, 
  totalTime: number
): boolean => {
  const sessions = getGameSessions();
  const sessionIndex = sessions.findIndex(session => session.id === sessionId);
  
  if (sessionIndex === -1) {
    console.error(`Session with ID ${sessionId} not found`);
    
    // Special case: try to reload from sessionStorage to get the latest data
    const sharedSession = sessionStorage.getItem(`shared_session_${sessionId}`);
    if (sharedSession) {
      try {
        const parsedSession = JSON.parse(sharedSession);
        
        // Add to local sessions and mark as participated
        parsedSession.isParticipant = true;
        
        // Make sure it has participants array
        if (!parsedSession.participants) {
          parsedSession.participants = [];
        }
        
        // Add the new participant
        const participantId = Date.now().toString(36) + Math.random().toString(36).substring(2);
        parsedSession.participants.push({
          id: participantId,
          nickname,
          avatar,
          totalTime
        });
        
        // Sort participants
        parsedSession.participants.sort((a: Participant, b: Participant) => a.totalTime - b.totalTime);
        
        // Add to sessions
        sessions.unshift(parsedSession);
        localStorage.setItem('gameSessions', JSON.stringify(sessions));
        
        // Update session storage too
        sessionStorage.setItem(`shared_session_${sessionId}`, JSON.stringify(parsedSession));
        
        return true;
      } catch (e) {
        console.error('Error parsing shared session:', e);
        return false;
      }
    }
    
    return false;
  }
  
  const participantId = Date.now().toString(36) + Math.random().toString(36).substring(2);
  
  if (!sessions[sessionIndex].participants) {
    sessions[sessionIndex].participants = [];
  }
  
  // Debug log
  console.log("Current participants before adding new one:", 
    sessions[sessionIndex].participants);
  
  // Check if a participant with the same nickname already exists
  const existingParticipantIndex = sessions[sessionIndex].participants!.findIndex(
    p => p.nickname === nickname && p.avatar === avatar
  );
  
  if (existingParticipantIndex !== -1) {
    // Update the existing participant's time if the new time is better
    if (totalTime < sessions[sessionIndex].participants![existingParticipantIndex].totalTime) {
      console.log(`Updating existing participant ${nickname}'s time from ${sessions[sessionIndex].participants![existingParticipantIndex].totalTime} to ${totalTime}`);
      sessions[sessionIndex].participants![existingParticipantIndex].totalTime = totalTime;
    }
  } else {
    // Add new participant
    console.log(`Adding new participant ${nickname} with time ${totalTime}`);
    sessions[sessionIndex].participants!.push({
      id: participantId,
      nickname,
      avatar,
      totalTime
    });
  }
  
  // Sort participants by total time (ascending)
  sessions[sessionIndex].participants!.sort((a, b) => a.totalTime - b.totalTime);
  
  // Debug log
  console.log("Updated participants after adding/updating:", 
    sessions[sessionIndex].participants);
  
  // Mark this session as participated in
  // Create a deep copy to make sure the changes are detected when saving
  const updatedSession = JSON.parse(JSON.stringify(sessions[sessionIndex]));
  updatedSession.isParticipant = true;
  sessions[sessionIndex] = updatedSession;
  
  // Save updated sessions
  localStorage.setItem('gameSessions', JSON.stringify(sessions));
  
  // Also save in sessionStorage for cross-device access
  sessionStorage.setItem(`shared_session_${sessionId}`, JSON.stringify(updatedSession));
  
  return true;
};

// Get the user's game sessions (includes created sessions and participated sessions)
export const getUserGameSessions = (): GameSession[] => {
  const sessions = getGameSessions();
  return sessions.filter(session => session.isParticipant === true);
};

// Format date for display
export const formatSessionDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Format time (seconds) to mm:ss
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Save game session to SessionStorage to share across devices (using the same URL)
export const saveSharedGameSession = (session: GameSession): void => {
  try {
    // Store in sessionStorage for cross-device access using the same URL
    sessionStorage.setItem(`shared_session_${session.id}`, JSON.stringify(session));
    console.log(`Saved shared session ${session.id} to sessionStorage`);
  } catch (e) {
    console.error('Error saving shared session:', e);
  }
};
