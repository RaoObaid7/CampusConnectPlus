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
  const styles = createThemedStyles(theme);
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
      <Text style={styles.errorText}>
        ⚠️ {error}
      </Text>
    );
  };

  const renderSuccessMessage = () => {
    if (!successMessage) return null;
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successText}>
          ✅ {successMessage}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>CampusConnect+</Text>
          <Text style={styles.tagline}>
            Connect with your campus community
          </Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Welcome Back!</Text>
          <Text style={styles.formSubtitle}>
            Sign in with your university email
          </Text>

          {/* General Error Message */}
          {errors.general && renderErrorMessage(errors.general)}
          
          {/* Success Message */}
          {renderSuccessMessage()}

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>University Email</Text>
            <TextInput
              style={[styles.input, {
                borderColor: errors.email ? theme.colors.error : theme.colors.border,
                borderWidth: errors.email ? 2 : 1,
              }]}
              placeholder="name.id@iqra.edu.pk"
              placeholderTextColor={theme.colors.textSecondary}
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
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, {
                  borderColor: errors.password ? theme.colors.error : theme.colors.border,
                  borderWidth: errors.password ? 2 : 1,
                  paddingRight: 50,
                }]}
                placeholder="Enter your password"
                placeholderTextColor={theme.colors.textSecondary}
                value={password}
                onChangeText={handlePasswordChange}
                onBlur={() => setPasswordTouched(true)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={[styles.eyeIcon, { color: theme.colors.textSecondary }]}>
                  {showPassword ? '🙈' : '👁️'}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.password && renderErrorMessage(errors.password)}
          </View>

          {/* Forgot Password */}
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPassword}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, { 
              backgroundColor: theme.colors.primary,
              opacity: loading ? 0.7 : 1,
            }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={[styles.loginButtonText, { marginLeft: 10 }]}>Signing In...</Text>
              </View>
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>
              Don't have an account?{' '}
            </.Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* University Email Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>📧 University Email Required</Text>
          <Text style={styles.infoText}>
            Only students with valid university email addresses can access CampusConnect+.
            Accepted domains include: @iqra.edu.pk, @comsats.edu.pk, @pu.edu.pk, @lums.edu.pk, @nust.edu.pk, and other verified university domains.
            This ensures a safe and secure campus community.
          </Text>
          
          <View style={styles.helpSection}>
            <Text style={styles.helpTitle}>Need Help?</Text>
            <Text style={styles.helpText}>• Forgot your password? Click "Forgot Password?" above</Text>
            <Text style={styles.helpText}>• Don't have an account? Click "Sign Up" above</Text>
            <Text style={styles.helpText}>• Having trouble? Contact your university IT support</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createThemedStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.l,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  appName: {
    fontSize: theme.typography.sizes.h1,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.s,
  },
  tagline: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    padding: theme.spacing.l,
    borderRadius: theme.radii.l,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.l,
    ...theme.elevation.medium,
  },
  formTitle: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.weights.bold,
    textAlign: 'center',
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
  },
  formSubtitle: {
    fontSize: theme.typography.sizes.body,
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.l,
  },
  inputGroup: {
    marginBottom: theme.spacing.m,
  },
  inputLabel: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
  },
  input: {
    borderWidth: 1,
    borderRadius: theme.radii.m,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    fontSize: theme.typography.sizes.body,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeButton: {
    position: 'absolute',
    right: theme.spacing.m,
    top: theme.spacing.s,
    padding: theme.spacing.xs,
  },
  eyeIcon: {
    fontSize: 20,
  },
  forgotPassword: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.primary,
    textAlign: 'right',
    marginBottom: theme.spacing.l,
  },
  loginButton: {
    padding: theme.spacing.m,
    borderRadius: theme.radii.m,
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.bold,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textSecondary,
  },
  signupLink: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  infoContainer: {
    padding: theme.spacing.m,
    borderRadius: theme.radii.m,
    backgroundColor: theme.colors.surface,
    marginTop: theme.spacing.m,
  },
  infoTitle: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
  },
  infoText: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  errorText: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.s,
  },
  successContainer: {
    padding: theme.spacing.s,
    borderRadius: theme.radii.m,
    marginBottom: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.success,
    backgroundColor: `${theme.colors.success}1A`, // Add opacity
  },
  successText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.success,
    textAlign: 'center',
    fontWeight: theme.typography.weights.medium,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpSection: {
    marginTop: theme.spacing.m,
    paddingTop: theme.spacing.m,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  helpTitle: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
  },
  helpText: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: theme.spacing.xs,
  },
});

export default LoginScreen;
