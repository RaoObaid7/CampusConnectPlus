import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { elevation } from '../utils/designSystem';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Modern Light Theme
export const lightTheme = {
  // Base colors
  background: '#FFFFFF',
  backgroundAlt: '#F7F9FC',
  surface: '#FFFFFF',
  surfaceAlt: '#F7F9FC',
  
  // Brand colors
  primary: '#4361EE',
  primaryLight: '#4895EF',
  primaryDark: '#3A0CA3',
  
  secondary: '#F72585',
  secondaryLight: '#F72585',
  secondaryDark: '#B5179E',
  
  accent: '#4CC9F0',
  accentDark: '#4361EE',
  
  // Text colors
  text: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  textLight: '#FFFFFF',
  
  // UI elements
  border: '#E2E8F0',
  divider: '#E2E8F0',
  
  // Status colors
  success: '#10B981',
  successDark: '#059669',
  warning: '#F59E0B',
  warningDark: '#D97706',
  error: '#EF4444',
  errorDark: '#DC2626',
  info: '#3B82F6',
  infoDark: '#2563EB',
  
  // Shadow system
  shadow: elevation,
  
  // Additional UI colors
  backgroundElevated: '#FFFFFF',
  errorLight: '#FEF2F2',
  successLight: '#F0FDF4',
  warningLight: '#FFFBEB',
  infoLight: '#EFF6FF',
  
  // Neomorphism colors
  neomorphism: {
    background: '#F0F2F5',
    shadow: '#C8CCD4',
    highlight: '#FFFFFF',
  },
  
  // Glass morphism colors
  glass: {
    background: 'rgba(255, 255, 255, 0.25)',
    border: 'rgba(255, 255, 255, 0.18)',
  },
};

// Modern Dark Theme
export const darkTheme = {
  // Base colors
  background: '#0F172A',
  backgroundAlt: '#1E293B',
  surface: '#1E293B',
  surfaceAlt: '#334155',
  
  // Brand colors
  primary: '#4CC9F0',
  primaryLight: '#4895EF',
  primaryDark: '#3A0CA3',
  
  secondary: '#F72585',
  secondaryLight: '#F72585',
  secondaryDark: '#B5179E',
  
  accent: '#4361EE',
  accentDark: '#3A0CA3',
  
  // Text colors
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
  textLight: '#FFFFFF',
  
  // UI elements
  border: '#334155',
  divider: '#334155',
  
  // Status colors
  success: '#10B981',
  successDark: '#059669',
  warning: '#F59E0B',
  warningDark: '#D97706',
  error: '#EF4444',
  errorDark: '#DC2626',
  info: '#3B82F6',
  infoDark: '#2563EB',
  
  // Shadow system - darker shadows for dark mode
  shadow: {
    ...elevation,
    sm: {
      ...elevation.sm,
      shadowOpacity: 0.3,
    },
    md: {
      ...elevation.md,
      shadowOpacity: 0.35,
    },
    lg: {
      ...elevation.lg,
      shadowOpacity: 0.4,
    },
    xl: {
      ...elevation.xl,
      shadowOpacity: 0.45,
    },
  },
  
  // Additional UI colors
  backgroundElevated: '#1E293B',
  errorLight: '#371F1F',
  successLight: '#1F2F1F',
  warningLight: '#2F281F',
  infoLight: '#1F252F',
  
  // Neomorphism colors
  neomorphism: {
    background: '#1E293B',
    shadow: '#0F172A',
    highlight: '#334155',
  },
  
  // Glass morphism colors
  glass: {
    background: 'rgba(30, 41, 59, 0.25)',
    border: 'rgba(203, 213, 225, 0.18)',
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
    saveThemePreference();
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themePreference');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Failed to load theme preference:', error);
    }
  };

  const saveThemePreference = async () => {
    try {
      await AsyncStorage.setItem('themePreference', isDarkMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        isDarkMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;