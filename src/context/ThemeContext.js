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
  // Base colors with gradients for 3D effect
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  backgroundSolid: '#f8fafc',
  surface: '#ffffff',
  surfaceElevated: '#ffffff',
  
  // Enhanced color palette for 3D depth
  primary: '#667eea',
  primaryLight: '#818cf8',
  primaryDark: '#4c51bf',
  primaryGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  
  secondary: '#f093fb',
  secondaryLight: '#fbb6ce',
  secondaryDark: '#e879f9',
  secondaryGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  
  accent: '#ffecd2',
  accentGradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  
  // Text colors with depth
  text: '#1a202c',
  textSecondary: '#4a5568',
  textTertiary: '#718096',
  textLight: '#ffffff',
  
  // UI elements
  border: '#e2e8f0',
  borderLight: '#f7fafc',
  card: '#ffffff',
  cardShadow: 'rgba(0, 0, 0, 0.1)',
  
  // Status colors
  success: '#48bb78',
  successGradient: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
  warning: '#ed8936',
  warningGradient: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
  error: '#f56565',
  errorGradient: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
  info: '#4299e1',
  infoGradient: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
  
  // 3D Shadow system
  shadow: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 24,
      elevation: 12,
    }
  },
  
  // Glassmorphism effect
  glass: {
    background: 'rgba(255, 255, 255, 0.25)',
    border: 'rgba(255, 255, 255, 0.18)',
    backdrop: 'blur(10px)',
  },
  
  // Neumorphism colors
  neomorphism: {
    highlight: '#ffffff',
    shadow: '#d1d9e0',
    background: '#e0e5ec',
  }
};

export const darkTheme = {
  // Dark base colors with gradients for 3D effect
  background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
  backgroundSolid: '#1a202c',
  surface: '#2d3748',
  surfaceElevated: '#4a5568',
  
  // Enhanced dark color palette
  primary: '#9f7aea',
  primaryLight: '#b794f6',
  primaryDark: '#805ad5',
  primaryGradient: 'linear-gradient(135deg, #9f7aea 0%, #667eea 100%)',
  
  secondary: '#ed64a6',
  secondaryLight: '#f687b3',
  secondaryDark: '#d53f8c',
  secondaryGradient: 'linear-gradient(135deg, #ed64a6 0%, #f093fb 100%)',
  
  accent: '#f6ad55',
  accentGradient: 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)',
  
  // Dark text colors
  text: '#f7fafc',
  textSecondary: '#e2e8f0',
  textTertiary: '#cbd5e0',
  textLight: '#ffffff',
  
  // Dark UI elements
  border: '#4a5568',
  borderLight: '#2d3748',
  card: '#2d3748',
  cardShadow: 'rgba(0, 0, 0, 0.3)',
  
  // Dark status colors
  success: '#68d391',
  successGradient: 'linear-gradient(135deg, #68d391 0%, #48bb78 100%)',
  warning: '#f6ad55',
  warningGradient: 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)',
  error: '#fc8181',
  errorGradient: 'linear-gradient(135deg, #fc8181 0%, #f56565 100%)',
  info: '#63b3ed',
  infoGradient: 'linear-gradient(135deg, #63b3ed 0%, #4299e1 100%)',
  
  // 3D Shadow system for dark theme
  shadow: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.6,
      shadowRadius: 24,
      elevation: 12,
    }
  },
  
  // Dark glassmorphism effect
  glass: {
    background: 'rgba(45, 55, 72, 0.25)',
    border: 'rgba(255, 255, 255, 0.1)',
    backdrop: 'blur(10px)',
  },
  
  // Dark neumorphism colors
  neomorphism: {
    highlight: '#4a5568',
    shadow: '#171923',
    background: '#2d3748',
  }
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