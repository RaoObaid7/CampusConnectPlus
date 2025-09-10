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
import { createButtonStyle, spacing, borderRadius, transforms3D, animation } from '../utils/designSystem';

const Button3D = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon = null,
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
      toValue: transforms3D.scale.down,
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
      style={[
        styles.buttonContent,
        { transform: [{ scale: animatedValue }] }
      ]}
    >
      {loading && (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? theme.primary : theme.textLight}
          style={styles.loader}
        />
      )}
      
      {icon && !loading && (
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
    </Animated.View>
  );

  if (variant === 'gradient' || gradientColors) {
    const colors = gradientColors || [theme.primaryLight, theme.primary, theme.primaryDark];
    
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled || loading}
        style={[styles.container, style]}
        {...props}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            buttonStyle,
            styles.gradientButton,
            { opacity: disabled ? 0.5 : 1 }
          ]}
        >
          {renderButtonContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled || loading}
      style={[
        styles.container,
        buttonStyle,
        style
      ]}
      {...props}
    >
      {renderButtonContent()}
    </TouchableOpacity>
  );
};

// Specialized button variants
export const PrimaryButton3D = (props) => (
  <Button3D variant="primary" {...props} />
);

export const SecondaryButton3D = (props) => (
  <Button3D variant="secondary" {...props} />
);

export const OutlineButton3D = (props) => (
  <Button3D variant="outline" {...props} />
);

export const GhostButton3D = (props) => (
  <Button3D variant="ghost" {...props} />
);

export const GradientButton3D = ({ colors, ...props }) => {
  const { theme } = useTheme();
  const defaultColors = [theme.primaryLight, theme.primary, theme.primaryDark];
  return (
    <Button3D 
      variant="gradient" 
      gradientColors={colors || defaultColors}
      {...props} 
    />
  );
};

export const NeumorphicButton3D = (props) => {
  const { theme } = useTheme();
  const [pressed, setPressed] = useState(false);
  
  const neumorphicStyle = {
    backgroundColor: theme.neomorphism.background,
    shadowColor: theme.neomorphism.shadow,
    shadowOffset: {
      width: pressed ? -4 : 4,
      height: pressed ? -4 : 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: pressed ? 0 : 4,
    borderRadius: borderRadius.xl,
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={props.onPress}
      style={[
        neumorphicStyle,
        { 
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          alignItems: 'center',
          justifyContent: 'center',
        },
        props.style
      ]}
    >
      <Text style={[
        { 
          color: theme.text, 
          fontSize: 16, 
          fontWeight: '600' 
        }, 
        props.textStyle
      ]}>
        {props.children || props.title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    marginRight: spacing.xs,
  },
});

export default Button3D;
