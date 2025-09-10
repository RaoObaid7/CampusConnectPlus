import React from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { FloatingCard3D } from './Card3D';
import { spacing, borderRadius } from '../utils/designSystem';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Background3D = ({ 
  children, 
  variant = 'default',
  showFloatingElements = true,
  customGradient = null 
}) => {
  const { theme } = useTheme();

  const getGradientColors = () => {
    if (customGradient) return customGradient;
    
    switch (variant) {
      case 'warm':
        return [
          theme.accent + '15',
          theme.secondary + '10',
          theme.backgroundSolid
        ];
      case 'cool':
        return [
          theme.info + '15',
          theme.primary + '10',
          theme.backgroundSolid
        ];
      case 'vibrant':
        return [
          theme.primaryLight + '20',
          theme.secondaryLight + '15',
          theme.accent + '10',
          theme.backgroundSolid
        ];
      default:
        return [
          theme.primaryLight + '10',
          theme.secondaryLight + '10',
          theme.backgroundSolid
        ];
    }
  };

  const floatingElements = [
    {
      id: 1,
      size: { width: 80, height: 80 },
      position: { top: screenHeight * 0.1, right: screenWidth * 0.1 },
      color: theme.primary + '20',
      duration: 3000,
    },
    {
      id: 2,
      size: { width: 120, height: 120 },
      position: { bottom: screenHeight * 0.25, left: screenWidth * 0.05 },
      color: theme.secondary + '15',
      duration: 4000,
    },
    {
      id: 3,
      size: { width: 60, height: 60 },
      position: { top: screenHeight * 0.3, left: screenWidth * 0.2 },
      color: theme.accent + '25',
      duration: 2500,
    },
    {
      id: 4,
      size: { width: 40, height: 40 },
      position: { top: screenHeight * 0.6, right: screenWidth * 0.3 },
      color: theme.info + '20',
      duration: 3500,
    },
    {
      id: 5,
      size: { width: 100, height: 100 },
      position: { bottom: screenHeight * 0.45, right: screenWidth * 0.15 },
      color: theme.success + '15',
      duration: 4500,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Animated Background Gradient */}
      <LinearGradient
        colors={getGradientColors()}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Floating Elements */}
      {showFloatingElements && (
        <View style={styles.floatingElements}>
          {floatingElements.map((element) => (
            <FloatingCard3D
              key={element.id}
              style={[
                styles.floatingElement,
                element.size,
                element.position,
                { backgroundColor: element.color }
              ]}
            />
          ))}
        </View>
      )}
      
      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

// Specialized Background variants
export const WarmBackground3D = (props) => (
  <Background3D variant="warm" {...props} />
);

export const CoolBackground3D = (props) => (
  <Background3D variant="cool" {...props} />
);

export const VibrantBackground3D = (props) => (
  <Background3D variant="vibrant" {...props} />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  floatingElement: {
    position: 'absolute',
    borderRadius: borderRadius.xl,
    opacity: 0.6,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});

export default Background3D;
