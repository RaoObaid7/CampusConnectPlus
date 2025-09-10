import React, { useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { spacing, borderRadius, typography } from './src/utils/designSystem';
import HomeScreen from './src/screens/HomeScreen';
import EventDetailsScreen from './src/screens/EventDetailsScreen';
import SocialFeedScreen from './src/screens/SocialFeedScreen';
import FeedbackScreen from './src/screens/FeedbackScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ThemeToggleButton = () => {
  const { toggleTheme, isDarkMode, theme } = useTheme();
  
  return (
    <TouchableOpacity 
      onPress={toggleTheme}
      style={[
        styles.headerButton,
        {
          backgroundColor: theme.primary + '20',
          ...theme.shadow.small
        }
      ]}
    >
      <Text style={[styles.headerButtonText, { fontSize: 18 }]}>
        {isDarkMode ? '☀️' : '🌙'}
      </Text>
    </TouchableOpacity>
  );
};

const UserProfileButton = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  const handleProfilePress = () => {
    navigation.navigate('ProfileTab');
  };
  
  return (
    <TouchableOpacity 
      onPress={handleProfilePress}
      style={[
        styles.headerButton,
        styles.profileButton,
        {
          backgroundColor: theme.secondary + '20',
          ...theme.shadow.small
        }
      ]}
    >
      <Text style={[
        styles.headerButtonText,
        { color: theme.text, fontSize: typography.fontSize.sm }
      ]}>
        👋 {user?.fullName?.split(' ')[0]}
      </Text>
    </TouchableOpacity>
  );
};

const BackButton = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };
  
  return (
    <TouchableOpacity 
      onPress={handleBackPress}
      style={[
        styles.headerButton,
        styles.backButton,
        {
          backgroundColor: theme.primary + '20',
          ...theme.shadow.small
        }
      ]}
    >
      <Text style={[
        styles.headerButtonText,
        { color: theme.primary, fontSize: typography.fontSize.lg }
      ]}>
        ← Back
      </Text>
    </TouchableOpacity>
  );
};

const HomeButton = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  const handleHomePress = () => {
    navigation.navigate('HomeTab');
  };
  
  return (
    <TouchableOpacity 
      onPress={handleHomePress}
      style={[
        styles.headerButton,
        styles.homeButton,
        {
          backgroundColor: theme.success + '20',
          ...theme.shadow.small
        }
      ]}
    >
      <Text style={[
        styles.headerButtonText,
        { color: theme.success, fontSize: typography.fontSize.lg }
      ]}>
        🏠 Home
      </Text>
    </TouchableOpacity>
  );
};

const TabNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: 'transparent',
          ...theme.shadow.medium,
          borderRadius: borderRadius.xl,
          marginHorizontal: spacing.sm,
          marginBottom: spacing.sm,
          height: 70,
          paddingBottom: spacing.sm,
          paddingTop: spacing.sm,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarLabelStyle: {
          fontSize: typography.fontSize.xs,
          fontWeight: typography.fontWeight.semibold,
          letterSpacing: 0.3,
        },
        headerStyle: {
          backgroundColor: theme.surface,
          ...theme.shadow.small,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: typography.fontWeight.bold,
          fontSize: typography.fontSize.lg,
          letterSpacing: 0.5,
        },
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{
          title: 'Campus Events',
          tabBarLabel: 'Events',
          tabBarIcon: ({ focused }) => (
            <View style={[
              styles.tabIcon,
              focused && {
                backgroundColor: theme.primary + '20',
                ...theme.shadow.small
              }
            ]}>
              <Text style={[styles.tabIconText, { fontSize: focused ? 22 : 20 }]}>📅</Text>
            </View>
          ),
          headerRight: () => (
            <View style={styles.headerButtonContainer}>
              <ThemeToggleButton />
              <UserProfileButton />
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="SocialTab" 
        component={SocialFeedScreen}
        options={{
          title: 'Social Feed',
          tabBarLabel: 'Social',
          tabBarIcon: ({ focused }) => (
            <View style={[
              styles.tabIcon,
              focused && {
                backgroundColor: theme.primary + '20',
                ...theme.shadow.small
              }
            ]}>
              <Text style={[styles.tabIconText, { fontSize: focused ? 22 : 20 }]}>💬</Text>
            </View>
          ),
          headerRight: () => (
            <View style={styles.headerButtonContainer}>
              <ThemeToggleButton />
              <UserProfileButton />
            </View>
          ),
        }}
      />
      
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen}
        options={{
          title: 'Profile & Settings',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => (
            <View style={[
              styles.tabIcon,
              focused && {
                backgroundColor: theme.primary + '20',
                ...theme.shadow.small
              }
            ]}>
              <Text style={[styles.tabIconText, { fontSize: focused ? 22 : 20 }]}>👤</Text>
            </View>
          ),
          headerLeft: () => <HomeButton />,
          headerRight: () => (
            <View style={styles.headerButtonContainer}>
              <ThemeToggleButton />
              <UserProfileButton />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppContent = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const { theme } = useTheme();
  
  // Debug authentication state
  console.log('AppContent render - isAuthenticated:', isAuthenticated, 'loading:', loading, 'user:', user?.email);
  
  useEffect(() => {
    console.log('Auth state changed - isAuthenticated:', isAuthenticated, 'user:', user?.email);
  }, [isAuthenticated, user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={[theme.primaryLight + '20', theme.secondaryLight + '20', theme.backgroundSolid]}
          style={styles.loadingGradient}
        />
        <View style={[
          styles.loadingContent,
          {
            backgroundColor: theme.surface,
            ...theme.shadow.large
          }
        ]}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[
            styles.loadingText,
            { color: theme.text }
          ]}>
            Loading CampusConnect+... ✨
          </Text>
        </View>
      </View>
    );
  }

  return (
    <NavigationContainer key={isAuthenticated ? 'auth' : 'noauth'}>
      <Stack.Navigator
        key={isAuthenticated ? 'authenticated' : 'unauthenticated'}
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.surface,
          },
          headerTintColor: theme.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name="MainTabs"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EventDetails"
              component={EventDetailsScreen}
              options={{
                title: 'Event Details',
                headerLeft: () => <BackButton />,
                headerRight: () => (
                  <View style={styles.headerButtonContainer}>
                    <ThemeToggleButton />
                    <UserProfileButton />
                  </View>
                ),
              }}
            />
            <Stack.Screen
              name="Feedback"
              component={FeedbackScreen}
              options={{
                title: 'Event Feedback',
                headerLeft: () => <BackButton />,
                headerRight: () => (
                  <View style={styles.headerButtonContainer}>
                    <ThemeToggleButton />
                    <UserProfileButton />
                  </View>
                ),
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{
                title: 'Create Account',
                headerLeft: () => <BackButton />,
                headerRight: () => <ThemeToggleButton />,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerButton: {
    marginRight: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  headerButtonText: {
    fontWeight: typography.fontWeight.semibold,
  },
  profileButton: {
    paddingHorizontal: spacing.md,
  },
  backButton: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  homeButton: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  headerButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconText: {
    // No additional styles needed
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loadingContent: {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 0.3,
  },
});

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
