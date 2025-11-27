// client/src/App.tsx

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { signInAnonymously } from 'firebase/auth';
import { auth } from './firebase';
import { Layout } from './pages/Layout';
import { Dashboard } from './pages/Dashboard';
import { CreateWorld } from './pages/CreateWorld';
import { WorldBible } from './pages/WorldBible';

function App() {
  useEffect(() => {
    // Authenticate anonymously so backend checks pass
    signInAnonymously(auth).catch((error) => {
        console.error("Anonymous auth failed", error);
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="create" element={<CreateWorld />} />
          <Route path="world/:id/*" element={<WorldBible />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
