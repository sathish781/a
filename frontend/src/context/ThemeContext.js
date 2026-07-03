import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { darkTheme, lightTheme } from '../utils/theme';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState('dark');

  useEffect(() => {
    loadTheme();
  }, []);

  async function loadTheme() {
    const savedTheme = await AsyncStorage.getItem('themeMode');

    if (savedTheme) {
      setThemeMode(savedTheme);
    }
  }

  async function toggleTheme() {
    const nextTheme = themeMode === 'dark' ? 'light' : 'dark';

    setThemeMode(nextTheme);
    await AsyncStorage.setItem('themeMode', nextTheme);
  }

  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeContext);
}