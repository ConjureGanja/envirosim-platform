// client/src/pages/Layout.tsx

import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-background text-white font-sans antialiased selection:bg-primary/30">
      <Navbar />
      <Outlet />
    </div>
  );
};
