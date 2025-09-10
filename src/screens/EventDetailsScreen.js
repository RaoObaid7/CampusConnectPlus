import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { saveRegistration, isRegistered, updatePreferencesFromRegistration } from '../utils/storage';
import EventComments from '../components/EventComments';

const EventDetailsScreen = ({ route, navigation }) => {
  const { event } = route.params;
  const { theme } = useTheme();
  const styles = createThemedStyles(theme);
  const { user } = useAuth();
  const [registered, setRegistered] = useState(false);
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    checkRegistrationStatus();
  }, []);

  const checkRegistrationStatus = async () => {
    const status = await isRegistered(event.id);
    setRegistered(status);
  };

  const handleRegistration = async () => {
    try {
      const registration = await saveRegistration(event.id, user);
      await updatePreferencesFromRegistration(event.category);
      setRegistered(true);
      setQrCode(registration.qrCode);
      Alert.alert('Success!', `Welcome ${user.fullName}! You have been registered for this event. Your QR code has been generated.`);
    } catch (error) {
      Alert.alert('Error', 'Failed to register for event. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderEventHeader = () => (
    <View style={styles.card}>
      <Text style={styles.title}>{event.name}</Text>
      
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{event.category}</Text>
      </View>

      <Text style={styles.description}>{event.description}</Text>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailLabel}>📅 Date & Time:</Text>
        <Text style={styles.detailValue}>{formatDate(event.time)}</Text>

        <Text style={styles.detailLabel}>📍 Venue:</Text>
        <Text style={styles.detailValue}>{event.venue}</Text>

        <Text style={styles.detailLabel}>👥 Attendance:</Text>
        <Text style={styles.detailValue}>
          {event.registrationCount}/{event.capacity} registered
        </Text>

        <Text style={styles.detailLabel}>✅ Available Spots:</Text>
        <Text style={[styles.detailValue, { color: theme.colors.success }]}>
          {event.capacity - event.registrationCount} spots remaining
        </Text>
      </View>

      {!registered ? (
        <TouchableOpacity 
          style={styles.registerButton}
          onPress={handleRegistration}
        >
          <Text style={styles.registerButtonText}>Register for Event</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.registeredContainer}>
          <Text style={styles.registeredText}>
            ✅ You are registered for this event!
          </Text>
          
          {qrCode && (
            <View style={styles.qrContainer}>
              <Text style={styles.qrTitle}>Your Check-in QR Code:</Text>
              <View style={styles.qrCodeWrapper}>
                <QRCode
                  value={qrCode}
                  size={150}
                  color="#000000"
                  backgroundColor="#FFFFFF"
                />
              </View>
              <Text style={styles.qrInstructions}>
                Show this QR code at the event for check-in
              </Text>
              
              <TouchableOpacity 
                style={styles.feedbackButton}
                onPress={() => navigation.navigate('Feedback', { event })}
              >
                <Text style={styles.feedbackButtonText}>Leave Feedback</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <EventComments eventId={event.id} headerContent={renderEventHeader()} />
    </SafeAreaView>
  );
};

const createThemedStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  card: {
    margin: theme.spacing.m,
    padding: theme.spacing.l,
    borderRadius: theme.radii.l,
    borderWidth: 1,
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
  },
  title: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.weights.bold,
    marginBottom: theme.spacing.m,
    color: theme.colors.text,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.radii.l,
    marginBottom: theme.spacing.m,
    backgroundColor: theme.colors.primary,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.medium,
  },
  description: {
    fontSize: theme.typography.sizes.body,
    lineHeight: 24,
    marginBottom: theme.spacing.l,
    color: theme.colors.text,
  },
  detailsContainer: {
    marginBottom: theme.spacing.l,
  },
  detailLabel: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.medium,
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.xs,
    color: theme.colors.textSecondary,
  },
  detailValue: {
    fontSize: theme.typography.sizes.body,
    marginBottom: theme.spacing.s,
    color: theme.colors.text,
  },
  registerButton: {
    padding: theme.spacing.m,
    borderRadius: theme.radii.m,
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.bold,
  },
  registeredContainer: {
    alignItems: 'center',
  },
  registeredText: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.bold,
    marginBottom: theme.spacing.l,
    color: theme.colors.success,
  },
  qrContainer: {
    alignItems: 'center',
  },
  qrTitle: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.medium,
    marginBottom: theme.spacing.m,
    color: theme.colors.text,
  },
  qrCodeWrapper: {
    padding: theme.spacing.m,
    borderRadius: theme.radii.l,
    marginBottom: theme.spacing.m,
    backgroundColor: '#FFFFFF',
  },
  qrInstructions: {
    fontSize: theme.typography.sizes.caption,
    textAlign: 'center',
    marginBottom: theme.spacing.m,
    color: theme.colors.textSecondary,
  },
  feedbackButton: {
    padding: theme.spacing.s,
    borderRadius: theme.radii.m,
    alignItems: 'center',
    backgroundColor: theme.colors.secondary,
  },
  feedbackButtonText: {
    color: '#FFFFFF',
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.medium,
  },
});

export default EventDetailsScreen;