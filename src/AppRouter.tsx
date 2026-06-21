import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import BottomNav from './components/BottomNav.tsx';

const HomePage = lazy(() => import('./pages/HomePage.tsx'));
const TrainPage = lazy(() => import('./pages/TrainPage.tsx'));
const WorkoutSessionPage = lazy(() => import('./pages/WorkoutSessionPage.tsx'));
const DojoPage = lazy(() => import('./pages/DojoPage.tsx'));
const LegacyPage = lazy(() => import('./pages/LegacyPage.tsx'));
const SenseiPage = lazy(() => import('./pages/SenseiPage.tsx'));
const NutritionPage = lazy(() => import('./pages/NutritionPage.tsx'));
const Login = lazy(() => import('./pages/Login.tsx'));

export default function AppRouter() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Suspense fallback={null}><Login /></Suspense>} />
        <Route path="/" element={<Suspense fallback={null}><HomePage /></Suspense>} />
        <Route path="/train" element={<Suspense fallback={null}><TrainPage /></Suspense>} />
        <Route path="/train/session" element={<Suspense fallback={null}><WorkoutSessionPage /></Suspense>} />
        <Route path="/dojo" element={<Suspense fallback={null}><DojoPage /></Suspense>} />
        <Route path="/legacy" element={<Suspense fallback={null}><LegacyPage /></Suspense>} />
        <Route path="/sensei" element={<Suspense fallback={null}><SenseiPage /></Suspense>} />
        <Route path="/nutrition" element={<Suspense fallback={null}><NutritionPage /></Suspense>} />
        <Route path="/*" element={<Suspense fallback={null}><App /></Suspense>} />
      </Routes>
      <BottomNav />
    </>
  );
}
