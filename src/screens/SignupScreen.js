import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Modal,
  FlatList
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { spacing, borderRadius } from '../utils/designSystem';
import Button from '../components/Button';
import Input from '../components/Input';
import Background from '../components/Background';

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
            newErrors.email = 'Please use your university email address';
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
        newErrors.email = 'Please use your university email address';
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
    
    setLoading(true);
    setSuccessMessage('');
    
    try {
      await signUp(formData);
      setSuccessMessage('Account created successfully! Please check your email for verification.');
      // Clear form after successful signup
      setFormData({
        fullName: '',
        email: '',
        studentId: '',
        department: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      setErrors({ general: error.message || 'Signup failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderDepartmentSelector = () => (
    <TouchableOpacity 
      onPress={() => setShowDepartments(true)}
      style={[
        styles.departmentSelector,
        { 
          borderColor: errors.department ? theme.error : theme.border,
          backgroundColor: theme.backgroundInput
        }
      ]}
    >
      <Text 
        style={[
          styles.departmentText,
          { color: formData.department ? theme.text : theme.textPlaceholder }
        ]}
      >
        {formData.department || 'Select your department'}
      </Text>
      <Text style={styles.dropdownIcon}>▼</Text>
    </TouchableOpacity>
  );

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
              Create Account
            </Text>
            
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Join your campus community
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
              label="Full Name"
              value={formData.fullName}
              onChangeText={(text) => updateFormData('fullName', text)}
              onBlur={() => setFieldTouched('fullName')}
              placeholder="Enter your full name"
              autoCapitalize="words"
              error={errors.fullName}
            />
            
            <Input
              label="University Email"
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              onBlur={() => setFieldTouched('email')}
              placeholder="name.id@university.edu"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            
            <Input
              label="Student ID"
              value={formData.studentId}
              onChangeText={(text) => updateFormData('studentId', text)}
              onBlur={() => setFieldTouched('studentId')}
              placeholder="Enter your student ID"
              autoCapitalize="none"
              error={errors.studentId}
            />
            
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>
                Department
              </Text>
              {renderDepartmentSelector()}
              {errors.department && (
                <Text style={[styles.errorText, { color: theme.error }]}>
                  {errors.department}
                </Text>
              )}
            </View>
            
            <Input
              label="Password"
              value={formData.password}
              onChangeText={(text) => updateFormData('password', text)}
              onBlur={() => setFieldTouched('password')}
              placeholder="Create a password"
              secureTextEntry
              error={errors.password}
            />
            
            <Input
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(text) => updateFormData('confirmPassword', text)}
              onBlur={() => setFieldTouched('confirmPassword')}
              placeholder="Confirm your password"
              secureTextEntry
              error={errors.confirmPassword}
            />
            
            <Button
              title="Sign Up"
              onPress={handleSignup}
              loading={loading}
              style={styles.signupButton}
              variant="filled"
              size="lg"
            />
            
            <View style={styles.loginContainer}>
              <Text style={[styles.loginText, { color: theme.textSecondary }]}>
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.loginLink, { color: theme.primary }]}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Department Selection Modal */}
      <Modal
        visible={showDepartments}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDepartments(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent,
            { backgroundColor: theme.backgroundElevated, ...theme.shadow.lg }
          ]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Select Department
              </Text>
              <TouchableOpacity onPress={() => setShowDepartments(false)}>
                <Text style={[styles.closeButton, { color: theme.primary }]}>Close</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={DEPARTMENTS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.departmentItem,
                    formData.department === item && { backgroundColor: theme.primaryLight }
                  ]}
                  onPress={() => {
                    updateFormData('department', item);
                    setFieldTouched('department');
                    setShowDepartments(false);
                  }}
                >
                  <Text style={[
                    styles.departmentItemText,
                    { color: formData.department === item ? theme.primary : theme.text }
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.departmentList}
            />
          </View>
        </View>
      </Modal>
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
  inputContainer: {
    width: '100%',
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
    fontSize: 14,
    fontWeight: '500',
  },
  departmentSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    height: 48,
  },
  departmentText: {
    fontSize: 16,
  },
  dropdownIcon: {
    fontSize: 12,
    opacity: 0.5,
  },
  signupButton: {
    width: '100%',
    marginTop: spacing.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  loginText: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: borderRadius.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  departmentList: {
    maxHeight: 300,
  },
  departmentItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  departmentItemText: {
    fontSize: 16,
  },
});

export default SignupScreen;
