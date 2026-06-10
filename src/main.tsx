import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
