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
const WorkoutLog = lazy(() => import('./pages/WorkoutLog.tsx'));
const SenseiChat = lazy(() => import('./pages/SenseiChat.tsx'));
const Programs = lazy(() => import('./pages/Programs.tsx'));
const Battles = lazy(() => import('./pages/Battles.tsx'));
const Leaderboard = lazy(() => import('./pages/Leaderboard.tsx'));
const NutritionLog = lazy(() => import('./pages/NutritionLog.tsx'));
const BountiesPage = lazy(() => import('./pages/BountiesPage.tsx'));
const DietPrograms = lazy(() => import('./pages/DietPrograms.tsx'));
const SoulPage = lazy(() => import('./pages/SoulPage.tsx'));

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
          <Route path="/workout" element={<ProtectedRoute><Suspense fallback={null}><WorkoutLog /></Suspense></ProtectedRoute>} />
          <Route path="/programs" element={<ProtectedRoute><Suspense fallback={null}><Programs /></Suspense></ProtectedRoute>} />
          <Route path="/nutrition" element={<ProtectedRoute><Suspense fallback={null}><NutritionLog /></Suspense></ProtectedRoute>} />
          <Route path="/diet" element={<ProtectedRoute><Suspense fallback={null}><DietPrograms /></Suspense></ProtectedRoute>} />
          <Route path="/sensei" element={<ProtectedRoute><Suspense fallback={null}><SenseiChat /></Suspense></ProtectedRoute>} />
          <Route path="/dojo" element={<ProtectedRoute><Suspense fallback={null}><DojoPage /></Suspense></ProtectedRoute>} />
          <Route path="/soul" element={<ProtectedRoute><Suspense fallback={null}><SoulPage /></Suspense></ProtectedRoute>} />
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
