import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Animated 
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius, animation } from '../utils/designSystem';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize = 'none',
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  labelStyle,
  disabled = false,
  ...props
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const getBorderColor = () => {
    if (error) return theme.error;
    if (isFocused) return theme.primary;
    return theme.border;
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: theme.textSecondary }, labelStyle]}>
          {label}
        </Text>
      )}

      <View 
        style={[
          styles.inputContainer,
          { 
            borderColor: getBorderColor(),
            backgroundColor: disabled ? theme.backgroundDisabled : theme.backgroundInput,
            ...theme.shadow.xs
          },
          multiline && { minHeight: numberOfLines * 24 }
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            { 
              color: theme.text,
              flex: 1,
              textAlignVertical: multiline ? 'top' : 'center',
            },
            inputStyle
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textPlaceholder}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          editable={!disabled}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity 
            style={styles.rightIcon} 
            onPress={togglePasswordVisibility}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Text style={{ color: theme.primary }}>
              {isPasswordVisible ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        )}

        {rightIcon && !secureTextEntry && (
          <TouchableOpacity 
            style={styles.rightIcon} 
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {(error || hint) && (
        <Text 
          style={[
            styles.helperText, 
            { color: error ? theme.error : theme.textSecondary }
          ]}
        >
          {error || hint}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
  },
  input: {
    paddingVertical: spacing.sm,
    fontSize: 16,
  },
  leftIcon: {
    marginRight: spacing.xs,
  },
  rightIcon: {
    marginLeft: spacing.xs,
  },
  helperText: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
});

export default Input;