import React, { useState, useRef } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  Animated, 
  TouchableOpacity 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { 
  createInputStyle, 
  spacing, 
  borderRadius, 
  typography, 
  animation,
  transforms3D 
} from '../utils/designSystem';

const Input3D = ({
  label = '',
  placeholder = '',
  value = '',
  onChangeText,
  onFocus,
  onBlur,
  error = '',
  success = false,
  disabled = false,
  secureTextEntry = false,
  variant = 'default',
  size = 'medium',
  icon = null,
  rightIcon = null,
  multiline = false,
  numberOfLines = 1,
  gradientBorder = false,
  glassEffect = false,
  neumorphic = false,
  floatingLabel = false,
  style = {},
  inputStyle = {},
  labelStyle = {},
  errorStyle = {},
  ...props
}) => {
  const { theme } = useTheme();
  const inputRef = useRef(null);
  const [focused, setFocused] = useState(false);
  const [animatedFocus] = useState(new Animated.Value(0));
  const [labelAnimated] = useState(new Animated.Value(value ? 1 : 0));
  const [scaleValue] = useState(new Animated.Value(1));

  const inputStyleConfig = createInputStyle(
    theme, 
    variant, 
    error ? 'error' : focused ? 'focused' : disabled ? 'disabled' : 'normal'
  );

  const handleFocus = (event) => {
    setFocused(true);
    
    // Animate focus effects
    Animated.parallel([
      Animated.timing(animatedFocus, {
        toValue: 1,
        duration: animation.duration.normal,
        useNativeDriver: false,
      }),
      Animated.spring(scaleValue, {
        toValue: transforms3D.scale.up,
        duration: animation.duration.normal,
        useNativeDriver: true,
      }),
      floatingLabel && Animated.timing(labelAnimated, {
        toValue: 1,
        duration: animation.duration.normal,
        useNativeDriver: false,
      }),
    ]).start();

    if (onFocus) onFocus(event);
  };

  const handleBlur = (event) => {
    setFocused(false);
    
    // Animate blur effects
    Animated.parallel([
      Animated.timing(animatedFocus, {
        toValue: 0,
        duration: animation.duration.normal,
        useNativeDriver: false,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: animation.duration.normal,
        useNativeDriver: true,
      }),
      floatingLabel && !value && Animated.timing(labelAnimated, {
        toValue: 0,
        duration: animation.duration.normal,
        useNativeDriver: false,
      }),
    ]).start();

    if (onBlur) onBlur(event);
  };

  const getContainerStyle = () => {
    if (neumorphic) {
      return {
        backgroundColor: theme.neomorphism.background,
        shadowColor: theme.neomorphism.shadow,
        shadowOffset: {
          width: focused ? -2 : 4,
          height: focused ? -2 : 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: focused ? 0 : 4,
        borderRadius: borderRadius.lg,
      };
    }

    if (glassEffect) {
      return {
        backgroundColor: theme.glass.background,
        borderWidth: 1,
        borderColor: focused ? theme.primary : theme.glass.border,
        borderRadius: borderRadius.lg,
        ...theme.shadow.small,
      };
    }

    return inputStyleConfig;
  };

  const animatedBorderColor = animatedFocus.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.border, theme.primary],
  });

  const animatedShadowOpacity = animatedFocus.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.2],
  });

  const floatingLabelStyle = {
    position: 'absolute',
    left: spacing.md,
    top: labelAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [spacing.md, spacing.xs],
    }),
    fontSize: labelAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [typography.fontSize.md, typography.fontSize.sm],
    }),
    color: focused ? theme.primary : theme.textSecondary,
    backgroundColor: theme.surface,
    paddingHorizontal: spacing.xs,
    zIndex: 1,
  };

  const renderInput = () => (
    <View style={styles.inputContainer}>
      {icon && (
        <View style={[styles.iconContainer, styles.leftIcon]}>
          {icon}
        </View>
      )}
      
      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          {
            color: theme.text,
            fontSize: typography.fontSize[size === 'small' ? 'sm' : size === 'large' ? 'lg' : 'md'],
            paddingLeft: icon ? spacing.xl + spacing.md : spacing.md,
            paddingRight: rightIcon ? spacing.xl + spacing.md : spacing.md,
            textAlignVertical: multiline ? 'top' : 'center',
            height: multiline ? numberOfLines * 24 + spacing.lg : spacing.xl + spacing.sm,
          },
          inputStyle
        ]}
        placeholder={floatingLabel ? '' : placeholder}
        placeholderTextColor={theme.textSecondary}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        secureTextEntry={secureTextEntry}
        editable={!disabled}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        {...props}
      />
      
      {rightIcon && (
        <TouchableOpacity 
          style={[styles.iconContainer, styles.rightIcon]}
          onPress={() => inputRef.current?.focus()}
        >
          {rightIcon}
        </TouchableOpacity>
      )}
    </View>
  );

  if (gradientBorder && !neumorphic && !glassEffect) {
    return (
      <Animated.View 
        style={[
          styles.container, 
          { transform: [{ scale: scaleValue }] },
          style
        ]}
      >
        {label && !floatingLabel && (
          <Text style={[styles.label, { color: theme.text }, labelStyle]}>
            {label}
          </Text>
        )}
        
        <LinearGradient
          colors={focused ? [theme.primaryLight, theme.primary] : [theme.border, theme.border]}
          style={styles.gradientBorder}
        >
          <View style={[getContainerStyle(), styles.gradientInner]}>
            {floatingLabel && (
              <Animated.Text style={floatingLabelStyle}>
                {label}
              </Animated.Text>
            )}
            {renderInput()}
          </View>
        </LinearGradient>
        
        {error && (
          <Text style={[styles.errorText, { color: theme.error }, errorStyle]}>
            {error}
          </Text>
        )}
        
        {success && (
          <Text style={[styles.successText, { color: theme.success }]}>
            ✓ Looks good!
          </Text>
        )}
      </Animated.View>
    );
  }

  return (
    <Animated.View 
      style={[
        styles.container, 
        { transform: [{ scale: scaleValue }] },
        style
      ]}
    >
      {label && !floatingLabel && (
        <Text style={[styles.label, { color: theme.text }, labelStyle]}>
          {label}
        </Text>
      )}
      
      <Animated.View
        style={[
          getContainerStyle(),
          gradientBorder && styles.gradientBorder,
          {
            borderColor: variant !== 'filled' ? animatedBorderColor : 'transparent',
            shadowOpacity: animatedShadowOpacity,
          }
        ]}
      >
        {floatingLabel && (
          <Animated.Text style={floatingLabelStyle}>
            {label}
          </Animated.Text>
        )}
        {renderInput()}
      </Animated.View>
      
      {error && (
        <Text style={[styles.errorText, { color: theme.error }, errorStyle]}>
          {error}
        </Text>
      )}
      
      {success && (
        <Text style={[styles.successText, { color: theme.success }]}>
          ✓ Looks good!
        </Text>
      )}
    </Animated.View>
  );
};

// Specialized Input variants
export const GlassInput3D = (props) => (
  <Input3D glassEffect={true} {...props} />
);

export const NeumorphicInput3D = (props) => (
  <Input3D neumorphic={true} {...props} />
);

export const FloatingLabelInput3D = (props) => (
  <Input3D floatingLabel={true} {...props} />
);

export const GradientBorderInput3D = (props) => (
  <Input3D gradientBorder={true} {...props} />
);

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.xs,
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: spacing.xl,
    zIndex: 1,
  },
  leftIcon: {
    left: spacing.sm,
  },
  rightIcon: {
    right: spacing.sm,
  },
  gradientBorder: {
    borderRadius: borderRadius.lg + 1,
    padding: 1,
  },
  gradientInner: {
    borderRadius: borderRadius.lg,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
  successText: {
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});

export default Input3D;
