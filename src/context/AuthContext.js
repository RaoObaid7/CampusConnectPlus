import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AUTH_STORAGE_KEY = 'user_auth';
const USERS_STORAGE_KEY = 'registered_users';

// List of valid university email domains
const VALID_UNIVERSITY_DOMAINS = [
  '@iqra.edu.pk',
  '@student.university.edu',
  '@stu.university.edu', 
  '@university.edu.pk',
  '@ccp.edu.pk',
  '@student.ccp.edu.pk',
  '@comsats.edu.pk',
  '@pu.edu.pk',
  '@lums.edu.pk',
  '@nust.edu.pk'
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedAuth = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (storedAuth) {
        const userData = JSON.parse(storedAuth);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // Create a default test user for development
        await createDefaultTestUser();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultTestUser = async () => {
    try {
      const existingUsers = await getStoredUsers();
      const testEmail = 'test.123@iqra.edu.pk';
      
      if (!existingUsers[testEmail]) {
        const testUser = {
          id: 'test_user_123',
          email: testEmail,
          fullName: 'Test Student',
          studentId: 'TEST123',
          department: 'Computer Science',
          university: 'IQRA University',
          major: 'Computer Science',
          year: '3rd Year',
          registeredAt: new Date().toISOString(),
          password: 'test123' // In production, this should be hashed
        };
        
        const updatedUsers = {
          ...existingUsers,
          [testEmail]: testUser
        };
        
        await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
        console.log('Test user created:', testEmail, 'password: test123');
      }
    } catch (error) {
      console.error('Error creating test user:', error);
    }
  };

  const validateUniversityEmail = (email) => {
    return VALID_UNIVERSITY_DOMAINS.some(domain => 
      email.toLowerCase().endsWith(domain.toLowerCase())
    );
  };

  const signUp = async (userData) => {
    try {
      const { email, password, fullName, studentId, department } = userData;
      
      // Validate university email
      if (!validateUniversityEmail(email)) {
        throw new Error('Please use your university email address to register');
      }

      // Check if user already exists
      const existingUsers = await getStoredUsers();
      if (existingUsers[email]) {
        throw new Error('An account with this email already exists');
      }

      // Validate password strength
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email: email.toLowerCase(),
        fullName,
        studentId,
        department,
        registeredAt: new Date().toISOString(),
        profilePicture: null
      };

      // Store user credentials (In production, password should be hashed)
      const updatedUsers = {
        ...existingUsers,
        [email.toLowerCase()]: {
          ...newUser,
          password // In production, this should be hashed
        }
      };

      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      
      // Auto-login after signup
      await login({ email, password });
      
      return { success: true, user: newUser };
    } catch (error) {
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const { email, password } = credentials;
      
      // Get stored users
      const existingUsers = await getStoredUsers();
      const user = existingUsers[email.toLowerCase()];

      if (!user) {
        throw new Error('No account found with this email address');
      }

      if (user.password !== password) {
        throw new Error('Invalid password');
      }

      // Remove password from user object for storage
      const { password: _, ...userWithoutPassword } = user;
      
      // Store auth session
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithoutPassword));
      
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Logout function called');
      setLoading(true);
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      console.log('Auth storage cleared');
      setUser(null);
      setIsAuthenticated(false);
      console.log('User state reset, isAuthenticated set to false');
      // Small delay to ensure state changes are propagated
      setTimeout(() => {
        setLoading(false);
      }, 100);
    } catch (error) {
      console.error('Error logging out:', error);
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');

      const updatedUser = { ...user, ...updates };
      
      // Update in auth storage
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
      
      // Update in users storage
      const existingUsers = await getStoredUsers();
      if (existingUsers[user.email]) {
        existingUsers[user.email] = { ...existingUsers[user.email], ...updates };
        await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(existingUsers));
      }
      
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  const getStoredUsers = async () => {
    try {
      const users = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      return users ? JSON.parse(users) : {};
    } catch (error) {
      console.error('Error getting stored users:', error);
      return {};
    }
  };

  const resetPassword = async (email) => {
    try {
      const existingUsers = await getStoredUsers();
      const user = existingUsers[email.toLowerCase()];

      if (!user) {
        throw new Error('No account found with this email address');
      }

      // In a real app, this would send an email
      // For demo, we'll just return a success message
      return { 
        success: true, 
        message: 'Password reset instructions have been sent to your email' 
      };
    } catch (error) {
      throw error;
    }
  };

  const updateUserPreferences = async (preferences) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const updatedUser = { ...user, preferences };
      
      // Update in auth storage
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
      
      // Update in users storage
      const existingUsers = await getStoredUsers();
      if (existingUsers[user.email]) {
        existingUsers[user.email] = { ...existingUsers[user.email], preferences };
        await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(existingUsers));
      }
      
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signUp,
    logout,
    updateProfile,
    updateUserPreferences,
    resetPassword,
    validateUniversityEmail,
    validDomains: VALID_UNIVERSITY_DOMAINS
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
