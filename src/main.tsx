import {StrictMode, Suspense, lazy} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import App from './App.tsx';
import Login from './pages/Login.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import BottomNav from './components/BottomNav.tsx';
import { ThemeProvider } from './lib/theme.tsx';
import './index.css';
import { registerSW } from './utils/pwa';

const WorkoutLog = lazy(() => import('./pages/WorkoutLog.tsx'));
const Profile = lazy(() => import('./pages/Profile.tsx'));
const SenseiChat = lazy(() => import('./pages/SenseiChat.tsx'));
const Programs = lazy(() => import('./pages/Programs.tsx'));
const Battles = lazy(() => import('./pages/Battles.tsx'));
const Leaderboard = lazy(() => import('./pages/Leaderboard.tsx'));
const NutritionLog = lazy(() => import('./pages/NutritionLog.tsx'));
const BountiesPage = lazy(() => import('./pages/BountiesPage.tsx'));
const DietPrograms = lazy(() => import('./pages/DietPrograms.tsx'));
const SettingsPage = lazy(() => import('./pages/Settings.tsx'));

registerSW();

window.onerror = (msg, source, line, col, error) => {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#0A0A0F;color:#E31E24;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:monospace;padding:20px';
  el.innerHTML = `<div style="font-size:24px;margin-bottom:12px">💥 GLOBAL ERROR</div><pre style="color:#fff;font-size:12;max-width:500;white-space:pre-wrap;text-align:center">${msg}</pre><pre style="color:#888;font-size:10;margin-top:8">${source}:${line}:${col}</pre>`;
  if (error?.stack) {
    el.innerHTML += `<pre style="color:#aaa;font-size:10;margin-top:8;max-width:600;white-space:pre-wrap">${error.stack}</pre>`;
  }
  document.body.prepend(el);
  return true;
};

window.addEventListener('unhandledrejection', (e) => {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#0A0A0F;color:#FF6B35;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:monospace;padding:20px';
  el.innerHTML = `<div style="font-size:24px;margin-bottom:12px">⏳ UNHANDLED PROMISE REJECTION</div><pre style="color:#fff;font-size:12;max-width:500;white-space:pre-wrap;text-align:center">${e.reason?.message || e.reason}</pre>`;
  if (e.reason?.stack) {
    el.innerHTML += `<pre style="color:#aaa;font-size:10;margin-top:8;max-width:600;white-space:pre-wrap">${e.reason.stack}</pre>`;
  }
  document.body.prepend(el);
});

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
          <Route path="/workout" element={<ProtectedRoute><Suspense fallback={null}><WorkoutLog /></Suspense></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Suspense fallback={null}><Profile /></Suspense></ProtectedRoute>} />
          <Route path="/sensei" element={<ProtectedRoute><Suspense fallback={null}><SenseiChat /></Suspense></ProtectedRoute>} />
          <Route path="/programs" element={<ProtectedRoute><Suspense fallback={null}><Programs /></Suspense></ProtectedRoute>} />
          <Route path="/battles" element={<ProtectedRoute><Suspense fallback={null}><Battles /></Suspense></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Suspense fallback={null}><Leaderboard /></Suspense></ProtectedRoute>} />
        <Route path="/nutrition" element={<ProtectedRoute><Suspense fallback={null}><NutritionLog /></Suspense></ProtectedRoute>} />
        <Route path="/bounties" element={<ProtectedRoute><Suspense fallback={null}><BountiesPage /></Suspense></ProtectedRoute>} />
        <Route path="/diet" element={<ProtectedRoute><Suspense fallback={null}><DietPrograms /></Suspense></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Suspense fallback={null}><SettingsPage /></Suspense></ProtectedRoute>} />
        <Route path="/*" element={<App />} />
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
