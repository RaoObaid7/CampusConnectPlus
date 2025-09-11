import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { spacing, borderRadius } from '../utils/designSystem';
import { getResponsiveValue } from '../utils/responsive';
import Button from '../components/Button';
import Input from '../components/Input';
import Background from '../components/Background';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setSuccessMessage('');
    
    try {
      await login({ email, password });
      setSuccessMessage('Login successful!');
      // Navigation is handled by AuthContext
    } catch (error) {
      setErrors({ general: error.message || 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Password reset feature will be available soon. Please contact support at support@campusconnect.edu',
      [{ text: 'OK' }]
    );
  };

  return (
    <Background variant="gradient">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/icon.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.appName, { color: theme.textLight }]}>
              CampusConnectPlus
            </Text>
          </View>
          
          <View style={[
            styles.formContainer, 
            { backgroundColor: theme.backgroundElevated, ...theme.shadow.md }
          ]}>
            <Text style={[styles.title, { color: theme.text }]}>
              Welcome Back
            </Text>
            
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Sign in to continue
            </Text>
            
            {errors.general && (
              <View style={[styles.errorContainer, { backgroundColor: theme.errorLight }]}>
                <Text style={[styles.errorText, { color: theme.error }]}>
                  {errors.general}
                </Text>
              </View>
            )}
            
            {successMessage && (
              <View style={[styles.successContainer, { backgroundColor: theme.successLight }]}>
                <Text style={[styles.successText, { color: theme.success }]}>
                  {successMessage}
                </Text>
              </View>
            )}
            
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              error={errors.password}
            />
            
            <TouchableOpacity 
              onPress={handleForgotPassword}
              style={styles.forgotPasswordContainer}
            >
              <Text style={[styles.forgotPasswordText, { color: theme.primary }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
            
            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
              variant="filled"
              size="lg"
            />
            
            <View style={styles.signupContainer}>
              <Text style={[styles.signupText, { color: theme.textSecondary }]}>
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={[styles.signupLink, { color: theme.primary }]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: spacing.sm,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  errorContainer: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  errorText: {
    fontSize: 14,
  },
  successContainer: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  successText: {
    fontSize: 14,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: spacing.md,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  loginButton: {
    width: '100%',
    marginTop: spacing.sm,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  signupText: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;
