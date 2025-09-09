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

export const lightTheme = {
  background: '#ffffff',
  surface: '#f5f5f5',
  primary: '#2196F3',
  secondary: '#FF9800',
  text: '#000000',
  textSecondary: '#666666',
  border: '#e0e0e0',
  card: '#ffffff',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  shadow: '#000000'
};

export const darkTheme = {
  background: '#121212',
  surface: '#1e1e1e',
  primary: '#BB86FC',
  secondary: '#03DAC6',
  text: '#ffffff',
  textSecondary: '#aaaaaa',
  border: '#333333',
  card: '#1e1e1e',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#CF6679',
  shadow: '#000000'
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
    theme: currentTheme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};