import {StrictMode, Suspense, lazy} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import Login from './pages/Login.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import BottomNav from './components/BottomNav.tsx';
import { ThemeProvider } from './lib/theme.tsx';
import './index.css';
import { registerSW } from './utils/pwa';

const HomeDashboard = lazy(() => import('./pages/HomeDashboard.tsx'));
const TrainPage = lazy(() => import('./pages/TrainPage.tsx'));
const DojoPage = lazy(() => import('./pages/DojoPage.tsx'));
const LegacyPage = lazy(() => import('./pages/LegacyPage.tsx'));

registerSW();

const RouterApp = () => (
  <ThemeProvider>
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            style: { background: '#1A1A2E', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'monospace', fontSize: '12px' },
            success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Suspense fallback={null}><HomeDashboard /></Suspense></ProtectedRoute>} />
          <Route path="/train" element={<ProtectedRoute><Suspense fallback={null}><TrainPage /></Suspense></ProtectedRoute>} />
          <Route path="/dojo" element={<ProtectedRoute><Suspense fallback={null}><DojoPage /></Suspense></ProtectedRoute>} />
          <Route path="/legacy" element={<ProtectedRoute><Suspense fallback={null}><LegacyPage /></Suspense></ProtectedRoute>} />
          <Route path="/*" element={<ProtectedRoute><Suspense fallback={null}><HomeDashboard /></Suspense></ProtectedRoute>} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </ErrorBoundary>
  </ThemeProvider>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterApp />
  </StrictMode>,
);
