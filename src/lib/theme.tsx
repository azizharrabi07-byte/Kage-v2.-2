import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface ThemeContextType {
  isLight: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ isLight: false, toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isLight, setIsLight] = useState(() => {
    try { return localStorage.getItem('kage-theme') === 'light'; } catch { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem('kage-theme', isLight ? 'light' : 'dark'); } catch {}
    document.documentElement.classList.toggle('light', isLight);
  }, [isLight]);

  return (
    <ThemeContext.Provider value={{ isLight, toggle: () => setIsLight((p) => !p) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
