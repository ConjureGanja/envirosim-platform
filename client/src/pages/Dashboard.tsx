// client/src/pages/Dashboard.tsx

import { Link } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';

export const Dashboard = () => {
  // In a real app, this would fetch from Firestore using a hook
  const recentWorlds = [
    { id: '1', name: 'Neon Nexus', genre: 'Cyberpunk', lastEdited: '2 mins ago' },
    { id: '2', name: 'Eldoria', genre: 'Fantasy', lastEdited: '1 hour ago' },
    { id: '3', name: 'Solstice', genre: 'Post-Apocalyptic', lastEdited: 'Yesterday' },
    { id: '4', name: 'Aetherium', genre: 'Steampunk', lastEdited: '3 days ago' },
    { id: '5', name: 'Terra Prime', genre: 'Sci-Fi', lastEdited: '5 days ago' },
    { id: '6', name: 'Mystvale', genre: 'Mystery', lastEdited: '1 week ago' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-gray-400">Continue building your worlds or start a new adventure.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Card */}
        <Link
          to="/create"
          className="group border border-dashed border-gray-600 rounded-xl p-6 flex flex-col items-center justify-center min-h-[200px] hover:border-primary hover:bg-surface/50 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-surface group-hover:bg-primary/20 flex items-center justify-center mb-4 transition-colors">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">Create New World</h3>
          <p className="text-sm text-gray-500 mt-2 text-center">Start from a concept or genre</p>
        </Link>

        {/* Existing Worlds */}
        {recentWorlds.map(world => (
          <Link
            key={world.id}
            to={`/world/${world.id}`}
            className="bg-surface rounded-xl p-6 border border-gray-700 hover:border-primary transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">
                {world.genre}
              </span>
              <Clock className="w-4 h-4 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{world.name}</h3>
            <p className="text-sm text-gray-400 mb-6">Last edited: {world.lastEdited}</p>
            <div className="flex items-center text-sm font-medium text-primary">
              Open Bible <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
