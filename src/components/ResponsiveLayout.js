import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../utils/designSystem';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Breakpoints for responsive design
const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  large: 1200,
};

// Hook to get current screen size category
export const useScreenSize = () => {
  const isTablet = screenWidth >= breakpoints.tablet;
  const isDesktop = screenWidth >= breakpoints.desktop;
  const isLarge = screenWidth >= breakpoints.large;
  const isMobile = !isTablet;

  return {
    screenWidth,
    screenHeight,
    isMobile,
    isTablet,
    isDesktop,
    isLarge,
    breakpoints,
  };
};

// Split Layout Component (for login, profile pages)
export const SplitLayout = ({ 
  leftContent, 
  rightContent, 
  leftFlex = 1, 
  rightFlex = 1,
  direction = 'horizontal', // 'horizontal' or 'vertical'
  gap = spacing.lg,
  style = {}
}) => {
  const { theme } = useTheme();
  const { isMobile } = useScreenSize();
  
  // On mobile, always use vertical layout
  const layoutDirection = isMobile ? 'vertical' : direction;
  
  return (
    <View style={[
      styles.splitContainer,
      layoutDirection === 'horizontal' ? styles.horizontal : styles.vertical,
      { gap },
      style
    ]}>
      <View style={[
        styles.splitSection,
        layoutDirection === 'horizontal' 
          ? { flex: leftFlex }
          : { minHeight: screenHeight * 0.3 }
      ]}>
        {leftContent}
      </View>
      
      <View style={[
        styles.splitSection,
        layoutDirection === 'horizontal' 
          ? { flex: rightFlex }
          : { flex: 1 }
      ]}>
        {rightContent}
      </View>
    </View>
  );
};

// Sidebar Layout Component (for events, dashboard pages)
export const SidebarLayout = ({ 
  sidebar, 
  content, 
  sidebarWidth = 300,
  position = 'left', // 'left' or 'right'
  collapsible = true,
  style = {}
}) => {
  const { theme } = useTheme();
  const { isMobile, isTablet } = useScreenSize();
  
  // On mobile, sidebar becomes a top section
  if (isMobile) {
    return (
      <View style={[styles.mobileLayout, style]}>
        <View style={styles.mobileSidebar}>
          {sidebar}
        </View>
        <View style={styles.mobileContent}>
          {content}
        </View>
      </View>
    );
  }
  
  // Tablet and desktop layout
  return (
    <View style={[
      styles.sidebarContainer,
      position === 'right' && styles.sidebarRight,
      style
    ]}>
      {position === 'left' && (
        <View style={[
          styles.sidebar,
          { 
            width: isTablet ? sidebarWidth * 0.8 : sidebarWidth,
            backgroundColor: theme.surface,
            ...theme.shadow.small
          }
        ]}>
          {sidebar}
        </View>
      )}
      
      <View style={styles.mainContent}>
        {content}
      </View>
      
      {position === 'right' && (
        <View style={[
          styles.sidebar,
          { 
            width: isTablet ? sidebarWidth * 0.8 : sidebarWidth,
            backgroundColor: theme.surface,
            ...theme.shadow.small
          }
        ]}>
          {sidebar}
        </View>
      )}
    </View>
  );
};

// Grid Layout Component
export const GridLayout = ({ 
  children, 
  columns = 2, 
  gap = spacing.md,
  style = {}
}) => {
  const { isMobile, isTablet } = useScreenSize();
  
  // Responsive columns
  const responsiveColumns = isMobile ? 1 : isTablet ? Math.min(columns, 2) : columns;
  const itemWidth = (100 / responsiveColumns) - (gap * (responsiveColumns - 1)) / responsiveColumns;
  
  return (
    <View style={[styles.gridContainer, { gap }, style]}>
      {React.Children.map(children, (child, index) => (
        <View 
          key={index}
          style={[
            styles.gridItem,
            { width: `${itemWidth}%` }
          ]}
        >
          {child}
        </View>
      ))}
    </View>
  );
};

// Stack Layout Component
export const StackLayout = ({ 
  children, 
  spacing: stackSpacing = spacing.md,
  style = {}
}) => {
  return (
    <View style={[styles.stackContainer, { gap: stackSpacing }, style]}>
      {children}
    </View>
  );
};

// Responsive Container Component
export const ResponsiveContainer = ({ 
  children, 
  maxWidth = 1200,
  padding = spacing.md,
  style = {}
}) => {
  const { screenWidth } = useScreenSize();
  
  const containerWidth = Math.min(screenWidth - (padding * 2), maxWidth);
  
  return (
    <View style={[
      styles.responsiveContainer,
      { 
        width: containerWidth,
        paddingHorizontal: padding,
        alignSelf: 'center'
      },
      style
    ]}>
      {children}
    </View>
  );
};

// Card Grid Component
export const CardGrid = ({ 
  data = [], 
  renderItem, 
  columns = 2,
  gap = spacing.md,
  style = {}
}) => {
  const { isMobile, isTablet } = useScreenSize();
  
  const responsiveColumns = isMobile ? 1 : isTablet ? Math.min(columns, 2) : columns;
  
  return (
    <GridLayout columns={responsiveColumns} gap={gap} style={style}>
      {data.map((item, index) => renderItem(item, index))}
    </GridLayout>
  );
};

// Adaptive Layout Hook
export const useAdaptiveLayout = () => {
  const screenInfo = useScreenSize();
  
  const getLayoutProps = (component) => {
    switch (component) {
      case 'sidebar':
        return {
          sidebarWidth: screenInfo.isLarge ? 350 : screenInfo.isTablet ? 280 : 250,
          collapsible: screenInfo.isMobile,
        };
      case 'grid':
        return {
          columns: screenInfo.isMobile ? 1 : screenInfo.isTablet ? 2 : 3,
          gap: screenInfo.isMobile ? spacing.sm : spacing.md,
        };
      case 'split':
        return {
          direction: screenInfo.isMobile ? 'vertical' : 'horizontal',
          leftFlex: screenInfo.isMobile ? 1 : 1.2,
          rightFlex: 1,
        };
      default:
        return {};
    }
  };
  
  return {
    ...screenInfo,
    getLayoutProps,
  };
};

const styles = StyleSheet.create({
  // Split Layout Styles
  splitContainer: {
    flex: 1,
  },
  horizontal: {
    flexDirection: 'row',
  },
  vertical: {
    flexDirection: 'column',
  },
  splitSection: {
    // Flex will be applied dynamically
  },
  
  // Sidebar Layout Styles
  sidebarContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebarRight: {
    flexDirection: 'row-reverse',
  },
  sidebar: {
    borderRadius: borderRadius.lg,
    margin: spacing.sm,
    padding: spacing.md,
  },
  mainContent: {
    flex: 1,
  },
  
  // Mobile Layout Styles
  mobileLayout: {
    flex: 1,
  },
  mobileSidebar: {
    maxHeight: screenHeight * 0.35,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  mobileContent: {
    flex: 1,
  },
  
  // Grid Layout Styles
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    marginBottom: spacing.md,
  },
  
  // Stack Layout Styles
  stackContainer: {
    flexDirection: 'column',
  },
  
  // Responsive Container Styles
  responsiveContainer: {
    flex: 1,
  },
});

export default {
  SplitLayout,
  SidebarLayout,
  GridLayout,
  StackLayout,
  ResponsiveContainer,
  CardGrid,
  useScreenSize,
  useAdaptiveLayout,
};
