import React, { useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { createCardStyle, spacing, borderRadius, transforms3D, animation } from '../utils/designSystem';

const { width: screenWidth } = Dimensions.get('window');

const Card3D = ({
  children,
  variant = 'elevated',
  size = 'medium',
  style = {},
  onPress = null,
  gradientColors = null,
  glassEffect = false,
  neumorphic = false,
  floatingAnimation = false,
  tiltEffect = false,
  ...props
}) => {
  const { theme } = useTheme();
  const [pressed, setPressed] = useState(false);
  const [animatedValue] = useState(new Animated.Value(1));
  const [rotateX] = useState(new Animated.Value(0));
  const [rotateY] = useState(new Animated.Value(0));

  const cardStyle = createCardStyle(theme, variant, size);

  React.useEffect(() => {
    if (floatingAnimation) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1.02,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [floatingAnimation]);

  const handlePressIn = () => {
    if (!onPress) return;
    setPressed(true);
    Animated.spring(animatedValue, {
      toValue: transforms3D.scale.down,
      duration: animation.duration.fast,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (!onPress) return;
    setPressed(false);
    Animated.spring(animatedValue, {
      toValue: floatingAnimation ? 1.02 : 1,
      duration: animation.duration.fast,
      useNativeDriver: true,
    }).start();
  };

  const handleTilt = (event) => {
    if (!tiltEffect) return;
    
    const { locationX, locationY } = event.nativeEvent;
    const cardWidth = screenWidth - (spacing.md * 2);
    const cardHeight = 200; // Approximate card height
    
    // Calculate rotation based on touch position
    const rotateXValue = ((locationY / cardHeight) - 0.5) * -20;
    const rotateYValue = ((locationX / cardWidth) - 0.5) * 20;
    
    Animated.parallel([
      Animated.timing(rotateX, {
        toValue: rotateXValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rotateY, {
        toValue: rotateYValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const resetTilt = () => {
    if (!tiltEffect) return;
    
    Animated.parallel([
      Animated.spring(rotateX, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.spring(rotateY, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getCardStyle = () => {
    if (neumorphic) {
      return {
        backgroundColor: theme.neomorphism.background,
        shadowColor: theme.neomorphism.shadow,
        shadowOffset: {
          width: pressed ? -4 : 8,
          height: pressed ? -4 : 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: pressed ? 0 : 8,
        borderRadius: borderRadius.xl,
        padding: spacing[size === 'small' ? 'sm' : size === 'large' ? 'lg' : 'md'],
      };
    }

    if (glassEffect) {
      return {
        backgroundColor: theme.glass.background,
        borderWidth: 1,
        borderColor: theme.glass.border,
        borderRadius: borderRadius.xl,
        padding: spacing[size === 'small' ? 'sm' : size === 'large' ? 'lg' : 'md'],
        ...theme.shadow.medium,
      };
    }

    return cardStyle;
  };

  const transformStyle = {
    transform: [
      { scale: animatedValue },
      { rotateX: rotateX.interpolate({
          inputRange: [-20, 20],
          outputRange: ['-20deg', '20deg'],
        }) 
      },
      { rotateY: rotateY.interpolate({
          inputRange: [-20, 20],
          outputRange: ['-20deg', '20deg'],
        }) 
      },
      { perspective: transforms3D.perspective.normal },
    ],
  };

  if (gradientColors && !neumorphic && !glassEffect) {
    return (
      <Animated.View
        style={[transformStyle, style]}
        onTouchStart={handleTilt}
        onTouchEnd={resetTilt}
        onTouchCancel={resetTilt}
        {...props}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            getCardStyle(),
            styles.gradientCard,
          ]}
          onTouchStart={onPress ? handlePressIn : undefined}
          onTouchEnd={onPress ? handlePressOut : undefined}
          onPress={onPress}
        >
          {children}
        </LinearGradient>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        getCardStyle(),
        transformStyle,
        style
      ]}
      onTouchStart={tiltEffect ? handleTilt : (onPress ? handlePressIn : undefined)}
      onTouchEnd={tiltEffect ? resetTilt : (onPress ? handlePressOut : undefined)}
      onTouchCancel={tiltEffect ? resetTilt : undefined}
      onPress={onPress}
      {...props}
    >
      {children}
    </Animated.View>
  );
};

// Specialized Card variants
export const GlassCard3D = (props) => (
  <Card3D glassEffect={true} variant="elevated" {...props} />
);

export const NeumorphicCard3D = (props) => (
  <Card3D neumorphic={true} {...props} />
);

export const FloatingCard3D = (props) => (
  <Card3D floatingAnimation={true} variant="floating" {...props} />
);

export const TiltCard3D = (props) => (
  <Card3D tiltEffect={true} variant="elevated" {...props} />
);

export const GradientCard3D = ({ colors, ...props }) => {
  const { theme } = useTheme();
  const defaultColors = [theme.primaryLight, theme.primary];
  return (
    <Card3D 
      gradientColors={colors || defaultColors}
      {...props} 
    />
  );
};

export const HoverCard3D = ({ children, onPress, ...props }) => {
  const [hovered, setHovered] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));

  const handleHoverIn = () => {
    setHovered(true);
    Animated.spring(scaleValue, {
      toValue: transforms3D.scale.up,
      useNativeDriver: true,
    }).start();
  };

  const handleHoverOut = () => {
    setHovered(false);
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{ transform: [{ scale: scaleValue }] }}
      onMouseEnter={handleHoverIn}
      onMouseLeave={handleHoverOut}
    >
      <Card3D onPress={onPress} variant="elevated" {...props}>
        {children}
      </Card3D>
    </Animated.View>
  );
};

// Pulsing card for notifications or highlights
export const PulsingCard3D = ({ children, ...props }) => {
  const [pulseValue] = useState(new Animated.Value(1));

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: pulseValue }] }}>
      <Card3D variant="elevated" {...props}>
        {children}
      </Card3D>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  gradientCard: {
    backgroundColor: 'transparent',
  },
});

export default Card3D;
