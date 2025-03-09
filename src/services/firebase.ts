
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCq_EPiVKJJDPGzBqB92YcxvYkbA0Nx7FY",
  authDomain: "emoji-movie-guesser.firebaseapp.com",
  projectId: "emoji-movie-guesser",
  storageBucket: "emoji-movie-guesser.appspot.com",
  messagingSenderId: "323541835507",
  appId: "1:323541835507:web:e41ece69ece8abc66e3e80"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Flag to control whether online mode is enabled
// Set to true to allow data to be stored in Firestore when possible
const ONLINE_MODE_ENABLED = true;
// Set to false to prevent authentication attempts, which cause 400 errors
const AUTH_REQUIRED = false;

// Helper function to ensure the user is authenticated (anonymously) if needed
export const ensureAuthenticated = async (): Promise<User | null> => {
  // If authentication is not required, return null
  if (!AUTH_REQUIRED || !ONLINE_MODE_ENABLED) {
    return null;
  }

  return new Promise((resolve, reject) => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        if (user) {
          resolve(user);
        } else {
          // Anonymously sign in if no user exists
          signInAnonymously(auth)
            .then((userCredential) => resolve(userCredential.user))
            .catch((error) => {
              console.error("Authentication error:", error);
              reject(error);
            });
        }
      });
    } catch (error) {
      console.error("Authentication setup error:", error);
      reject(error);
    }
  });
};

// Helper function to check if we're in online mode
export const isOnlineMode = (): boolean => {
  return ONLINE_MODE_ENABLED;
};

export { db, auth };
