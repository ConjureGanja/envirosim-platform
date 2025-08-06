// client/src/components/Generator.tsx

import React, { useState } from 'react';
// We import the reference to our backend function that we created in firebase.ts
import { callAiOrchestrator } from '../firebase';

export const Generator = () => {
  // 'useState' is how React remembers things. We create "state variables" to hold:
  const [prompt, setPrompt] = useState(''); // The text the user types in the box
  const [loading, setLoading] = useState(false); // Whether we are currently waiting for the AI
  const [result, setResult] = useState<string | null>(null); // A success message from the backend
  const [error, setError] = useState<string | null>(null); // An error message if something goes wrong

  // This function runs when the user clicks the "Generate" button
  const handleGenerate = async () => {
    // Basic check to make sure the user typed something
    if (!prompt) {
      setError('Please enter a world concept.');
      return;
    }
    // --- Start the loading process ---
    setLoading(true);
    setError(null); // Clear any old errors
    setResult(null); // Clear any old results

    try {
      // This is the key part: we call our backend function and pass the prompt
      const response: any = await callAiOrchestrator({ prompt: prompt });
      // If it works, we store the success message in our 'result' state variable
      setResult(`Success! New project created with ID: ${response.data.projectId}`);
    } catch (err: any) {
      // If it fails, we store the error message in our 'error' state variable
      setError(err.message);
    } finally {
      // --- End the loading process ---
      // This 'finally' block runs whether it succeeded or failed
      setLoading(false);
    }
  };

  // This is the HTML structure of our component
  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Create Your World</h2>
      <p style={{ textAlign: 'center', color: '#666' }}>
        Enter a high-level concept and let the AI build the foundational lore for your world.
      </p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., A cyberpunk city ruled by a rogue AI..."
        rows={5}
        style={{ width: '100%', padding: '10px', fontSize: '16px', boxSizing: 'border-box' }}
        disabled={loading} // Disable the text area while loading
      />
      <button
        onClick={handleGenerate}
        disabled={loading} // Disable the button while loading
        style={{ width: '100%', padding: '12px', fontSize: '18px', cursor: 'pointer', backgroundColor: loading ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '5px', marginTop: '10px' }}
      >
        {loading ? 'Generating...' : 'Generate World'}
      </button>

      {/* Conditionally show messages based on our state variables */}
      {result && <p style={{ color: 'green', marginTop: '15px' }}>{result}</p>}
      {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
    </div>
  );
};