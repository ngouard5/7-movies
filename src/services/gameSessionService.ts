
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

// Create a new game session
export const createGameSession = async (
  totalTime: number,
  movies: MovieData[],
  playerNickname: string,
  playerAvatar: string
): Promise<string> => {
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
  
  return sessionId;
};

// Get a specific game session
export const getGameSession = async (sessionId: string): Promise<GameSession | null> => {
  try {
    const sessionDoc = await getDoc(doc(sessionsCollection, sessionId));
    
    if (sessionDoc.exists()) {
      // Convert Firestore timestamp to ISO string
      const data = sessionDoc.data() as GameSession & { createdAt?: any };
      if (data.createdAt) {
        data.date = data.createdAt.toDate().toISOString();
        delete data.createdAt;
      }
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
    const user = await ensureAuthenticated();
    const sessionRef = doc(sessionsCollection, sessionId);
    const sessionDoc = await getDoc(sessionRef);
    
    if (!sessionDoc.exists()) {
      console.error(`Session with ID ${sessionId} not found in Firestore`);
      return false;
    }
    
    const sessionData = sessionDoc.data() as GameSession;
    const participants = sessionData.participants || [];
    
    // Check if this user has already participated
    const existingParticipantIndex = participants.findIndex(
      p => p.id === user.uid || (p.nickname === nickname && p.avatar === avatar)
    );
    
    if (existingParticipantIndex !== -1) {
      // If existing time is better, don't update
      if (participants[existingParticipantIndex].totalTime <= totalTime) {
        return true;
      }
      
      // Update existing participant's time
      participants[existingParticipantIndex].totalTime = totalTime;
      
      // Sort participants by total time
      participants.sort((a, b) => a.totalTime - b.totalTime);
      
      // Update in Firestore
      await updateDoc(sessionRef, {
        participants
      });
    } else {
      // Add new participant
      const newParticipant: Participant = {
        id: user.uid,
        nickname,
        avatar,
        totalTime
      };
      
      // Add to Firestore using arrayUnion to avoid duplicates
      await updateDoc(sessionRef, {
        participants: arrayUnion(newParticipant)
      });
      
      // Then retrieve the updated document to get the properly sorted list
      const updatedDoc = await getDoc(sessionRef);
      if (updatedDoc.exists()) {
        const updatedData = updatedDoc.data() as GameSession;
        const updatedParticipants = updatedData.participants || [];
        
        // Sort and update
        updatedParticipants.sort((a, b) => a.totalTime - b.totalTime);
        await updateDoc(sessionRef, {
          participants: updatedParticipants
        });
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error adding participant to session:", error);
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
      callback(data as GameSession);
    }
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
    return [];
  }
};
