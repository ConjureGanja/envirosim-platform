// client/src/pages/CreateWorld.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { callAiOrchestrator } from '../firebase';
import { Sparkles, Loader2 } from 'lucide-react';

export const CreateWorld = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await callAiOrchestrator({ prompt });
      const worldId = response.data.projectId;
      navigate(`/world/${worldId}`);
    } catch (error) {
      console.error(error);
      let errorMessage = 'Failed to generate world.';
      // Check for network error
      if (error && typeof error === 'object') {
        // Firebase/network error
        if ('code' in error && error.code === 'unavailable') {
          errorMessage = 'Service is currently unavailable. Please try again later.';
        } else if ('message' in error && typeof error.message === 'string') {
          if (error.message.toLowerCase().includes('network')) {
            errorMessage = 'Network error. Please check your internet connection and try again.';
          } else if (error.message.toLowerCase().includes('validation')) {
            errorMessage = 'Validation error. Please check your input and try again.';
          } else {
            errorMessage = error.message;
          }
        }
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-surface p-8 rounded-2xl border border-gray-700 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Architect Your Universe</h1>
          <p className="text-gray-400">Describe your world's core concept, genre, and tone. Our AI will build the foundation.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Core Concept Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A solarpunk utopia built on the ruins of a submerged New York City, where bio-engineered coral skyscrapers harvest energy from the tides..."
              className="w-full bg-background border border-gray-600 rounded-xl p-4 text-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none h-40"
              disabled={loading}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!prompt || loading}
            className="w-full bg-primary hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Constructing Reality...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate World Bible
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
