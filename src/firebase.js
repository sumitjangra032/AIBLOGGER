// Firebase configuration and initialization
// Import Firebase SDK functions for app initialization
import { initializeApp } from "firebase/app";
// Import Firestore database functions
import { getFirestore } from "firebase/firestore";
// Import Firebase Authentication functions
import { getAuth } from "firebase/auth";
// Import Firebase Storage functions
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase app with configuration
const app = initializeApp(firebaseConfig);
// Initialize Firestore database instance
const db = getFirestore(app);
// Initialize Firebase Authentication instance
const auth = getAuth(app);
// Initialize Firebase Storage instance
const storage = getStorage(app);

// Export Firebase services for use throughout the application
export { db, auth, storage };
