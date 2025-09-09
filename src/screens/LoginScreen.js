import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  SafeAreaView, 
  ScrollView,
  ActivityIndicator 
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { login, validateUniversityEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    // Clear previous messages
    setSuccessMessage('');
    
    // Email validation
    if (!email.trim()) {
      newErrors.email = 'University email address is required';
    } else if (!validateUniversityEmail(email)) {
      newErrors.email = 'Please use a valid university email address (e.g., name.ID@iqra.edu.pk)';
    } else {
      // Check email format more specifically
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email format';
      }
    }
    
    // Password validation
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    // Clear any previous success messages
    setSuccessMessage('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrors({}); // Clear any previous errors
      
      await login({ email: email.trim(), password });
      
      // Show success message
      setSuccessMessage('Login successful! Redirecting to your dashboard...');
      
      // Navigation is handled by AuthProvider state change
    } catch (error) {
      // Show specific error messages based on the error
      const newErrors = {};
      
      if (error.message.includes('No account found')) {
        newErrors.email = 'No account exists with this email address. Please sign up first.';
      } else if (error.message.includes('Invalid password')) {
        newErrors.password = 'Incorrect password. Please try again.';
      } else if (error.message.includes('network') || error.message.includes('connection')) {
        newErrors.general = 'Network error. Please check your internet connection and try again.';
      } else {
        newErrors.general = 'Login failed. Please check your credentials and try again.';
      }
      
      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if (emailTouched && errors.email) {
      // Real-time validation for better UX
      const newErrors = { ...errors };
      if (text.trim() && validateUniversityEmail(text)) {
        delete newErrors.email;
        setErrors(newErrors);
      }
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (passwordTouched && errors.password) {
      // Real-time validation for better UX
      const newErrors = { ...errors };
      if (text.trim() && text.length >= 6) {
        delete newErrors.password;
        setErrors(newErrors);
      }
    }
  };

  const handleForgotPassword = () => {
    setErrors({});
    setSuccessMessage('For password reset assistance, please contact your university IT department or visit the student services office.');
  };

  const renderErrorMessage = (error) => {
    if (!error) return null;
    return (
      <Text style={[styles.errorText, { color: theme.error || '#e74c3c' }]}>
        ⚠️ {error}
      </Text>
    );
  };

  const renderSuccessMessage = () => {
    if (!successMessage) return null;
    return (
      <View style={[styles.successContainer, { backgroundColor: theme.success || '#2ecc71', opacity: 0.1 }]}>
        <Text style={[styles.successText, { color: theme.success || '#2ecc71' }]}>
          ✅ {successMessage}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.appName, { color: theme.primary }]}>CampusConnect+</Text>
          <Text style={[styles.tagline, { color: theme.textSecondary }]}>
            Connect with your campus community
          </Text>
        </View>

        {/* Login Form */}
        <View style={[styles.formContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.formTitle, { color: theme.text }]}>Welcome Back!</Text>
          <Text style={[styles.formSubtitle, { color: theme.textSecondary }]}>
            Sign in with your university email
          </Text>

          {/* General Error Message */}
          {errors.general && renderErrorMessage(errors.general)}
          
          {/* Success Message */}
          {renderSuccessMessage()}

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>University Email</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.surface, 
                color: theme.text,
                borderColor: errors.email ? (theme.error || '#e74c3c') : theme.border,
                borderWidth: errors.email ? 2 : 1
              }]}
              placeholder="name.id@iqra.edu.pk"
              placeholderTextColor={theme.textSecondary}
              value={email}
              onChangeText={handleEmailChange}
              onBlur={() => setEmailTouched(true)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.email && renderErrorMessage(errors.email)}
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.surface, 
                  color: theme.text,
                  borderColor: errors.password ? (theme.error || '#e74c3c') : theme.border,
                  borderWidth: errors.password ? 2 : 1,
                  paddingRight: 50
                }]}
                placeholder="Enter your password"
                placeholderTextColor={theme.textSecondary}
                value={password}
                onChangeText={handlePasswordChange}
                onBlur={() => setPasswordTouched(true)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={[styles.eyeIcon, { color: theme.textSecondary }]}>
                  {showPassword ? '🙈' : '👁️'}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.password && renderErrorMessage(errors.password)}
          </View>

          {/* Forgot Password */}
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={[styles.forgotPassword, { color: theme.primary }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, { 
              backgroundColor: theme.primary,
              opacity: loading ? 0.7 : 1 
            }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={[styles.loginButtonText, { marginLeft: 10 }]}>Signing In...</Text>
              </View>
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={[styles.signupText, { color: theme.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={[styles.signupLink, { color: theme.primary }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* University Email Info */}
        <View style={[styles.infoContainer, { backgroundColor: theme.surface }]}>
          <Text style={[styles.infoTitle, { color: theme.text }]}>📧 University Email Required</Text>
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            Only students with valid university email addresses can access CampusConnect+.
            Accepted domains include: @iqra.edu.pk, @comsats.edu.pk, @pu.edu.pk, @lums.edu.pk, @nust.edu.pk, and other verified university domains.
            This ensures a safe and secure campus community.
          </Text>
          
          <View style={styles.helpSection}>
            <Text style={[styles.helpTitle, { color: theme.text }]}>Need Help?</Text>
            <Text style={[styles.helpText, { color: theme.textSecondary }]}>• Forgot your password? Click "Forgot Password?" above</Text>
            <Text style={[styles.helpText, { color: theme.textSecondary }]}>• Don't have an account? Click "Sign Up" above</Text>
            <Text style={[styles.helpText, { color: theme.textSecondary }]}>• Having trouble? Contact your university IT support</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
  },
  formContainer: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 12,
    padding: 4,
  },
  eyeIcon: {
    fontSize: 20,
  },
  forgotPassword: {
    fontSize: 16,
    textAlign: 'right',
    marginBottom: 24,
  },
  loginButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 16,
  },
  signupLink: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  errorText: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
  },
  successContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2ecc71',
  },
  successText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
});

export default LoginScreen;
