import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Typography scale with 3D depth
export const typography = {
  // Font families
  fontFamily: {
    primary: 'Inter',
    secondary: 'SF Pro Display',
    mono: 'SF Mono',
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
    black: '900',
  },

  // Line heights for better readability
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Letter spacing for modern look
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 1.5,
  },
};

// Spacing system with consistent rhythm
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
};

// Border radius for modern rounded corners
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

// Animation durations and easings
export const animation = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 750,
  },
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

// 3D transform effects
export const transforms3D = {
  // Perspective for 3D effects
  perspective: {
    shallow: 500,
    normal: 1000,
    deep: 2000,
  },

  // Scale transforms for hover effects
  scale: {
    down: 0.95,
    normal: 1,
    up: 1.05,
    large: 1.1,
  },

  // Rotation transforms
  rotate: {
    slight: '2deg',
    normal: '5deg',
    noticeable: '15deg',
    quarter: '90deg',
  },
};

// Gradient generators
export const gradients = {
  // Primary gradients
  primary: (theme) => ({
    colors: [theme.primaryLight, theme.primary, theme.primaryDark],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  }),

  // Secondary gradients
  secondary: (theme) => ({
    colors: [theme.secondaryLight, theme.secondary, theme.secondaryDark],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  }),

  // Status gradients
  success: (theme) => ({
    colors: [theme.success, '#38a169'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  }),

  error: (theme) => ({
    colors: [theme.error, '#e53e3e'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  }),

  // Special effects
  rainbow: {
    colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  sunset: {
    colors: ['#ffecd2', '#fcb69f', '#ff9a9e', '#fecfef'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
};

// Neumorphism style generator
export const createNeumorphismStyle = (theme, size = 'medium', pressed = false) => {
  const sizes = {
    small: { blur: 4, distance: 2 },
    medium: { blur: 8, distance: 4 },
    large: { blur: 16, distance: 8 },
  };

  const { blur, distance } = sizes[size] || sizes.medium;
  const inset = pressed ? 'inset' : '';

  return {
    backgroundColor: theme.neomorphism.background,
    shadowColor: theme.neomorphism.shadow,
    shadowOffset: {
      width: pressed ? -distance : distance,
      height: pressed ? -distance : distance,
    },
    shadowOpacity: 0.3,
    shadowRadius: blur,
    elevation: pressed ? 0 : distance * 2,
  };
};

// Glassmorphism style generator
export const createGlassmorphismStyle = (theme, opacity = 0.25) => ({
  backgroundColor: `rgba(255, 255, 255, ${opacity})`,
  borderWidth: 1,
  borderColor: theme.glass.border,
  backdropFilter: 'blur(10px)',
  // Note: backdrop-filter is not fully supported in React Native
  // This would need a library like react-native-blur
});

// Card style generator with 3D effects
export const createCardStyle = (theme, variant = 'elevated', size = 'medium') => {
  const variants = {
    flat: {
      ...theme.shadow.small,
      borderWidth: 1,
      borderColor: theme.border,
    },
    elevated: theme.shadow.medium,
    floating: theme.shadow.large,
    dramatic: theme.shadow.xl,
  };

  const sizes = {
    small: {
      borderRadius: borderRadius.md,
      padding: spacing.sm,
    },
    medium: {
      borderRadius: borderRadius.lg,
      padding: spacing.md,
    },
    large: {
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
    },
  };

  return {
    backgroundColor: theme.card,
    ...variants[variant],
    ...sizes[size],
  };
};

// Button style generator with 3D effects
export const createButtonStyle = (theme, variant = 'primary', size = 'medium', state = 'normal') => {
  const variants = {
    primary: {
      backgroundColor: theme.primary,
      color: theme.textLight,
      ...theme.shadow.medium,
    },
    secondary: {
      backgroundColor: theme.secondary,
      color: theme.textLight,
      ...theme.shadow.medium,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: theme.primary,
      color: theme.primary,
      ...theme.shadow.small,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: theme.primary,
    },
    gradient: {
      color: theme.textLight,
      ...theme.shadow.medium,
    },
  };

  const sizes = {
    small: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.sm,
    },
    medium: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.lg,
      fontSize: typography.fontSize.md,
    },
    large: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.xl,
      fontSize: typography.fontSize.lg,
    },
  };

  const states = {
    normal: { transform: [{ scale: 1 }] },
    pressed: { 
      transform: [{ scale: transforms3D.scale.down }],
      opacity: 0.8,
    },
    hover: { 
      transform: [{ scale: transforms3D.scale.up }],
    },
    disabled: {
      opacity: 0.5,
      transform: [{ scale: 1 }],
    },
  };

  return {
    ...variants[variant],
    ...sizes[size],
    ...states[state],
    alignItems: 'center',
    justifyContent: 'center',
  };
};

// Input style generator with 3D effects
export const createInputStyle = (theme, variant = 'default', state = 'normal') => {
  const variants = {
    default: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      ...theme.shadow.small,
    },
    filled: {
      backgroundColor: theme.surface,
      borderWidth: 0,
      ...theme.shadow.small,
    },
    outlined: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: theme.border,
    },
    neumorphic: createNeumorphismStyle(theme, 'medium', state === 'focused'),
  };

  const states = {
    normal: {},
    focused: {
      borderColor: theme.primary,
      ...theme.shadow.medium,
    },
    error: {
      borderColor: theme.error,
      ...theme.shadow.small,
    },
    disabled: {
      opacity: 0.5,
      backgroundColor: theme.borderLight,
    },
  };

  return {
    ...variants[variant],
    ...states[state],
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.md,
    color: theme.text,
  };
};

// Responsive design helpers
export const responsive = {
  isSmallScreen: screenWidth < 375,
  isMediumScreen: screenWidth >= 375 && screenWidth < 768,
  isLargeScreen: screenWidth >= 768,
  screenWidth,
  screenHeight,
};

// Helper functions for dynamic styling
export const helpers = {
  // Get responsive font size
  responsiveFontSize: (size) => {
    const scale = responsive.isSmallScreen ? 0.9 : responsive.isLargeScreen ? 1.1 : 1;
    return typography.fontSize[size] * scale;
  },

  // Get responsive spacing
  responsiveSpacing: (size) => {
    const scale = responsive.isSmallScreen ? 0.8 : responsive.isLargeScreen ? 1.2 : 1;
    return spacing[size] * scale;
  },

  // Add opacity to hex color
  addOpacity: (hex, opacity) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },

  // Create hover effect style
  createHoverEffect: (baseStyle, hoverTransform = transforms3D.scale.up) => ({
    ...baseStyle,
    transform: [{ scale: hoverTransform }],
  }),
};

export default {
  typography,
  spacing,
  borderRadius,
  animation,
  transforms3D,
  gradients,
  createNeumorphismStyle,
  createGlassmorphismStyle,
  createCardStyle,
  createButtonStyle,
  createInputStyle,
  responsive,
  helpers,
};
