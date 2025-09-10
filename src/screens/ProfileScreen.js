import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Switch,
  Alert,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Animated 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Background3D from '../components/Background3D';
import Card3D, { GlassCard3D } from '../components/Card3D';
import Button3D, { GradientButton3D, OutlineButton3D } from '../components/Button3D';
import Input3D from '../components/Input3D';
import { SplitLayout, useScreenSize } from '../components/ResponsiveLayout';
import { spacing, borderRadius, typography } from '../utils/designSystem';
import { useFadeAnimation, usePressAnimation } from '../components/Animations3D';

const ProfileScreen = ({ navigation }) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { user, logout, updateUserPreferences } = useAuth();
  const { isMobile } = useScreenSize();
  
  // User preferences state
  const [preferences, setPreferences] = useState({
    notifications: true,
    emailUpdates: true,
    locationServices: false,
    aiRecommendations: true,
    autoJoinEvents: false,
    showProfile: true,
    dataSync: true,
    analytics: false,
  });
  
  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    university: user?.university || '',
    major: user?.major || '',
    year: user?.year || '',
    bio: user?.bio || '',
  });

  const { animatedStyle: fadeStyle } = useFadeAnimation();
  const { animatedStyle: headerPressStyle, animateIn, animateOut } = usePressAnimation(1, 0.95, 150);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem('userPreferences');
      if (stored) {
        setPreferences({ ...preferences, ...JSON.parse(stored) });
      }
    } catch (error) {
      console.log('Error loading preferences:', error);
    }
  };

  const savePreferences = async (newPreferences) => {
    try {
      await AsyncStorage.setItem('userPreferences', JSON.stringify(newPreferences));
      setPreferences(newPreferences);
      if (updateUserPreferences) {
        updateUserPreferences(newPreferences);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save preferences');
    }
  };

  const handlePreferenceChange = (key, value) => {
    const newPreferences = { ...preferences, [key]: value };
    savePreferences(newPreferences);
  };

  const handleProfileSave = () => {
    // Here you would typically update the user profile via API
    setIsEditingProfile(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleLogout = () => {
    console.log('handleLogout called in ProfileScreen');
    setShowLogoutConfirmation(true);
  };
  
  const confirmLogout = () => {
    console.log('User confirmed logout');
    setShowLogoutConfirmation(false);
    logout();
  };
  
  const cancelLogout = () => {
    console.log('User cancelled logout');
    setShowLogoutConfirmation(false);
  };

  const renderProfileHeader = () => (
    <GlassCard3D style={styles.profileHeader}>
      <LinearGradient
        colors={[theme.primaryLight + '20', theme.secondaryLight + '15']}
        style={styles.profileGradient}
      >
        <TouchableOpacity
          style={styles.avatarContainer}
          onPressIn={animateIn}
          onPressOut={animateOut}
        >
          <Animated.View style={[
            styles.avatar,
            { backgroundColor: theme.primary },
            headerPressStyle
          ]}>
            <Text style={styles.avatarText}>
              {user?.fullName?.charAt(0) || 'U'}
            </Text>
          </Animated.View>
        </TouchableOpacity>
        
        <View style={styles.profileInfo}>
          <Text style={[styles.userName, { color: theme.text }]}>
            {user?.fullName || 'User'}
          </Text>
          <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
            {user?.email || 'user@university.edu'}
          </Text>
          <Text style={[styles.userUniversity, { color: theme.primary }]}>
            {user?.university || 'University'} • {user?.major || 'Student'}
          </Text>
        </View>
        
        <OutlineButton3D
          title="Edit Profile"
          onPress={() => setIsEditingProfile(true)}
          size="small"
          style={styles.editButton}
        />
      </LinearGradient>
    </GlassCard3D>
  );

  const renderSettingsSection = (title, icon, items, sectionIndex) => (
    <Card3D key={sectionIndex} variant="elevated" style={styles.settingsSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>{icon}</Text>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {title}
        </Text>
      </View>
      
      {items.map((item, index) => (
        <View key={`${sectionIndex}-${index}`} style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: theme.text }]}>
              {item.title}
            </Text>
            {item.description && (
              <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                {item.description}
              </Text>
            )}
          </View>
          
          {item.type === 'switch' ? (
            <Switch
              value={item.value}
              onValueChange={item.onValueChange}
              trackColor={{ 
                false: theme.border, 
                true: theme.primary + '40' 
              }}
              thumbColor={item.value ? theme.primary : theme.textSecondary}
              style={styles.switch}
            />
          ) : item.type === 'button' ? (
            <OutlineButton3D
              title={item.buttonTitle}
              onPress={item.onPress}
              size="small"
              style={styles.actionButton}
            />
          ) : null}
        </View>
      ))}
    </Card3D>
  );

  const renderProfileForm = () => (
    <Card3D variant="elevated" style={styles.profileForm}>
      <View style={styles.formHeader}>
        <Text style={[styles.formTitle, { color: theme.text }]}>
          Edit Profile 📝
        </Text>
      </View>
      
      <Input3D
        label="Full Name"
        value={profileData.fullName}
        onChangeText={(text) => setProfileData({...profileData, fullName: text})}
        style={styles.formInput}
      />
      
      <Input3D
        label="University"
        value={profileData.university}
        onChangeText={(text) => setProfileData({...profileData, university: text})}
        style={styles.formInput}
      />
      
      <Input3D
        label="Major"
        value={profileData.major}
        onChangeText={(text) => setProfileData({...profileData, major: text})}
        style={styles.formInput}
      />
      
      <Input3D
        label="Year"
        value={profileData.year}
        onChangeText={(text) => setProfileData({...profileData, year: text})}
        style={styles.formInput}
      />
      
      <Input3D
        label="Bio"
        value={profileData.bio}
        onChangeText={(text) => setProfileData({...profileData, bio: text})}
        multiline
        numberOfLines={3}
        style={styles.formInput}
      />
      
      <View style={styles.formButtons}>
        <OutlineButton3D
          title="Cancel"
          onPress={() => setIsEditingProfile(false)}
          style={styles.cancelButton}
        />
        <GradientButton3D
          title="Save Changes"
          onPress={handleProfileSave}
          colors={[theme.success, theme.successGradient?.split(' ')[2] || theme.success]}
          style={styles.saveButton}
        />
      </View>
    </Card3D>
  );
  
  const renderLogoutConfirmation = () => {
    if (!showLogoutConfirmation) return null;
    
    return (
      <View style={styles.modalOverlay}>
        <GlassCard3D style={styles.confirmationModal}>
          <Text style={[styles.confirmationTitle, { color: theme.text }]}>
            Logout Confirmation
          </Text>
          <Text style={[styles.confirmationText, { color: theme.textSecondary }]}>
            Are you sure you want to logout from your account?
          </Text>
          
          <View style={styles.confirmationButtons}>
            <OutlineButton3D
              title="Cancel"
              onPress={cancelLogout}
              size="medium"
              style={styles.cancelLogoutButton}
            />
            <GradientButton3D
              title="Logout 🚪"
              onPress={confirmLogout}
              colors={[theme.error, '#dc2626']}
              size="medium"
              style={styles.confirmLogoutButton}
            />
          </View>
        </GlassCard3D>
      </View>
    );
  };

  const settingsSections = [
    {
      title: 'Appearance',
      icon: '🎨',
      items: [
        {
          title: 'Dark Mode',
          description: 'Switch between light and dark themes',
          type: 'switch',
          value: isDarkMode,
          onValueChange: toggleTheme,
        },
      ],
    },
    {
      title: 'AI & Recommendations',
      icon: '🤖',
      items: [
        {
          title: 'AI Recommendations',
          description: 'Get personalized event recommendations',
          type: 'switch',
          value: preferences.aiRecommendations,
          onValueChange: (value) => handlePreferenceChange('aiRecommendations', value),
        },
        {
          title: 'Auto-Join Events',
          description: 'Automatically join recommended events',
          type: 'switch',
          value: preferences.autoJoinEvents,
          onValueChange: (value) => handlePreferenceChange('autoJoinEvents', value),
        },
      ],
    },
    {
      title: 'Notifications',
      icon: '🔔',
      items: [
        {
          title: 'Push Notifications',
          description: 'Receive notifications about events',
          type: 'switch',
          value: preferences.notifications,
          onValueChange: (value) => handlePreferenceChange('notifications', value),
        },
        {
          title: 'Email Updates',
          description: 'Get email updates about new events',
          type: 'switch',
          value: preferences.emailUpdates,
          onValueChange: (value) => handlePreferenceChange('emailUpdates', value),
        },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: '🔒',
      items: [
        {
          title: 'Location Services',
          description: 'Allow location-based recommendations',
          type: 'switch',
          value: preferences.locationServices,
          onValueChange: (value) => handlePreferenceChange('locationServices', value),
        },
        {
          title: 'Show Profile',
          description: 'Make your profile visible to others',
          type: 'switch',
          value: preferences.showProfile,
          onValueChange: (value) => handlePreferenceChange('showProfile', value),
        },
        {
          title: 'Analytics',
          description: 'Help improve the app with usage data',
          type: 'switch',
          value: preferences.analytics,
          onValueChange: (value) => handlePreferenceChange('analytics', value),
        },
      ],
    },
    {
      title: 'Account',
      icon: '👤',
      items: [
        {
          title: 'Data Sync',
          description: 'Sync your data across devices',
          type: 'switch',
          value: preferences.dataSync,
          onValueChange: (value) => handlePreferenceChange('dataSync', value),
        },
        {
          title: 'Logout',
          description: 'Sign out of your account',
          type: 'button',
          buttonTitle: 'Logout 🚪',
          onPress: () => {
            console.log('Logout button pressed!');
            handleLogout();
          },
        },
      ],
    },
  ];

  const leftContent = (
    <View style={styles.leftPanel}>
      {renderProfileHeader()}
    </View>
  );

  const rightContent = (
    <ScrollView 
      style={styles.rightPanel}
      showsVerticalScrollIndicator={false}
    >
      {isEditingProfile ? renderProfileForm() : (
        <Animated.View style={fadeStyle}>
          {settingsSections.map((section, index) => 
            renderSettingsSection(section.title, section.icon, section.items, index)
          )}
        </Animated.View>
      )}
    </ScrollView>
  );

  return (
    <Background3D variant="cool">
      <SafeAreaView style={styles.container}>
        <SplitLayout
          leftContent={leftContent}
          rightContent={rightContent}
          leftFlex={isMobile ? 1 : 0.8}
          rightFlex={1.2}
          gap={isMobile ? spacing.md : spacing.lg}
          style={styles.layout}
        />
        {renderLogoutConfirmation()}
      </SafeAreaView>
    </Background3D>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  layout: {
    padding: spacing.md,
  },
  leftPanel: {
    // Left panel styles handled by SplitLayout
  },
  rightPanel: {
    flex: 1,
  },
  
  // Profile Header Styles
  profileHeader: {
    marginBottom: spacing.lg,
  },
  profileGradient: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: '#fff',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  userName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.xs,
  },
  userUniversity: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  editButton: {
    // Button styles handled by component
  },
  
  // Settings Section Styles
  settingsSection: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  sectionIcon: {
    fontSize: typography.fontSize.lg,
    marginRight: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  settingDescription: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * 1.4,
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  actionButton: {
    minWidth: 80,
  },
  
  // Profile Form Styles
  profileForm: {
    marginBottom: spacing.lg,
  },
  formHeader: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  formTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  formInput: {
    marginBottom: spacing.md,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  cancelButton: {
    flex: 0.4,
  },
  saveButton: {
    flex: 0.6,
  },
  
  // Logout Confirmation Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  confirmationModal: {
    marginHorizontal: spacing.lg,
    padding: spacing.xl,
    maxWidth: 400,
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  confirmationTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  confirmationText: {
    fontSize: typography.fontSize.md,
    textAlign: 'center',
    lineHeight: typography.fontSize.md * 1.5,
    marginBottom: spacing.xl,
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  cancelLogoutButton: {
    flex: 0.45,
  },
  confirmLogoutButton: {
    flex: 0.55,
  },
});

export default ProfileScreen;
