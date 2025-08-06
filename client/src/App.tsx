// client/src/App.tsx

import React from 'react';
import { Generator } from './components/Generator'; // Import our new component

function App() {
  return (
    <div>
      {/* This will display our Generator component on the page */}
      <Generator />
    </div>
  );
}

export default App;