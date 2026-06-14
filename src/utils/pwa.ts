export function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(
        (reg) => console.log('[PWA] SW registered:', reg.scope),
        (err) => console.warn('[PWA] SW registration failed:', err),
      );
    });
  }
}

export function isPwaInstalled(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches;
}
