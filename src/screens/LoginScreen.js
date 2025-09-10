import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Button3D, { GradientButton3D, NeumorphicButton3D } from '../components/Button3D';
import Input3D, { FloatingLabelInput3D, GradientBorderInput3D } from '../components/Input3D';
import Card3D, { GlassCard3D, FloatingCard3D } from '../components/Card3D';
import { useScreenSize } from '../components/ResponsiveLayout';
import { spacing, borderRadius, typography, gradients } from '../utils/designSystem';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { validateUniversityEmail, login } = useAuth();
  const { isMobile } = useScreenSize();
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
    
    console.log('Login attempt with:', { email: email.trim(), password: password.length + ' chars' });
    
    // Validate form
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    try {
      setLoading(true);
      setErrors({}); // Clear any previous errors
      
      console.log('Attempting login...');
      const result = await login({ email: email.trim(), password });
      console.log('Login result:', result);
      
      // Show success message
      setSuccessMessage('Login successful! Redirecting to your dashboard...');
      
      // Navigation is handled by AuthProvider state change
    } catch (error) {
      console.error('Login error:', error);
      // Show specific error messages based on the error
      const newErrors = {};
      console.log('Error message:', error.message);
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

  // Left panel content (illustration and branding)
  const leftContent = (
    <View style={styles.leftPanel}>
      {/* Campus Illustration */}
      <View style={styles.illustrationContainer}>
        <LinearGradient
          colors={[theme.primaryLight, theme.primary, theme.secondaryLight]}
          style={styles.illustrationGradient}
        >
          <Text style={styles.campusEmoji}>🏢</Text>
          <Text style={styles.studentEmojis}>👩‍🎓👨‍🎓👩‍💻👨‍🔬</Text>
        </LinearGradient>
      </View>
      
      {/* Branding */}
      <View style={styles.brandingSection}>
        <GradientButton3D
          title="CampusConnect+"
          colors={[theme.primaryLight, theme.primary, theme.primaryDark]}
          size="large"
          style={styles.titleButton}
          textStyle={styles.appName}
          disabled
        />
        <Text style={[styles.tagline, { color: theme.textSecondary }]}>
          Connect with your campus community ✨
        </Text>
        
        {/* Features List */}
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🎆</Text>
            <Text style={[styles.featureText, { color: theme.textSecondary }]}>
              Discover campus events
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🤝</Text>
            <Text style={[styles.featureText, { color: theme.textSecondary }]}>
              Connect with students
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🏆</Text>
            <Text style={[styles.featureText, { color: theme.textSecondary }]}>
              Join competitions
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🤖</Text>
            <Text style={[styles.featureText, { color: theme.textSecondary }]}>
              AI recommendations
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  // Right panel content (login form)
  const rightContent = (
    <ScrollView 
      style={styles.rightPanel}
      contentContainerStyle={styles.rightPanelContent}
      showsVerticalScrollIndicator={false}
    >

          {/* Login Form with Glass Effect */}
          <GlassCard3D style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={[styles.formTitle, { color: theme.text }]}>Welcome Back! 👋</Text>
              <Text style={[styles.formSubtitle, { color: theme.textSecondary }]}>
                Sign in with your university email
              </Text>
            </View>

            {/* General Error Message */}
            {errors.general && renderErrorMessage(errors.general)}
            
            {/* Success Message */}
            {renderSuccessMessage()}

            {/* Email Input with 3D Effects */}
            <FloatingLabelInput3D
              label="University Email"
              placeholder="name.id@iqra.edu.pk"
              value={email}
              onChangeText={handleEmailChange}
              onBlur={() => setEmailTouched(true)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.email}
              gradientBorder={true}
              style={styles.inputContainer}
              icon={<Text style={styles.inputIcon}>📧</Text>}
            />

            {/* Password Input with 3D Effects */}
            <FloatingLabelInput3D
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={handlePasswordChange}
              onBlur={() => setPasswordTouched(true)}
              secureTextEntry={!showPassword}
              error={errors.password}
              gradientBorder={true}
              style={styles.inputContainer}
              icon={<Text style={styles.inputIcon}>🔒</Text>}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.eyeIcon}>
                    {showPassword ? '🙈' : '👁️'}
                  </Text>
                </TouchableOpacity>
              }
            />

            {/* Forgot Password */}
            <TouchableOpacity 
              onPress={handleForgotPassword}
              style={styles.forgotPasswordContainer}
            >
              <Text style={[styles.forgotPassword, { color: theme.primary }]}>
                Forgot Password? 🤔
              </Text>
            </TouchableOpacity>

            {/* Login Button with 3D Effect */}
            <GradientButton3D
              title={loading ? "Signing In..." : "Sign In 🚀"}
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              colors={[theme.primaryLight, theme.primary, theme.primaryDark]}
              size="large"
              style={styles.loginButton}
            />

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={[styles.signupText, { color: theme.textSecondary }]}>
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={[styles.signupLink, { color: theme.primary }]}>
                  Sign Up ✨
                </Text>
              </TouchableOpacity>
            </View>
          </GlassCard3D>

          {/* University Email Info */}
          <Card3D 
            variant="elevated" 
            size="medium" 
            style={styles.infoContainer}
          >
            <LinearGradient
              colors={[theme.info + '20', theme.primary + '10']}
              style={styles.infoGradient}
            >
              <Text style={[styles.infoTitle, { color: theme.text }]}>📧 University Email Required</Text>
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Only students with valid university email addresses can access CampusConnect+.
                Accepted domains include: @iqra.edu.pk, @comsats.edu.pk, @pu.edu.pk, @lums.edu.pk, @nust.edu.pk, and other verified university domains.
                This ensures a safe and secure campus community. 🛡️
              </Text>
              
              <View style={styles.helpSection}>
                <Text style={[styles.helpTitle, { color: theme.text }]}>Need Help? 🤝</Text>
                <Text style={[styles.helpText, { color: theme.textSecondary }]}>• Forgot your password? Click "Forgot Password?" above</Text>
                <Text style={[styles.helpText, { color: theme.textSecondary }]}>• Don't have an account? Click "Sign Up" above</Text>
                <Text style={[styles.helpText, { color: theme.textSecondary }]}>• Having trouble? Contact your university IT support</Text>
              </View>
            </LinearGradient>
          </Card3D>
    </ScrollView>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundSolid }]}>
      <SafeAreaView style={styles.safeArea}>
        {isMobile ? (
          // Mobile Layout - Vertical
          <ScrollView 
            style={styles.mobileContainer}
            contentContainerStyle={styles.mobileScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.mobileLeftPanel}>
              {leftContent}
            </View>
            <View style={styles.mobileRightPanel}>
              {rightContent}
            </View>
          </ScrollView>
        ) : (
          // Desktop Layout - Horizontal
          <View style={styles.desktopContainer}>
            <View style={styles.desktopLeftPanel}>
              {leftContent}
            </View>
            <View style={styles.desktopRightPanel}>
              {rightContent}
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  
  // Mobile Layout Styles
  mobileContainer: {
    flex: 1,
  },
  mobileScrollContent: {
    flexGrow: 1,
  },
  mobileLeftPanel: {
    minHeight: screenHeight * 0.4,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileRightPanel: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  
  // Desktop Layout Styles
  desktopContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  desktopLeftPanel: {
    flex: 1.2,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  desktopRightPanel: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    justifyContent: 'center',
  },
  
  // Left Panel Styles
  leftPanel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  illustrationContainer: {
    marginBottom: spacing['2xl'],
  },
  illustrationGradient: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  campusEmoji: {
    fontSize: 60,
    marginBottom: spacing.sm,
  },
  studentEmojis: {
    fontSize: 24,
    textAlign: 'center',
  },
  brandingSection: {
    alignItems: 'center',
  },
  titleButton: {
    marginBottom: spacing.md,
  },
  featuresList: {
    marginTop: spacing.xl,
    alignItems: 'flex-start',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  featureIcon: {
    fontSize: typography.fontSize.lg,
    marginRight: spacing.md,
    width: 30,
    textAlign: 'center',
  },
  featureText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 0.3,
  },
  
  // Right Panel Styles
  rightPanel: {
    flex: 1,
  },
  rightPanelContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  appName: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.black,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: typography.fontSize.md,
    textAlign: 'center',
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 0.5,
  },
  formContainer: {
    marginBottom: spacing.xl,
  },
  formHeader: {
    marginBottom: spacing.lg,
  },
  formTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing.xs,
    letterSpacing: 0.5,
  },
  formSubtitle: {
    fontSize: typography.fontSize.md,
    textAlign: 'center',
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 0.3,
  },
  inputContainer: {
    marginBottom: spacing.sm,
  },
  inputIcon: {
    fontSize: 18,
  },
  eyeIcon: {
    fontSize: 18,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotPassword: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 0.3,
  },
  loginButton: {
    marginBottom: spacing.lg,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  signupLink: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.3,
  },
  infoContainer: {
    marginTop: spacing.md,
  },
  infoGradient: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  infoTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
    letterSpacing: 0.3,
  },
  infoText: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * 1.5,
    fontWeight: typography.fontWeight.normal,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    fontWeight: typography.fontWeight.medium,
  },
  successContainer: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#2ecc71',
  },
  successText: {
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    fontWeight: typography.fontWeight.semibold,
  },
  helpSection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  helpTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
    letterSpacing: 0.3,
  },
  helpText: {
    fontSize: typography.fontSize.xs,
    lineHeight: typography.fontSize.xs * 1.4,
    marginBottom: spacing.xs,
    fontWeight: typography.fontWeight.normal,
  },
});

export default LoginScreen;
