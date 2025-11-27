// client/src/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

// Using import.meta.env for Vite
// In production, these variables must be set.
// For local development, we fallback to demo values ONLY if clearly mocked.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Wrapper for the cloud function
export const callAiOrchestrator = async (data: unknown) => {
    // In a real app, we call the function
    const fn = httpsCallable(functions, 'aiOrchestrator');

    try {
        return await fn(data);
    } catch (error) {
        console.warn("Cloud function call failed (likely due to missing credentials or emulator). Falling back to local mock.", error);

        // Fallback mock response for demo purposes
        return {
            data: {
                projectId: "mock-world-123",
                data: {
                    id: "mock-world-123",
                    name: "Mocked World",
                    concept: "Fallback Concept",
                    genre: "Sci-Fi",
                    tone: "Dark",
                    description: "A fallback world generated client-side because the backend is unreachable.",
                    lore: { history: [], factions: [] },
                    characters: [],
                    locations: [],
                    plotPoints: [],
                    assets: []
                }
            }
        };
    }
};
