import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageKeys = {
  REGISTRATIONS: 'user_registrations',
  PREFERENCES: 'user_preferences',
  COMMENTS: 'event_comments',
  FEEDBACKS: 'event_feedbacks',
  THEME: 'theme_preference'
};

// Registration functions
export const saveRegistration = async (eventId, userInfo = {}) => {
  try {
    const existing = await getRegistrations();
    const registration = {
      eventId,
      userId: userInfo.userId || userInfo.id || 'default_user',
      userName: userInfo.userName || userInfo.fullName || 'User',
      userEmail: userInfo.userEmail || userInfo.email || '',
      registeredAt: new Date().toISOString(),
      qrCode: `event_${eventId}_user_${userInfo.userId || userInfo.id || 'default'}_${Date.now()}`,
      checkedIn: false
    };
    
    const updated = [...existing, registration];
    await AsyncStorage.setItem(storageKeys.REGISTRATIONS, JSON.stringify(updated));
    return registration;
  } catch (error) {
    console.error('Error saving registration:', error);
    throw error;
  }
};

export const getRegistrations = async () => {
  try {
    const registrations = await AsyncStorage.getItem(storageKeys.REGISTRATIONS);
    return registrations ? JSON.parse(registrations) : [];
  } catch (error) {
    console.error('Error getting registrations:', error);
    return [];
  }
};

export const isRegistered = async (eventId) => {
  try {
    const registrations = await getRegistrations();
    return registrations.some(reg => reg.eventId === eventId);
  } catch (error) {
    console.error('Error checking registration:', error);
    return false;
  }
};

export const checkInToEvent = async (eventId) => {
  try {
    const registrations = await getRegistrations();
    const updated = registrations.map(reg => 
      reg.eventId === eventId ? { ...reg, checkedIn: true, checkedInAt: new Date().toISOString() } : reg
    );
    await AsyncStorage.setItem(storageKeys.REGISTRATIONS, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error checking in:', error);
    return false;
  }
};

// Comments functions
export const saveComment = async (eventId, comment, userInfo = {}) => {
  try {
    const existing = await getComments();
    const newComment = {
      id: `c_${Date.now()}`,
      eventId,
      userId: userInfo.userId || userInfo.id || 'default_user',
      userName: userInfo.userName || userInfo.fullName || 'User',
      userEmail: userInfo.userEmail || userInfo.email || '',
      text: comment,
      timestamp: new Date().toISOString(),
      reactions: { like: 0, love: 0, laugh: 0 }
    };
    
    const eventComments = existing[eventId] || [];
    const updated = {
      ...existing,
      [eventId]: [...eventComments, newComment]
    };
    
    await AsyncStorage.setItem(storageKeys.COMMENTS, JSON.stringify(updated));
    return newComment;
  } catch (error) {
    console.error('Error saving comment:', error);
    throw error;
  }
};

export const getComments = async () => {
  try {
    const comments = await AsyncStorage.getItem(storageKeys.COMMENTS);
    return comments ? JSON.parse(comments) : {};
  } catch (error) {
    console.error('Error getting comments:', error);
    return {};
  }
};

// Feedback functions
export const saveFeedback = async (eventId, rating, comment, userInfo = {}) => {
  try {
    const existing = await getFeedbacks();
    const feedback = {
      eventId,
      userId: userInfo.userId || userInfo.id || 'default_user',
      userName: userInfo.userName || userInfo.fullName || 'User',
      userEmail: userInfo.userEmail || userInfo.email || '',
      rating,
      comment,
      submittedAt: new Date().toISOString()
    };
    
    const updated = [...existing, feedback];
    await AsyncStorage.setItem(storageKeys.FEEDBACKS, JSON.stringify(updated));
    return feedback;
  } catch (error) {
    console.error('Error saving feedback:', error);
    throw error;
  }
};

export const getFeedbacks = async () => {
  try {
    const feedbacks = await AsyncStorage.getItem(storageKeys.FEEDBACKS);
    return feedbacks ? JSON.parse(feedbacks) : [];
  } catch (error) {
    console.error('Error getting feedbacks:', error);
    return [];
  }
};

// User preferences for AI recommendations
export const saveUserPreferences = async (preferences) => {
  try {
    await AsyncStorage.setItem(storageKeys.PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
};

export const getUserPreferences = async () => {
  try {
    const preferences = await AsyncStorage.getItem(storageKeys.PREFERENCES);
    return preferences ? JSON.parse(preferences) : { categories: [], interests: [] };
  } catch (error) {
    console.error('Error getting preferences:', error);
    return { categories: [], interests: [] };
  }
};

// Update preferences based on registrations
export const updatePreferencesFromRegistration = async (category) => {
  try {
    const prefs = await getUserPreferences();
    const categories = prefs.categories || [];
    
    // Add category to preferences if not already there
    if (!categories.includes(category)) {
      categories.push(category);
    }
    
    // Update preference count for AI recommendations
    const categoryCount = prefs.categoryCount || {};
    categoryCount[category] = (categoryCount[category] || 0) + 1;
    
    const updated = {
      ...prefs,
      categories,
      categoryCount
    };
    
    await saveUserPreferences(updated);
  } catch (error) {
    console.error('Error updating preferences:', error);
  }
};