import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Modern Typography System
export const typography = {
  // Font families - using system fonts for better performance
  fontFamily: {
    primary: 'System',  // Will use San Francisco on iOS, Roboto on Android
    secondary: 'System',
    mono: 'monospace',
  },

  // Font sizes with responsive scaling
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },

  // Font weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Line heights for better readability
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
};

// Modern Spacing System - using 4pt grid
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 56,
  '4xl': 72,
};

// Modern Border Radius
export const borderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  pill: 9999,
};

// Animation durations and easings
export const animation = {
  duration: {
    fast: 150,
    normal: 250,
    slow: 400,
  },
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// Elevation and shadow system
export const elevation = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 9,
  },
};

// Helper functions for responsive design
export const responsive = {
  isSmallScreen: screenWidth < 375,
  isMediumScreen: screenWidth >= 375 && screenWidth < 768,
  isLargeScreen: screenWidth >= 768,
  
  // Responsive font size calculation
  calcFontSize: (size) => {
    if (screenWidth < 375) return size * 0.9;
    if (screenWidth >= 768) return size * 1.1;
    return size;
  },
  
  // Responsive spacing calculation
  calcSpacing: (space) => {
    if (screenWidth < 375) return space * 0.9;
    if (screenWidth >= 768) return space * 1.2;
    return space;
  },
};

// Button style generator
export const createButtonStyle = (theme, variant = 'filled', size = 'md', state = 'normal') => {
  // Base styles
  const baseStyle = {
    paddingHorizontal: size === 'sm' ? spacing.md : size === 'lg' ? spacing.xl : spacing.lg,
    paddingVertical: size === 'sm' ? spacing.xs : size === 'lg' ? spacing.md : spacing.sm,
    borderRadius: size === 'sm' ? borderRadius.sm : size === 'lg' ? borderRadius.lg : borderRadius.md,
    fontSize: size === 'sm' ? typography.fontSize.sm : size === 'lg' ? typography.fontSize.lg : typography.fontSize.md,
  };

  // Variant styles
  const variantStyles = {
    filled: {
      backgroundColor: theme.primary,
      color: theme.textLight,
      borderWidth: 0,
    },
    outline: {
      backgroundColor: 'transparent',
      color: theme.primary,
      borderWidth: 1,
      borderColor: theme.primary,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: theme.primary,
      borderWidth: 0,
    },
    subtle: {
      backgroundColor: theme.primary + '15', // 15% opacity
      color: theme.primary,
      borderWidth: 0,
    },
  };

  // State styles
  const stateStyles = {
    normal: {},
    pressed: {
      opacity: 0.8,
    },
    disabled: {
      opacity: 0.5,
    },
  };

  return {
    ...baseStyle,
    ...variantStyles[variant],
    ...stateStyles[state],
  };
};

// Card style generator
export const createCardStyle = (theme, variant = 'elevated', size = 'md') => {
  // Base styles
  const baseStyle = {
    padding: size === 'sm' ? spacing.md : size === 'lg' ? spacing.xl : spacing.lg,
    borderRadius: size === 'sm' ? borderRadius.md : size === 'lg' ? borderRadius.xl : borderRadius.lg,
    backgroundColor: theme.surface,
  };

  // Variant styles
  const variantStyles = {
    elevated: {
      ...elevation.md,
    },
    outlined: {
      borderWidth: 1,
      borderColor: theme.border,
    },
    flat: {},
  };

  return {
    ...baseStyle,
    ...variantStyles[variant],
  };
};

// Input style generator
export const createInputStyle = (theme, variant = 'outline', size = 'md', state = 'normal') => {
  // Base styles
  const baseStyle = {
    paddingHorizontal: size === 'sm' ? spacing.md : size === 'lg' ? spacing.lg : spacing.md,
    paddingVertical: size === 'sm' ? spacing.xs : size === 'lg' ? spacing.md : spacing.sm,
    borderRadius: size === 'sm' ? borderRadius.sm : size === 'lg' ? borderRadius.lg : borderRadius.md,
    fontSize: size === 'sm' ? typography.fontSize.sm : size === 'lg' ? typography.fontSize.lg : typography.fontSize.md,
  };

  // Variant styles
  const variantStyles = {
    outline: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
    },
    filled: {
      backgroundColor: theme.backgroundAlt,
      borderWidth: 0,
    },
    underline: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      borderBottomWidth: 1,
      borderColor: theme.border,
      borderRadius: 0,
    },
  };

  // State styles
  const stateStyles = {
    normal: {},
    focused: {
      borderColor: theme.primary,
    },
    error: {
      borderColor: theme.error,
    },
    disabled: {
      opacity: 0.5,
    },
  };

  return {
    ...baseStyle,
    ...variantStyles[variant],
    ...stateStyles[state],
  };
};

// 3D Transform and Animation configurations
export const transforms3D = {
  scale: {
    up: 1.05,
    down: 0.95,
    normal: 1,
  },
  rotate: {
    slight: 3,
    moderate: 15,
    full: 360,
  },
  translate: {
    small: 5,
    medium: 10,
    large: 20,
  },
  perspective: {
    close: 300,
    normal: 500,
    far: 800,
  },
};

// Gradient configurations
export const gradients = {
  primary: (theme) => ({
    colors: [theme.primary, theme.primaryDark],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  }),
  secondary: (theme) => ({
    colors: [theme.secondary, theme.secondaryDark],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  }),
  success: (theme) => ({
    colors: [theme.success, theme.successDark],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  }),
  error: (theme) => ({
    colors: [theme.error, theme.errorDark],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  }),
};
