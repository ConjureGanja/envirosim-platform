// client/src/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

// --- PASTE YOUR CONFIG OBJECT FROM THE FIREBASE WEBSITE HERE ---
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// ----------------------------------------------------------------

// Initialize Firebase with your project's unique keys
const app = initializeApp(firebaseConfig);

// Export the different Firebase services so we can use them elsewhere in our app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Create a specific reference to our backend function.
// This allows us to call it easily from our frontend code.
export const callAiOrchestrator = httpsCallable(functions, 'aiOrchestrator');
