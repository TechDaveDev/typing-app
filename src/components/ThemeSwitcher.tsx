'use client';

import { useState, useEffect } from 'react';

import { Sun, Moon } from 'lucide-react';

export const ThemeSwitcher = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialTheme = (storedTheme as 'light' | 'dark') || (systemPrefersDark ? 'dark' : 'light');

    setThemeState(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    setIsMounted(true);
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!isMounted) {
    return (
      <div className="w-[84px] h-[38px] bg-slate-200 dark:bg-slate-800 p-1 rounded-full animate-pulse" />
    );
  }

  return (
    <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-full transition-colors duration-300 shadow-inner border border-transparent dark:border-slate-700/50">
      <button
        onClick={() => handleThemeChange('light')}
        aria-label="Activar modo claro"
        className={`p-2 rounded-full transition-all duration-300 ${theme === 'light' ? 'bg-white text-yellow-500 shadow-sm scale-110' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'}`}
      >
        <Sun size={18} className={theme === 'light' ? 'fill-yellow-100' : ''} />
      </button>

      <button
        onClick={() => handleThemeChange('dark')}
        aria-label="Activar modo oscuro"
        className={`p-2 rounded-full transition-all duration-300 ${theme === 'dark' ? 'bg-slate-700 text-blue-400 shadow-sm scale-110' : 'text-slate-500 hover:text-slate-700'}`}
      >
        <Moon size={18} className={theme === 'dark' ? 'fill-blue-900/20' : ''} />
      </button>
    </div>
  );
};