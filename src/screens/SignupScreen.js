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
      <Text style={[styles.errorText, { color: theme.error }]}>
        ⚠️ {error}
      </Text>
    );
  };

  const renderSuccessMessage = () => {
    if (!successMessage) return null;
    return (
      <View style={[styles.successContainer, { backgroundColor: theme.success, opacity: 0.1 }]}>
        <Text style={[styles.successText, { color: theme.success }]}>
          ✅ {successMessage}
        </Text>
      </View>
    );
  };

  const renderDepartmentPicker = () => (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: theme.text }]}>Department</Text>
      <TouchableOpacity
        style={[styles.input, { 
          backgroundColor: theme.surface, 
          borderColor: errors.department ? theme.error : theme.border,
          borderWidth: errors.department ? 2 : 1,
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center'
        }]}
        onPress={() => setShowDepartments(!showDepartments)}
      >
        <Text style={[styles.inputText, { 
          color: formData.department ? theme.text : theme.textSecondary 
        }]}>
          {formData.department || 'Select your department'}
        </Text>
        <Text style={[styles.arrow, { color: theme.textSecondary }]}>
          {showDepartments ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>
      
      {showDepartments && (
        <View style={[styles.dropdown, { 
          backgroundColor: theme.card, 
          borderColor: theme.border 
        }]}>
          <ScrollView style={styles.dropdownScroll} nestedScrollEnabled={true}>
            {DEPARTMENTS.map((dept, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dropdownItem, { 
                  backgroundColor: dept === formData.department ? theme.primary : 'transparent',
                  borderBottomColor: theme.border
                }]}
                onPress={() => {
                  updateFormData('department', dept);
                  setFieldTouched('department');
                  validateField('department', dept);
                  setShowDepartments(false);
                }}
              >
                <Text style={[styles.dropdownItemText, { 
                  color: dept === formData.department ? '#fff' : theme.text 
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.appName, { color: theme.primary }]}>CampusConnect+</Text>
          <Text style={[styles.tagline, { color: theme.textSecondary }]}>
            Join your campus community
          </Text>
        </View>

        {/* Signup Form */}
        <View style={[styles.formContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.formTitle, { color: theme.text }]}>Create Account</Text>
          <Text style={[styles.formSubtitle, { color: theme.textSecondary }]}>
            Register with your university credentials
          </Text>

          {/* General Error Message */}
          {errors.general && renderErrorMessage(errors.general)}
          
          {/* Success Message */}
          {renderSuccessMessage()}

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Full Name</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.surface, 
                color: theme.text,
                borderColor: errors.fullName ? theme.error : theme.border,
                borderWidth: errors.fullName ? 2 : 1
              }]}
              placeholder="Enter your full name"
              placeholderTextColor={theme.textSecondary}
              value={formData.fullName}
              onChangeText={(value) => updateFormData('fullName', value)}
              onBlur={() => setFieldTouched('fullName')}
              autoCapitalize="words"
            />
            {errors.fullName && renderErrorMessage(errors.fullName)}
          </View>

          {/* University Email */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>University Email</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.surface, 
                color: theme.text,
                borderColor: errors.email ? theme.error : theme.border,
                borderWidth: errors.email ? 2 : 1
              }]}
              placeholder="name.id@iqra.edu.pk"
              placeholderTextColor={theme.textSecondary}
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
            <Text style={[styles.inputLabel, { color: theme.text }]}>Student ID</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.surface, 
                color: theme.text,
                borderColor: errors.studentId ? theme.error : theme.border,
                borderWidth: errors.studentId ? 2 : 1
              }]}
              placeholder="Enter your student ID"
              placeholderTextColor={theme.textSecondary}
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
            <Text style={[styles.inputLabel, { color: theme.text }]}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.surface, 
                  color: theme.text,
                  borderColor: errors.password ? theme.error : theme.border,
                  borderWidth: errors.password ? 2 : 1,
                  paddingRight: 50
                }]}
                placeholder="Create a password (min 6 characters)"
                placeholderTextColor={theme.textSecondary}
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                onBlur={() => setFieldTouched('password')}
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

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.surface, 
                  color: theme.text,
                  borderColor: errors.confirmPassword ? theme.error : theme.border,
                  borderWidth: errors.confirmPassword ? 2 : 1,
                  paddingRight: 50
                }]}
                placeholder="Confirm your password"
                placeholderTextColor={theme.textSecondary}
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData('confirmPassword', value)}
                onBlur={() => setFieldTouched('confirmPassword')}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text style={[styles.eyeIcon, { color: theme.textSecondary }]}>
                  {showConfirmPassword ? '🙈' : '👁️'}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && renderErrorMessage(errors.confirmPassword)}
          </View>

          {/* Signup Button */}
          <TouchableOpacity
            style={[styles.signupButton, { 
              backgroundColor: theme.primary,
              opacity: loading ? 0.7 : 1 
            }]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={[styles.signupButtonText, { marginLeft: 10 }]}>Creating Account...</Text>
              </View>
            ) : (
              <Text style={styles.signupButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: theme.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.loginLink, { color: theme.primary }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Requirements Info */}
        <View style={[styles.requirementsContainer, { backgroundColor: theme.surface }]}>
          <Text style={[styles.requirementsTitle, { color: theme.text }]}>
            🎓 Student Verification Required
          </Text>
          <Text style={[styles.requirementsText, { color: theme.textSecondary }]}>
            • Use your official university email (Accepted domains: @iqra.edu.pk, @comsats.edu.pk, @pu.edu.pk, @lums.edu.pk, @nust.edu.pk, and other verified universities){'\n'}
            • Provide your valid student ID (minimum 3 characters){'\n'}
            • Enter your full name (minimum 2 characters){'\n'}
            • Select your academic department{'\n'}
            • Create a secure password (minimum 6 characters)
          </Text>
          
          <View style={styles.helpSection}>
            <Text style={[styles.helpTitle, { color: theme.text }]}>Need Help?</Text>
            <Text style={[styles.helpText, { color: theme.textSecondary }]}>• Already have an account? Click "Sign In" above</Text>
            <Text style={[styles.helpText, { color: theme.textSecondary }]}>• Invalid university email? Contact your registrar office</Text>
            <Text style={[styles.helpText, { color: theme.textSecondary }]}>• Forgot your student ID? Check your student portal or ID card</Text>
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
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  appName: {
    fontSize: 28,
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
    marginBottom: 24,
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
  inputText: {
    fontSize: 16,
  },
  arrow: {
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
  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  signupButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
  },
  loginLink: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  requirementsContainer: {
    padding: 16,
    borderRadius: 12,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  requirementsText: {
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
    borderColor: '#4CAF50',
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

export default SignupScreen;
