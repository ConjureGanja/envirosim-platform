import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { VertexAI } from "@google-cloud/vertexai";

// Initialize Firebase so it can connect to our project's services
initializeApp();

// Initialize Vertex AI with your project ID and location
const vertexAI = new VertexAI({ project: "envirosim-dev", location: "us-central1" });

// Specify the NEW, correct model to use
const generativeModel = vertexAI.getGenerativeModel({
    model: "gemini-2.5-flash", // <-- UPDATED MODEL NAME
});

// This is our main cloud function that the frontend will call
export const aiOrchestrator = functions.https.onCall(async (data, context) => {
    const prompt = data.prompt;
    const userId = context.auth?.uid;

    // 1. Validate the request
    if (!userId) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "You must be logged in to create a world.",
        );
    }
    if (!prompt) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "A prompt is required.",
        );
    }

    try {
        // --- Step 2: Generate the World Bible using the user's prompt ---
        const worldBiblePrompt = `Generate a foundational "world bible" for a new fantasy world based on this core concept: "${prompt}". Establish the core lore, key factions, and overall tone in 500 words.`;

        // This is the actual API call to the Gemini model
        const worldBibleResult = await generativeModel.generateContent(worldBiblePrompt);
        const worldBibleText = worldBibleResult.response.candidates?.[0].content.parts[0].text || "";

        if (!worldBibleText) {
            throw new functions.https.HttpsError("internal", "AI failed to generate world bible.");
        }

        // --- Step 3: Save the result to our Firestore database ---
        const db = getFirestore();
        const projectRef = await db.collection("users").doc(userId).collection("projects").add({
            name: prompt.substring(0, 40), // Use part of the prompt as the name
            description: prompt,
            worldBible: worldBibleText,
            createdAt: new Date(),
        });

        // --- Step 4: Chain the prompt to generate a character (example of a second step) ---
        const characterPrompt = `Based on the following world bible, generate one interesting character. Provide their name, a short backstory, and their primary motivation. World Bible: "${worldBibleText}"`;

        const characterResult = await generativeModel.generateContent(characterPrompt);
        const characterText = characterResult.response.candidates?.[0].content.parts[0].text || "";

        // Save the character as a separate "asset" linked to the main project
        await projectRef.collection("assets").add({
            name: "Generated Character",
            type: "character",
            content: characterText,
            createdAt: new Date(),
        });

        // 5. Return a success message to the frontend
        return { projectId: projectRef.id, message: "World created successfully!" };

    } catch (error) {
        console.error("AI Orchestration failed:", error);
        throw new functions.https.HttpsError("internal", "An error occurred during world generation.");
    }
});