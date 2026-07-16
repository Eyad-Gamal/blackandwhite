import { Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Storefront from './pages/Storefront';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Storefront />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <Analytics />
    </>
  );
}

export default App;
