# EnviroSim Platform

EnviroSim is an AI-powered world generation platform designed for game developers and storytellers. It leverages a suite of specialized generative models to create coherent and detailed simulated worlds, including lore, characters, locations, and visual assets.

## Tech Stack

- **Framework**: React (Vite)
- **Backend**: Firebase Cloud Functions
- **Database**: Firestore
- **Asset Storage**: Firebase Cloud Storage
- **Authentication**: Firebase Authentication
- **AI Models**: Google AI Platform (Gemini, Imagen)

## Project Structure

This is a monorepo managed with npm workspaces.

- `/client`: Contains the React frontend application.
- `/functions`: Contains the serverless backend logic (Firebase Cloud Functions).

## Getting Started

1.  Clone the repository: `git clone https://github.com/your-username/envirosim-platform.git`
2.  Install root dependencies: `npm install`
3.  Navigate to the client directory and install dependencies: `cd client && npm install`
4.  Navigate to the functions directory and install dependencies: `cd ../functions && npm install`
5.  Set up your Firebase project and add your configuration to `.env` files.
