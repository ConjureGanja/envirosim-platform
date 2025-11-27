// client/src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './pages/Layout';
import { Dashboard } from './pages/Dashboard';
import { CreateWorld } from './pages/CreateWorld';
import { WorldBible } from './pages/WorldBible';

function App() {
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
