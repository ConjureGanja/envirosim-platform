// client/src/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

// --- PASTE YOUR CONFIG OBJECT FROM THE FIREBASE WEBSITE HERE ---
const firebaseConfig = {
  apiKey: "AIzaSyDaJcSKpqMr0-h1dpWzIZFToLSNgfD2RyI",
  authDomain: "envirosim-dev.firebaseapp.com",
  projectId: "envirosim-dev",
  storageBucket: "envirosim-dev.firebasestorage.app",
  messagingSenderId: "602323428897",
  appId: "1:602323428897:web:77a3561f023ff35fc4e560",
  measurementId: "G-L9PHQLZ2QJ"
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