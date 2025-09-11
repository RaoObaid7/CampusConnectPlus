import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const Background = ({
  children,
  variant = 'default',
  gradientColors,
  style,
  ...props
}) => {
  const { theme } = useTheme();

  // Gradient background
  if (variant === 'gradient' || gradientColors) {
    return (
      <LinearGradient
        colors={gradientColors || [theme.primaryLight + '40', theme.primary + '20', theme.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, style]}
        {...props}
      >
        {children}
      </LinearGradient>
    );
  }

  // Solid color background
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});

export default Background;