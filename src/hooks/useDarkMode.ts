import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Prevent hydration issues by checking if we're in the browser
    if (typeof window === 'undefined') {
      return false; // Default to light mode during SSR
    }

    // Check localStorage first, then system preference
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Default to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Hydration effect to set initial state on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        const savedValue = JSON.parse(saved);
        setIsDarkMode(savedValue);
      } else {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(systemPrefersDark);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Save to localStorage
      localStorage.setItem('darkMode', JSON.stringify(isDarkMode));

      // Apply or remove dark class to html element
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

  // Listen to system preference changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = (e: MediaQueryListEvent) => {
        // Only update if user hasn't manually set a preference
        const saved = localStorage.getItem('darkMode');
        if (saved === null) {
          setIsDarkMode(e.matches);
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  return { isDarkMode, toggleDarkMode };
};