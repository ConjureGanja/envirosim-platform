import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { VertexAI } from "@google-cloud/vertexai";

// Initialize Firebase Admin SDK
initializeApp();

// To use this function, you need to set the following Firebase config variables:
// firebase functions:config:set gcp.project="YOUR_GCP_PROJECT_ID"
// firebase functions:config:set gcp.location="YOUR_GCP_LOCATION"
// firebase functions:config:set gemini.model="gemini-1.0-pro" // or another model
const project = functions.config().gcp.project;
const location = functions.config().gcp.location;
const model = functions.config().gemini.model || "gemini-2.5-flash-001";

if (!project || !location) {
    functions.logger.error("GCP project or location not set in Firebase functions config.");
    throw new Error("GCP project or location not set in Firebase functions config.");
}

// Initialize Vertex AI
const vertexAI = new VertexAI({ project, location });
const generativeModel = vertexAI.getGenerativeModel({ model });

interface RequestData {
    prompt: string;
}

interface ResponseData {
    projectId: string;
    message: string;
}

/**
 * The main orchestrator function that generates a world based on a user prompt.
 *
 * This function is triggered by an HTTPS call from the client. It performs the following steps:
 * 1. Validates the user is authenticated and a prompt is provided.
 * 2. Calls the Gemini model to generate a "world bible" based on the prompt.
 * 3. Saves the world bible to a new project in Firestore.
 * 4. Calls the Gemini model again to generate a sample character for the new world.
 * 5. Saves the character as an asset within the project.
 * 6. Returns the ID of the newly created project.
 */
export const aiOrchestrator = functions.https.onCall(async (data: RequestData, context): Promise<ResponseData> => {
    const { prompt } = data;
    const userId = context.auth?.uid;

    functions.logger.info(`AI Orchestrator started for user: ${userId}`, { prompt });

    // 1. Validate the request
    if (!userId) {
        functions.logger.warn("Unauthenticated user attempt to create a world.");
        throw new functions.https.HttpsError(
            "unauthenticated",
            "You must be logged in to create a world.",
        );
    }
    if (!prompt) {
        functions.logger.warn(`User ${userId} called function without a prompt.`);
        throw new functions.https.HttpsError(
            "invalid-argument",
            "A prompt is required to generate a world.",
        );
    }

    try {
        // --- Step 2: Generate the World Bible ---
        functions.logger.info(`Generating world bible for user: ${userId}`);
        const worldBiblePrompt = `Generate a foundational "world bible" for a new fantasy world based on this core concept: "${prompt}". Establish the core lore, key factions, and overall tone in 500 words.`;

        const worldBibleResult = await generativeModel.generateContent(worldBiblePrompt);
        const worldBibleText = worldBibleResult.response.candidates?.[0]?.content?.parts[0]?.text;

        if (!worldBibleText) {
            functions.logger.error(`AI failed to generate world bible for user: ${userId}`);
            throw new functions.https.HttpsError("internal", "The AI failed to generate the world bible. Please try again.");
        }
        functions.logger.info(`Successfully generated world bible for user: ${userId}`);

        // --- Step 3: Save the new project to Firestore ---
        const db = getFirestore();
        const projectRef = await db.collection("users").doc(userId).collection("projects").add({
            name: prompt.substring(0, 50),
            description: prompt,
            worldBible: worldBibleText,
            createdAt: new Date(),
        });
        functions.logger.info(`Project ${projectRef.id} created for user: ${userId}`);

        // --- Step 4: Generate a sample character ---
        functions.logger.info(`Generating character for project: ${projectRef.id}`);
        const characterPrompt = `Based on the following world bible, generate one interesting character. Provide their name, a short backstory, and their primary motivation. World Bible: "${worldBibleText}"`;

        const characterResult = await generativeModel.generateContent(characterPrompt);
        const characterText = characterResult.response.candidates?.[0]?.content?.parts[0]?.text;

        if (characterText) {
            await projectRef.collection("assets").add({
                name: "Generated Character",
                type: "character",
                content: characterText,
                createdAt: new Date(),
            });
            functions.logger.info(`Successfully generated character for project: ${projectRef.id}`);
        } else {
            functions.logger.warn(`Character generation failed for project ${projectRef.id}`);
        }

        // --- Step 5: Return a success response ---
        functions.logger.info(`AI Orchestrator completed successfully for user: ${userId}, project: ${projectRef.id}`);
        return { projectId: projectRef.id, message: "World created successfully!" };

    } catch (error) {
        functions.logger.error("AI Orchestration failed:", error, { userId });
        throw new functions.https.HttpsError("internal", "An unexpected error occurred during world generation.");
    }
});