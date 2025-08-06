# EnviroSim Platform

EnviroSim is an AI-powered world generation platform designed for game developers and storytellers. It leverages a suite of specialized generative models to create coherent and detailed simulated worlds, including lore, characters, locations, and visual assets.

## Tech Stack

- **Frontend**: React (Vite), TypeScript
- **Backend**: Firebase Cloud Functions, Node.js, TypeScript
- **Database**: Firestore
- **Asset Storage**: Firebase Cloud Storage
- **Authentication**: Firebase Authentication
- **AI Models**: Google AI Platform (Vertex AI, Gemini, Imagen)

## Project Structure

This repository contains two main projects:

- `/client`: The React frontend application.
- `/functions`: The serverless backend logic (Firebase Cloud Functions).

## Getting Started

### Prerequisites

- Node.js (v22 or later)
- Yarn
- Firebase CLI

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/envirosim-platform.git
    cd envirosim-platform
    ```

2. **Install dependencies for the client:**

    ```bash
    cd client
    yarn install
    ```

3. **Install dependencies for the functions:**

    ```bash
    cd ../functions
    yarn install
    ```

4. **Set up Firebase:**
    - Create a Firebase project.
    - Add your Firebase project configuration to `client/src/firebase.ts`.
    - Set up Application Default Credentials for the functions to work locally. You can do this by running `gcloud auth application-default login`.

### Development

- **Run the frontend development server:**

    ```bash
    cd client
    yarn dev
    ```

- **Run the backend functions emulator:**

    ```bash
    cd functions
    yarn serve
    ```

### Building and Deploying

- **Build the frontend:**

    ```bash
    cd client
    yarn build
    ```

- **Deploy Firebase functions:**

    ```bash
    cd functions
    yarn deploy
    ```

## Available Scripts

### Client (`/client`)

- `yarn dev`: Starts the Vite development server.
- `yarn build`: Builds the application for production.
- `yarn lint`: Lints the codebase.
- `yarn preview`: Previews the production build.

### Functions (`/functions`)

- `yarn lint`: Lints the codebase.
- `yarn serve`: Starts the Firebase functions emulator.
- `yarn shell`: Runs a shell with the local functions.
- `yarn deploy`: Deploys the functions to Firebase.
- `yarn logs`: Shows logs for the deployed functions.
