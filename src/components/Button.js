import React, { useState } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View, 
  ActivityIndicator,
  Animated 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { createButtonStyle, spacing, borderRadius, animation } from '../utils/designSystem';

const Button = ({
  title,
  onPress,
  variant = 'filled',
  size = 'md',
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  children,
  style = {},
  textStyle = {},
  gradientColors = null,
  ...props
}) => {
  const { theme } = useTheme();
  const [pressed, setPressed] = useState(false);
  const [animatedValue] = useState(new Animated.Value(1));

  const buttonStyle = createButtonStyle(theme, variant, size, 
    disabled ? 'disabled' : pressed ? 'pressed' : 'normal'
  );

  const handlePressIn = () => {
    if (disabled || loading) return;
    setPressed(true);
    Animated.spring(animatedValue, {
      toValue: 0.97,
      duration: animation.duration.fast,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    setPressed(false);
    Animated.spring(animatedValue, {
      toValue: 1,
      duration: animation.duration.fast,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (disabled || loading) return;
    if (onPress) onPress();
  };

  const renderButtonContent = () => (
    <Animated.View 
      style={[styles.buttonContent, { transform: [{ scale: animatedValue }] }]}
    >
      {loading && (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? theme.primary : theme.textLight}
          style={styles.loader}
        />
      )}
      
      {icon && !loading && iconPosition === 'left' && (
        <View style={[styles.iconContainer, title && { marginRight: spacing.xs }]}>
          {icon}
        </View>
      )}
      
      {(title || children) && (
        <Text 
          style={[
            styles.buttonText, 
            { 
              color: buttonStyle.color,
              fontSize: buttonStyle.fontSize,
              fontWeight: '600'
            }, 
            textStyle
          ]}
        >
          {children || title}
        </Text>
      )}

      {icon && !loading && iconPosition === 'right' && (
        <View style={[styles.iconContainer, title && { marginLeft: spacing.xs }]}>
          {icon}
        </View>
      )}
    </Animated.View>
  );

  if (variant === 'gradient' || gradientColors) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[styles.buttonContainer, style]}
        {...props}
      >
        <LinearGradient
          colors={gradientColors || [theme.primary, theme.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.button,
            {
              borderRadius: buttonStyle.borderRadius,
              paddingHorizontal: buttonStyle.paddingHorizontal,
              paddingVertical: buttonStyle.paddingVertical,
              opacity: buttonStyle.opacity || 1,
            },
          ]}
        >
          {renderButtonContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.buttonContainer,
        styles.button,
        {
          backgroundColor: buttonStyle.backgroundColor,
          borderWidth: buttonStyle.borderWidth,
          borderColor: buttonStyle.borderColor,
          borderRadius: buttonStyle.borderRadius,
          paddingHorizontal: buttonStyle.paddingHorizontal,
          paddingVertical: buttonStyle.paddingVertical,
          opacity: buttonStyle.opacity || 1,
        },
        style,
      ]}
      {...props}
    >
      {renderButtonContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: 'flex-start',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    marginRight: spacing.xs,
  },
});

export default Button;