
import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs, 
  onSnapshot,
  arrayUnion,
  Timestamp
} from 'firebase/firestore';
import { ensureAuthenticated } from './firebase';
import { MovieData } from '@/types/gameTypes';
import { GameSession, Participant } from '@/utils/gameStorage';

// Collection references
const sessionsCollection = collection(db, 'gameSessions');

// Session cache to improve performance
const sessionCache = new Map<string, {data: GameSession, timestamp: number}>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Create a new game session
export const createGameSession = async (
  totalTime: number,
  movies: MovieData[],
  playerNickname: string,
  playerAvatar: string
): Promise<string> => {
  try {
    const user = await ensureAuthenticated();
    
    const sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const participant: Participant = {
      id: user.uid,
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
    
    // Save to Firestore
    await setDoc(doc(sessionsCollection, sessionId), {
      ...session,
      createdAt: Timestamp.now(),
      createdBy: user.uid
    });
    
    // Also save to localStorage for offline access
    const existingSessions = JSON.parse(localStorage.getItem('gameSessions') || '[]');
    existingSessions.unshift(session);
    localStorage.setItem('gameSessions', JSON.stringify(existingSessions));
    
    // Update the cache
    sessionCache.set(sessionId, {data: session, timestamp: Date.now()});
    
    return sessionId;
  } catch (error) {
    console.error("Error creating game session:", error);
    
    // Generate a local ID for offline fallback
    const localId = "local-" + Date.now().toString(36);
    return localId;
  }
};

// Get a specific game session with caching
export const getGameSession = async (sessionId: string): Promise<GameSession | null> => {
  try {
    // Check cache first
    const cachedSession = sessionCache.get(sessionId);
    if (cachedSession && (Date.now() - cachedSession.timestamp) < CACHE_DURATION) {
      console.log("Retrieved session from cache:", sessionId);
      return cachedSession.data;
    }
    
    console.log("Fetching session from Firestore:", sessionId);
    const sessionDoc = await getDoc(doc(sessionsCollection, sessionId));
    
    if (sessionDoc.exists()) {
      // Convert Firestore timestamp to ISO string
      const data = sessionDoc.data() as GameSession & { createdAt?: any };
      if (data.createdAt) {
        data.date = data.createdAt.toDate().toISOString();
        delete data.createdAt;
      }
      
      // Ensure participants are sorted by time
      if (data.participants) {
        data.participants.sort((a, b) => a.totalTime - b.totalTime);
      } else {
        // If no participants array, create one with the original player
        data.participants = [{
          id: data.id,
          nickname: data.playerNickname,
          avatar: data.playerAvatar,
          totalTime: data.totalTime
        }];
      }
      
      // Update cache
      sessionCache.set(sessionId, {data: data as GameSession, timestamp: Date.now()});
      
      return data as GameSession;
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
    // Generate a unique participant ID if not authenticated
    let participantId;
    try {
      const user = await ensureAuthenticated();
      participantId = user.uid;
    } catch (error) {
      // If authentication fails, generate a random ID
      participantId = "anon-" + Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
    
    const sessionRef = doc(sessionsCollection, sessionId);
    const sessionDoc = await getDoc(sessionRef);
    
    if (!sessionDoc.exists()) {
      console.error(`Session with ID ${sessionId} not found in Firestore`);
      return false;
    }
    
    const sessionData = sessionDoc.data() as GameSession;
    let participants = sessionData.participants || [];
    
    // Deep copy the participants array to avoid reference issues
    participants = JSON.parse(JSON.stringify(participants));
    
    console.log("Original participants:", participants);
    
    // Check if this user has already participated
    const existingParticipantIndex = participants.findIndex(
      p => p.id === participantId || (p.nickname === nickname && p.avatar === avatar)
    );
    
    const newParticipant: Participant = {
      id: participantId,
      nickname,
      avatar,
      totalTime
    };
    
    if (existingParticipantIndex !== -1) {
      // If existing time is better, don't update
      if (participants[existingParticipantIndex].totalTime <= totalTime) {
        console.log("Existing participant has better time, not updating");
        return true;
      }
      
      // Update existing participant's time
      console.log("Updating existing participant's time");
      participants[existingParticipantIndex].totalTime = totalTime;
    } else {
      // Add new participant
      console.log("Adding new participant");
      participants.push(newParticipant);
    }
    
    // Sort participants by total time
    participants.sort((a, b) => a.totalTime - b.totalTime);
    
    console.log("Updated participants array:", participants);
    
    // Update in Firestore with the complete, sorted array
    await updateDoc(sessionRef, {
      participants: participants
    });
    
    console.log("Firestore document updated successfully");
    return true;
  } catch (error) {
    console.error("Error adding participant to session:", error);
    
    // If Firestore fails, try to update locally
    try {
      // Get the session from localStorage
      const localSessions = JSON.parse(localStorage.getItem('gameSessions') || '[]');
      const sessionIndex = localSessions.findIndex((s: GameSession) => s.id === sessionId);
      
      if (sessionIndex !== -1) {
        const session = localSessions[sessionIndex];
        
        // Add or update participant
        const participantId = "local-" + Date.now().toString(36);
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
            id: participantId,
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
        return true;
      }
    } catch (localError) {
      console.error("Error updating local session:", localError);
    }
    
    return false;
  }
};

// Subscribe to real-time updates for a session
export const subscribeToSession = (
  sessionId: string,
  callback: (session: GameSession) => void
) => {
  const sessionRef = doc(sessionsCollection, sessionId);
  
  return onSnapshot(sessionRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data() as GameSession & { createdAt?: any };
      if (data.createdAt) {
        data.date = data.createdAt.toDate().toISOString();
        delete data.createdAt;
      }
      
      // Ensure participants are sorted
      if (data.participants) {
        data.participants.sort((a, b) => a.totalTime - b.totalTime);
      } else {
        // If no participants array, create one with the original player
        data.participants = [{
          id: data.id,
          nickname: data.playerNickname,
          avatar: data.playerAvatar,
          totalTime: data.totalTime
        }];
      }
      
      callback(data as GameSession);
    }
  }, (error) => {
    console.error("Error in session subscription:", error);
  });
};

// Get user's participated sessions
export const getUserSessions = async (): Promise<GameSession[]> => {
  try {
    const user = await ensureAuthenticated();
    
    // Query sessions where the user is a participant
    const q = query(
      sessionsCollection,
      where(`participants`, 'array-contains', { id: user.uid })
    );
    
    const querySnapshot = await getDocs(q);
    const sessions: GameSession[] = [];
    
    querySnapshot.forEach(doc => {
      const data = doc.data() as GameSession & { createdAt?: any };
      if (data.createdAt) {
        data.date = data.createdAt.toDate().toISOString();
        delete data.createdAt;
      }
      sessions.push(data as GameSession);
    });
    
    // Sort by most recent first
    return sessions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    
    // Fallback to localStorage
    try {
      const localSessions = JSON.parse(localStorage.getItem('gameSessions') || '[]');
      return localSessions.sort((a: GameSession, b: GameSession) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } catch (localError) {
      console.error("Error fetching local sessions:", localError);
      return [];
    }
  }
};
