import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius, typography } from '../utils/designSystem';
import Button from './Button';

const Header = ({
  title,
  leftComponent,
  rightComponent,
  showBackButton = false,
  onBackPress,
  style,
  titleStyle,
  ...props
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View 
      style={[
        styles.header,
        { 
          backgroundColor: theme.surface,
          borderBottomColor: theme.border,
          borderBottomWidth: 1,
          ...theme.shadow.md
        },
        style
      ]}
      {...props}
    >
      <View style={styles.leftContainer}>
        {showBackButton && (
          <Button 
            onPress={handleBackPress}
            variant="icon"
            icon="←"
            iconStyle={{ color: theme.primary, fontSize: 16 }}
            style={styles.backButton}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          />
        )}
        {leftComponent}
      </View>

      {title && (
        <Text 
          style={[
            styles.title, 
            { 
              color: theme.text,
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.semibold,
              letterSpacing: 0.5
            },
            titleStyle
          ]} 
          numberOfLines={1}
        >
          {title}
        </Text>
      )}

      <View style={styles.rightContainer}>
        {rightComponent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    width: '100%',
    height: 60,
    borderBottomLeftRadius: borderRadius.md,
    borderBottomRightRadius: borderRadius.md,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 40,
    gap: spacing.xs,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 40,
    gap: spacing.xs,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
  },
});

export default Header;