
import { MovieData } from "@/hooks/useGameLogic";

export interface GameSession {
  id: string;
  date: string;
  totalTime: number;
  movies: MovieData[];
  playerNickname: string;
  playerAvatar: string;
  participants?: Participant[];
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
    ]
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
  
  if (sessionIndex === -1) return false;
  
  const participantId = Date.now().toString(36) + Math.random().toString(36).substring(2);
  
  if (!sessions[sessionIndex].participants) {
    sessions[sessionIndex].participants = [];
  }
  
  sessions[sessionIndex].participants!.push({
    id: participantId,
    nickname,
    avatar,
    totalTime
  });
  
  // Sort participants by total time (ascending)
  sessions[sessionIndex].participants!.sort((a, b) => a.totalTime - b.totalTime);
  
  // Save updated sessions
  localStorage.setItem('gameSessions', JSON.stringify(sessions));
  
  return true;
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
