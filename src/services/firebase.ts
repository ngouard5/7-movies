
import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { toast } from 'sonner';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCq_EPiVKJJDPGzBqB92YcxvYkbA0Nx7FY",
  authDomain: "emoji-movie-guesser.firebaseapp.com",
  projectId: "emoji-movie-guesser",
  storageBucket: "emoji-movie-guesser.appspot.com",
  messagingSenderId: "323541835507",
  appId: "1:323541835507:web:e41ece69ece8abc66e3e80"
};

// Initialize Firebase app
let app;
let db;
let auth;
let firestoreInitialized = false;

// Track if we've already shown the Firebase error message
let hasShownFirebaseError = false;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  firestoreInitialized = true;
  
  // Enable offline persistence with more robust settings
  enableIndexedDbPersistence(db, {
    synchronizeTabs: true
  }).then(() => {
    console.log("Firestore offline persistence enabled successfully");
  }).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.warn("Multiple tabs open, persistence only enabled in one tab");
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all features required for persistence
      console.warn("Firestore persistence not supported by this browser");
    } else {
      console.error("Firestore persistence error:", err);
    }
    // Still allow the app to continue without persistence
  });

  // Set up network status change listener
  window.addEventListener('online', () => {
    console.log("App is online");
    if (!hasShownFirebaseError) {
      toast.success("You're back online!", {
        description: "Data will be synchronized with the server"
      });
    }
  });
  
  window.addEventListener('offline', () => {
    console.log("App is offline");
    toast.warning("You're offline", {
      description: "The app will continue to work but changes won't be saved to the server until you reconnect"
    });
  });
} catch (error) {
  console.error("Firebase initialization error:", error);
  if (!hasShownFirebaseError) {
    toast.error("Connection issue", {
      description: "Unable to connect to the server. Your data will be saved locally."
    });
    hasShownFirebaseError = true;
  }
}

// Set to true to attempt data storage in Firestore when possible
const ONLINE_MODE_ENABLED = true;
// Set to false to prevent authentication attempts
const AUTH_REQUIRED = false;

// Helper function to check if Firestore is working properly
export const isFirestoreWorking = (): boolean => {
  return firestoreInitialized;
};

// Helper function to ensure the user is authenticated (anonymously) if needed
export const ensureAuthenticated = async (): Promise<User | null> => {
  // If authentication is not required, return null
  if (!AUTH_REQUIRED) {
    return null;
  }

  // If Firebase initialization failed, return null
  if (!firestoreInitialized) {
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
  // First check if Firebase is properly initialized
  if (!firestoreInitialized) {
    return false;
  }
  
  // Then check if online mode is enabled in settings
  if (!ONLINE_MODE_ENABLED) {
    return false;
  }
  
  // Finally check if the device actually has internet connection
  return navigator.onLine;
};

export { db, auth };
