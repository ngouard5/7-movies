
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

// Helper function to ensure the user is authenticated (anonymously)
export const ensureAuthenticated = async (): Promise<User> => {
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

export { db, auth };
