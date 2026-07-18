import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load pages for better performance
const Storefront = lazy(() => import('./pages/Storefront'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Loading component
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'var(--bg)'
  }}>
    <div style={{
      width: '50px',
      height: '50px',
      border: '4px solid var(--border-subtle)',
      borderTop: '4px solid var(--accent)',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Storefront />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Suspense>
  );
}

export default App;
