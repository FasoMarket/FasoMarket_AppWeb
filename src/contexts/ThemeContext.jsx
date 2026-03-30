import { createContext, useContext, useEffect, useState } from 'react';
import { settingsService } from '../services/settingsService';
import { authService }     from '../services/authService';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    mode: localStorage.getItem('fm_theme_mode') || 'light',
    primaryColor: localStorage.getItem('fm_primary_color') || '#16a34a',
  });

  // Appliquer le thème sur le DOM
  const applyTheme = ({ mode, primaryColor }) => {
    const root = document.documentElement;

    // Mode clair/sombre
    if (mode === 'dark') {
      root.classList.add('dark');
    } else if (mode === 'light') {
      root.classList.remove('dark');
    } else if (mode === 'system') {
      // System : détecter la préférence OS
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      prefersDark ? root.classList.add('dark') : root.classList.remove('dark');
    }

    // Couleur primaire via CSS variable
    if (primaryColor) {
      root.style.setProperty('--color-primary', primaryColor);
      // Générer les variantes (light/dark) de la couleur
      root.style.setProperty('--color-primary-50',  primaryColor + '15');
      root.style.setProperty('--color-primary-100', primaryColor + '25');
      root.style.setProperty('--color-primary-500', primaryColor);
      root.style.setProperty('--color-primary-600', primaryColor + 'dd');
    }
  };

  // Charger le thème depuis la BDD au démarrage (admin seulement)
  useEffect(() => {
    if (authService.getRole() === 'admin') {
      settingsService.getAdminSettings()
        .then(res => {
          const t = res.data.settings?.theme;
          if (t) { 
            setTheme(t); 
            applyTheme(t);
            localStorage.setItem('fm_theme_mode', t.mode);
            localStorage.setItem('fm_primary_color', t.primaryColor);
          }
        })
        .catch(() => {});
    }
    // Appliquer le thème en cache immédiatement
    applyTheme(theme);
  }, []);

  const updateTheme = async (newTheme) => {
    applyTheme(newTheme);
    setTheme(newTheme);
    localStorage.setItem('fm_theme_mode',      newTheme.mode);
    localStorage.setItem('fm_primary_color',   newTheme.primaryColor);
    // Sauvegarder en BDD si admin
    if (authService.getRole() === 'admin') {
      try {
        await settingsService.updateTheme(newTheme);
      } catch (err) {
        if (import.meta.env.DEV) console.error('Erreur sauvegarde thème:', err);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
