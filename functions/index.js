/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onCall, HttpsError} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// Mock data generator helper
const generateMockWorld = (prompt) => {
  const worldId = admin.firestore().collection("worlds").doc().id;
  return {
    id: worldId,
    name: "Neon Nexus" + (prompt ? " - Custom" : ""),
    concept: prompt,
    genre: "Sci-Fi / Cyberpunk",
    tone: "High-tech, Low-life",
    description: "A sprawling megalopolis where the line between organic " +
      "and synthetic is blurred. Corporations wield more power than " +
      "governments, and data is the most valuable currency.",
    lore: {
      history: [
        {
          year: "2088",
          event: "The Great Blackout",
          description: "Global power failure leading to the rise of " +
            "corporate city-states.",
        },
        {
          year: "2095",
          event: "First Neural Interface",
          description: "Direct brain-computer interfaces became consumer " +
            "products.",
        },
        {
          year: "2102",
          event: "The AI Accord",
          description: "Treaty limiting AI sentience, widely ignored in " +
            "the underground.",
        },
      ],
      factions: [
        {
          name: "SynthLife",
          description: "Pro-android rights group, often militant.",
        },
        {
          name: "The Board",
          description: "Coalition of CEO's ruling the upper city.",
        },
        {
          name: "Data Rats",
          description: "Info-brokers living in the old subway tunnels.",
        },
      ],
    },
    characters: [
      {
        id: "char-1",
        name: "Jax 'Glitch' Vega",
        role: "Protagonist / Hacker",
        archetype: "The Reluctant Hero",
        description: "A former corporate sysadmin turned shadowrunner after " +
          "being framed for data theft. Has a customized cyber-arm.",
        imagePrompt: "Cyberpunk male hacker, neon dreadlocks, cybernetic " +
          "arm, gritty alleyway background, digital overlays, cinematic " +
          "lighting",
      },
      {
        id: "char-2",
        name: "Director Aethelgard",
        role: "Antagonist / CEO",
        archetype: "The Corrupt Executive",
        description: "Ruthless head of OmniCorp. Believes order is worth any " +
          "price. Rarely seen in person, communicates via hologram.",
        imagePrompt: "Futuristic female CEO, sharp suit, cold expression, " +
          "high-rise office window overlooking neon city, holographic displays",
      },
    ],
    locations: [
      {
        id: "loc-1",
        name: "Sector 7 Slums",
        type: "Residential (Low Income)",
        description: "Dense, vertical housing blocks connected by rusted " +
          "walkways. Always raining.",
        imagePrompt: "Cyberpunk slums, rain-slicked streets, neon signs in " +
          "foreign languages, steam rising from vents, crowded, " +
          "dark atmosphere",
      },
      {
        id: "loc-2",
        name: "The Spire",
        type: "Corporate HQ",
        description: "A kilometer-high tower of glass and steel, piercing " +
          "the smog layer.",
        imagePrompt: "Futuristic skyscraper, clean lines, glowing blue " +
          "lights, above the clouds, pristine, imposing",
      },
    ],
    plotPoints: [
      {
        title: "The Job",
        description: "Jax is hired to steal a prototype chip from OmniCorp.",
      },
      {
        title: "The Betrayal",
        description: "The chip turns out to be a sentient AI seed, and the " +
          "employer tries to silence Jax.",
      },
      {
        title: "The Uprising",
        description: "Jax must unite the Data Rats and SynthLife to expose " +
          "OmniCorp's plan.",
      },
    ],
    assets: [], // Placeholder for generated images
  };
};

// Cloud Function: aiOrchestrator
exports.aiOrchestrator = onCall({cors: true}, async (request) => {
  if (!request.auth) {
    throw new HttpsError(
        "unauthenticated",
        "The function must be called while authenticated.",
    );
  }

  const {prompt} = request.data;

  if (
    !prompt ||
    typeof prompt !== "string" ||
    prompt.trim().length < 10 ||
    prompt.length > 2000
  ) {
    throw new logger.https.HttpsError(
      "invalid-argument",
      'Prompt must be a string between 10 and 2000 characters.'
    );
  }

  logger.info("Generating world for prompt:", prompt);

  // In a real scenario, we would call Google Vertex AI or Gemini here.
  // For now, we simulate the generation process.

  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const worldData = generateMockWorld(prompt);

  // Save to Firestore
  try {
    await db.collection("worlds").doc(worldData.id).set(worldData);
    logger.info("World created successfully:", worldData.id);
  } catch (error) {
    logger.error("Error writing to Firestore:", error);
    throw new HttpsError(
        "internal",
        "Failed to save world data.",
    );
  }

  return {
    projectId: worldData.id,
    data: worldData,
  };
});
