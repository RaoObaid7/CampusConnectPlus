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
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.title, { color: theme.text }]}>{event.name}</Text>
      
      <View style={[styles.categoryBadge, { backgroundColor: theme.primary }]}>
        <Text style={styles.categoryText}>{event.category}</Text>
      </View>

      <Text style={[styles.description, { color: theme.text }]}>{event.description}</Text>

      <View style={styles.detailsContainer}>
        <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>📅 Date & Time:</Text>
        <Text style={[styles.detailValue, { color: theme.text }]}>{formatDate(event.time)}</Text>

        <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>📍 Venue:</Text>
        <Text style={[styles.detailValue, { color: theme.text }]}>{event.venue}</Text>

        <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>👥 Attendance:</Text>
        <Text style={[styles.detailValue, { color: theme.text }]}>
          {event.registrationCount}/{event.capacity} registered
        </Text>

        <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>✅ Available Spots:</Text>
        <Text style={[styles.detailValue, { color: theme.success }]}>
          {event.capacity - event.registrationCount} spots remaining
        </Text>
      </View>

      {!registered ? (
        <TouchableOpacity 
          style={[styles.registerButton, { backgroundColor: theme.primary }]}
          onPress={handleRegistration}
        >
          <Text style={styles.registerButtonText}>Register for Event</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.registeredContainer}>
          <Text style={[styles.registeredText, { color: theme.success }]}>
            ✅ You are registered for this event!
          </Text>
          
          {qrCode && (
            <View style={styles.qrContainer}>
              <Text style={[styles.qrTitle, { color: theme.text }]}>Your Check-in QR Code:</Text>
              <View style={[styles.qrCodeWrapper, { backgroundColor: '#fff' }]}>
                <QRCode
                  value={qrCode}
                  size={150}
                  color="#000"
                  backgroundColor="#fff"
                />
              </View>
              <Text style={[styles.qrInstructions, { color: theme.textSecondary }]}>
                Show this QR code at the event for check-in
              </Text>
              
              <TouchableOpacity 
                style={[styles.feedbackButton, { backgroundColor: theme.secondary }]}
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <EventComments eventId={event.id} headerContent={renderEventHeader()} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  detailsContainer: {
    marginBottom: 24,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    marginBottom: 8,
  },
  registerButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registeredContainer: {
    alignItems: 'center',
  },
  registeredText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  qrContainer: {
    alignItems: 'center',
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  qrCodeWrapper: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  qrInstructions: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  feedbackButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  feedbackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EventDetailsScreen;