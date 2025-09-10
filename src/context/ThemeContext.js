import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const common = {
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  typography: {
    fontFamily: 'System', // A generic system font
    sizes: {
      h1: 32,
      h2: 24,
      h3: 20,
      body: 16,
      caption: 12,
    },
    weights: {
      regular: '400',
      medium: '500',
      bold: '700',
    },
  },
  radii: {
    s: 4,
    m: 8,
    l: 16,
  },
  elevation: {
    low: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
  },
};

export const lightTheme = {
  ...common,
  colors: {
    background: '#F0F2F5',
    surface: '#FFFFFF',
    primary: '#007AFF',
    secondary: '#FF9500',
    text: '#1C1C1E',
    textSecondary: '#6E6E73',
    border: '#D1D1D6',
    card: '#FFFFFF',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    shadow: '#000000',
  },
};

export const darkTheme = {
  ...common,
  colors: {
    background: '#000000',
    surface: '#1C1C1E',
    primary: '#0A84FF',
    secondary: '#FF9F0A',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#38383A',
    card: '#1C1C1E',
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    shadow: '#000000',
  },
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(lightTheme);

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    setCurrentTheme(isDarkMode ? darkTheme : lightTheme);
  }, [isDarkMode]);

  const theme = isDarkMode ? darkTheme : lightTheme;

  const loadThemePreference = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem('theme');
      if (storedTheme !== null) {
        setIsDarkMode(storedTheme === 'dark');
      }
    } catch (error) {
      console.log('Error loading theme preference:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const value = {
    isDarkMode,
    theme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};