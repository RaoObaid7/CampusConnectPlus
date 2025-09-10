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

const DEPARTMENTS = [
  'Computer Science',
  'Software Engineering', 
  'Information Technology',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Administration',
  'Economics',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Psychology',
  'English Literature',
  'Other'
];

const SignupScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createThemedStyles(theme);
  const { signUp, validateUniversityEmail, validDomains } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    studentId: '',
    department: '',
    password: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDepartments, setShowDepartments] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [touchedFields, setTouchedFields] = useState({});

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    
    // Real-time validation for touched fields
    if (touchedFields[key] && errors[key]) {
      validateField(key, value);
    }
  };

  const setFieldTouched = (field) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  const validateField = (field, value) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'fullName':
        if (!value.trim()) {
          newErrors.fullName = 'Full name is required';
        } else if (value.trim().length < 2) {
          newErrors.fullName = 'Full name must be at least 2 characters';
        } else {
          delete newErrors.fullName;
        }
        break;
        
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'University email is required';
        } else {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(value)) {
            newErrors.email = 'Please enter a valid email format';
          } else if (!validateUniversityEmail(value)) {
            newErrors.email = 'Please use your university email address (e.g., name.ID@iqra.edu.pk)';
          } else {
            delete newErrors.email;
          }
        }
        break;
        
      case 'studentId':
        if (!value.trim()) {
          newErrors.studentId = 'Student ID is required';
        } else if (value.trim().length < 3) {
          newErrors.studentId = 'Student ID must be at least 3 characters';
        } else {
          delete newErrors.studentId;
        }
        break;
        
      case 'department':
        if (!value) {
          newErrors.department = 'Please select your department';
        } else {
          delete newErrors.department;
        }
        break;
        
      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else if (value.length < 6) {
          newErrors.password = 'Password must be at least 6 characters long';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(value) && value.length < 8) {
          newErrors.password = 'For passwords under 8 characters, use both uppercase and lowercase letters';
        } else {
          delete newErrors.password;
          // Also validate confirm password if it exists
          if (formData.confirmPassword && value !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
          } else if (formData.confirmPassword && value === formData.confirmPassword) {
            delete newErrors.confirmPassword;
          }
        }
        break;
        
      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const validateForm = () => {
    const { fullName, email, studentId, department, password, confirmPassword } = formData;
    const newErrors = {};
    
    // Clear success message
    setSuccessMessage('');
    
    // Validate all fields
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }
    
    if (!email.trim()) {
      newErrors.email = 'University email is required';
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email format';
      } else if (!validateUniversityEmail(email)) {
        newErrors.email = 'Please use your university email address (e.g., name.ID@iqra.edu.pk)';
      }
    }
    
    if (!studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    } else if (studentId.trim().length < 3) {
      newErrors.studentId = 'Student ID must be at least 3 characters';
    }
    
    if (!department) {
      newErrors.department = 'Please select your department';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setErrors({}); // Clear any previous errors
      
      await signUp(formData);
      
      setSuccessMessage('Registration successful! Welcome to CampusConnect+! You are now logged in and will be redirected to your dashboard.');
      
    } catch (error) {
      const newErrors = {};
      
      // Handle specific error messages
      if (error.message.includes('email already exists') || error.message.includes('account with this email')) {
        newErrors.email = 'An account with this email already exists. Please use a different email or try signing in.';
      } else if (error.message.includes('student ID')) {
        newErrors.studentId = 'This student ID is already registered. Please check your ID or contact support.';
      } else if (error.message.includes('university email')) {
        newErrors.email = 'Please use your official university email address.';
      } else if (error.message.includes('network') || error.message.includes('connection')) {
        newErrors.general = 'Network error. Please check your internet connection and try again.';
      } else {
        newErrors.general = `Registration failed: ${error.message}. Please check your information and try again.`;
      }
      
      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
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

  const renderDepartmentPicker = () => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Department</Text>
      <TouchableOpacity
        style={[styles.input, {
          borderColor: errors.department ? theme.colors.error : theme.colors.border,
          borderWidth: errors.department ? 2 : 1,
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center'
        }]}
        onPress={() => setShowDepartments(!showDepartments)}
      >
        <Text style={[styles.inputText, {
          color: formData.department ? theme.colors.text : theme.colors.textSecondary
        }]}>
          {formData.department || 'Select your department'}
        </Text>
        <Text style={[styles.arrow, { color: theme.colors.textSecondary }]}>
          {showDepartments ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>
      
      {showDepartments && (
        <View style={styles.dropdown}>
          <ScrollView style={styles.dropdownScroll} nestedScrollEnabled={true}>
            {DEPARTMENTS.map((dept, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dropdownItem, {
                  backgroundColor: dept === formData.department ? theme.colors.primary : 'transparent',
                }]}
                onPress={() => {
                  updateFormData('department', dept);
                  setFieldTouched('department');
                  validateField('department', dept);
                  setShowDepartments(false);
                }}
              >
                <Text style={[styles.dropdownItemText, {
                  color: dept === formData.department ? '#FFFFFF' : theme.colors.text
                }]}>
                  {dept}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      {errors.department && renderErrorMessage(errors.department)}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>CampusConnect+</Text>
          <Text style={styles.tagline}>
            Join your campus community
          </Text>
        </View>

        {/* Signup Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Create Account</Text>
          <Text style={styles.formSubtitle}>
            Register with your university credentials
          </Text>

          {/* General Error Message */}
          {errors.general && renderErrorMessage(errors.general)}
          
          {/* Success Message */}
          {renderSuccessMessage()}

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={[styles.input, {
                borderColor: errors.fullName ? theme.colors.error : theme.colors.border,
                borderWidth: errors.fullName ? 2 : 1,
              }]}
              placeholder="Enter your full name"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.fullName}
              onChangeText={(value) => updateFormData('fullName', value)}
              onBlur={() => setFieldTouched('fullName')}
              autoCapitalize="words"
            />
            {errors.fullName && renderErrorMessage(errors.fullName)}
          </View>

          {/* University Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>University Email</Text>
            <TextInput
              style={[styles.input, {
                borderColor: errors.email ? theme.colors.error : theme.colors.border,
                borderWidth: errors.email ? 2 : 1,
              }]}
              placeholder="name.id@iqra.edu.pk"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              onBlur={() => setFieldTouched('email')}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.email && renderErrorMessage(errors.email)}
          </View>

          {/* Student ID */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Student ID</Text>
            <TextInput
              style={[styles.input, {
                borderColor: errors.studentId ? theme.colors.error : theme.colors.border,
                borderWidth: errors.studentId ? 2 : 1,
              }]}
              placeholder="Enter your student ID"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.studentId}
              onChangeText={(value) => updateFormData('studentId', value)}
              onBlur={() => setFieldTouched('studentId')}
              autoCapitalize="characters"
            />
            {errors.studentId && renderErrorMessage(errors.studentId)}
          </View>

          {/* Department Picker */}
          {renderDepartmentPicker()}

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, {
                  borderColor: errors.password ? theme.colors.error : theme.colors.border,
                  borderWidth: errors.password ? 2 : 1,
                  paddingRight: 50,
                }]}
                placeholder="Create a password (min 6 characters)"
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                onBlur={() => setFieldTouched('password')}
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

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, {
                  borderColor: errors.confirmPassword ? theme.colors.error : theme.colors.border,
                  borderWidth: errors.confirmPassword ? 2 : 1,
                  paddingRight: 50,
                }]}
                placeholder="Confirm your password"
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData('confirmPassword', value)}
                onBlur={() => setFieldTouched('confirmPassword')}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text style={[styles.eyeIcon, { color: theme.colors.textSecondary }]}>
                  {showConfirmPassword ? '🙈' : '👁️'}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && renderErrorMessage(errors.confirmPassword)}
          </View>

          {/* Signup Button */}
          <TouchableOpacity
            style={[styles.signupButton, {
              backgroundColor: theme.colors.primary,
              opacity: loading ? 0.7 : 1,
            }]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={[styles.signupButtonText, { marginLeft: 10 }]}>Creating Account...</Text>
              </View>
            ) : (
              <Text style={styles.signupButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Requirements Info */}
        <View style={styles.requirementsContainer}>
          <Text style={styles.requirementsTitle}>
            🎓 Student Verification Required
          </Text>
          <Text style={styles.requirementsText}>
            • Use your official university email (Accepted domains: @iqra.edu.pk, @comsats.edu.pk, @pu.edu.pk, @lums.edu.pk, @nust.edu.pk, and other verified universities){'\n'}
            • Provide your valid student ID (minimum 3 characters){'\n'}
            • Enter your full name (minimum 2 characters){'\n'}
            • Select your academic department{'\n'}
            • Create a secure password (minimum 6 characters)
          </Text>
          
          <View style={styles.helpSection}>
            <Text style={styles.helpTitle}>Need Help?</Text>
            <Text style={styles.helpText}>• Already have an account? Click "Sign In" above</Text>
            <Text style={styles.helpText}>• Invalid university email? Contact your registrar office</Text>
            <Text style={styles.helpText}>• Forgot your student ID? Check your student portal or ID card</Text>
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
    padding: theme.spacing.l,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.m,
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
  inputText: {
    fontSize: theme.typography.sizes.body,
  },
  arrow: {
    fontSize: 16,
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
  dropdown: {
    borderWidth: 1,
    borderRadius: theme.radii.m,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    marginTop: theme.spacing.xs,
    maxHeight: 200,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dropdownItemText: {
    fontSize: theme.typography.sizes.body,
  },
  signupButton: {
    padding: theme.spacing.m,
    borderRadius: theme.radii.m,
    alignItems: 'center',
    marginTop: theme.spacing.s,
    marginBottom: theme.spacing.l,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.bold,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textSecondary,
  },
  loginLink: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  requirementsContainer: {
    padding: theme.spacing.m,
    borderRadius: theme.radii.m,
    backgroundColor: theme.colors.surface,
  },
  requirementsTitle: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
  },
  requirementsText: {
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

export default SignupScreen;
