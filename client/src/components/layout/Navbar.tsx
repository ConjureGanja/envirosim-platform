// client/src/components/layout/Navbar.tsx

import { Link } from 'react-router-dom';
import { Globe, PlusCircle } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="bg-surface border-b border-gray-700 h-16 flex items-center px-6 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Globe className="text-primary w-6 h-6" />
        <Link to="/" className="text-xl font-bold tracking-tight">EnviroSim</Link>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <Link
          to="/create"
          className="flex items-center gap-2 bg-primary hover:bg-blue-600 transition-colors px-4 py-2 rounded-lg text-sm font-medium"
        >
          <PlusCircle className="w-4 h-4" />
          New World
        </Link>
      </div>
    </nav>
  );
};
