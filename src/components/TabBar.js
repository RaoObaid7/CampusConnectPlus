import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius, typography } from '../utils/designSystem';

const TabBar = ({ state, descriptors, navigation }) => {
  const { theme } = useTheme();
  
  return (
    <View style={[
      styles.container,
      {
        backgroundColor: theme.surface,
        borderTopColor: theme.border,
        ...theme.shadow.medium
      }
    ]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Get the tab icon from options
        const renderIcon = options.tabBarIcon ? 
          options.tabBarIcon({ focused: isFocused }) : 
          <Text style={styles.fallbackIcon}>📱</Text>;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[
              styles.tabButton,
              isFocused && {
                backgroundColor: theme.primaryLight + '15',
              }
            ]}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              {renderIcon}
              
              {isFocused && (
                <View 
                  style={[
                    styles.indicator, 
                    { backgroundColor: theme.primary }
                  ]} 
                />
              )}
            </View>
            
            <Text 
              style={[
                styles.label, 
                { 
                  color: isFocused ? theme.primary : theme.textSecondary,
                  fontWeight: isFocused ? typography.fontWeight.bold : typography.fontWeight.medium
                }
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 70,
    borderTopWidth: 1,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingBottom: spacing.sm,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.xs,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
  },
  indicator: {
    position: 'absolute',
    bottom: -spacing.xs - 2,
    width: 20,
    height: 3,
    borderRadius: borderRadius.full,
  },
  fallbackIcon: {
    fontSize: 20,
  }
});

export default TabBar;