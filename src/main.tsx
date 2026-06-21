import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { ThemeProvider } from './lib/theme.tsx';
import AppRouter from './AppRouter.tsx';
import './index.css';

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
        <AppRouter />
      </BrowserRouter>
    </ErrorBoundary>
  </ThemeProvider>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterApp />
  </StrictMode>,
);
