
import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import type { Language, Theme, AppContextType } from '../types';
import { translations } from '../constants';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as Theme || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = language;
    html.dir = 'ltr';
    html.style.fontFamily = '';
    html.classList.add('ltr');
    html.classList.remove('rtl');
  }, [language]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };
  
  const t = useCallback((key: string): string => {
    return translations[key]?.[language] || key;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    theme,
    setTheme,
    translations,
    t
  }), [language, theme, t]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
