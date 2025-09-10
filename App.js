import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import HomeScreen from './src/screens/HomeScreen';
import EventDetailsScreen from './src/screens/EventDetailsScreen';
import SocialFeedScreen from './src/screens/SocialFeedScreen';
import FeedbackScreen from './src/screens/FeedbackScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ThemeToggleButton = () => {
  const { toggleTheme, isDarkMode } = useTheme();
  
  return (
    <TouchableOpacity 
      onPress={toggleTheme}
      style={{ marginRight: 15, padding: 8 }}
    >
      <Text style={{ fontSize: 20 }}>
        {isDarkMode ? '☀️' : '🌙'}
      </Text>
    </TouchableOpacity>
  );
};

const LogoutButton = () => {
  const { logout, user } = useAuth();
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity 
      onPress={logout}
      style={{ marginRight: 15, padding: 8 }}
    >
      <Text style={{ fontSize: 16, color: theme.colors.text }}>
        👋 {user?.fullName?.split(' ')[0]}
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
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: theme.typography.weights.bold,
          fontSize: theme.typography.sizes.h3,
        },
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{
          title: 'Events',
          tabBarLabel: 'Events',
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color: color }}>📅</Text>,
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemeToggleButton />
              <LogoutButton />
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
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color: color }}>💬</Text>,
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemeToggleButton />
              <LogoutButton />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: theme.colors.background
      }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ 
          marginTop: theme.spacing.m,
          fontSize: theme.typography.sizes.body,
          color: theme.colors.text
        }}>
          Loading CampusConnect+...
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: theme.typography.weights.bold,
            fontSize: theme.typography.sizes.h3,
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
              }}
            />
            <Stack.Screen
              name="Feedback"
              component={FeedbackScreen}
              options={{
                title: 'Event Feedback',
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
                headerRight: () => <ThemeToggleButton />,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
