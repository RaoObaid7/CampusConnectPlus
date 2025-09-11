import React from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { createCardStyle, elevation, borderRadius } from '../utils/designSystem';

const Card = ({
  children,
  variant = 'elevated',
  size = 'md',
  onPress,
  style = {},
  gradientColors,
  ...props
}) => {
  const { theme } = useTheme();
  const cardStyle = createCardStyle(theme, variant, size);

  const renderCardContent = () => (
    <View style={styles.cardContent}>
      {children}
    </View>
  );

  // Gradient card
  if (gradientColors) {
    const content = (
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.card,
          {
            borderRadius: cardStyle.borderRadius,
            padding: cardStyle.padding,
          },
          style,
        ]}
        {...props}
      >
        {renderCardContent()}
      </LinearGradient>
    );

    if (onPress) {
      return (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPress}
          style={styles.touchableContainer}
        >
          {content}
        </TouchableOpacity>
      );
    }

    return content;
  }

  // Regular card
  const content = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: cardStyle.backgroundColor,
          borderRadius: cardStyle.borderRadius,
          padding: cardStyle.padding,
          borderWidth: cardStyle.borderWidth,
          borderColor: cardStyle.borderColor,
          ...variant === 'elevated' && theme.shadow.md,
        },
        style,
      ]}
      {...props}
    >
      {renderCardContent()}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={styles.touchableContainer}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  touchableContainer: {
    width: '100%',
  },
  card: {
    width: '100%',
    overflow: 'hidden',
  },
  cardContent: {
    width: '100%',
  },
});

export default Card;