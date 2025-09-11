import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { saveRegistration, isRegistered, updatePreferencesFromRegistration } from '../utils/storage';
import EventComments from '../components/EventComments';
import Background from '../components/Background';
import Card from '../components/Card';
import Button from '../components/Button';
import { spacing, borderRadius, typography } from '../utils/designSystem';

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
    <Card variant="elevated" style={styles.card}>
      <Text style={[styles.title, { color: theme.text }]}>{event.name}</Text>
      
      <View style={[styles.categoryBadge, { backgroundColor: theme.primary }]}>
        <Text style={styles.categoryText}>{event.category}</Text>
      </View>

      <Text style={[styles.description, { color: theme.text }]}>{event.description}</Text>

      <View style={styles.detailsContainer}>
        <Text style={[styles.detailLabel, { color: theme.text }]}>📅 Date & Time:</Text>
        <Text style={[styles.detailValue, { color: theme.textSecondary }]}>{formatDate(event.time)}</Text>

        <Text style={[styles.detailLabel, { color: theme.text }]}>📍 Venue:</Text>
        <Text style={[styles.detailValue, { color: theme.textSecondary }]}>{event.venue}</Text>

        <Text style={[styles.detailLabel, { color: theme.text }]}>👥 Attendance:</Text>
        <Text style={[styles.detailValue, { color: theme.textSecondary }]}>
          {event.registrationCount}/{event.capacity} registered
        </Text>

        <Text style={[styles.detailLabel, { color: theme.text }]}>✅ Available Spots:</Text>
        <Text style={[styles.detailValue, { color: theme.textSecondary }]}>
          {event.capacity - event.registrationCount} spots remaining
        </Text>
      </View>

      {!registered ? (
        <Button
          title="Register for Event"
          variant="gradient"
          onPress={handleRegistration}
          style={styles.registerButton}
        />
      ) : (
        <View style={styles.registeredContainer}>
          <Text style={[styles.registeredText, { color: theme.success }]}>You are registered!</Text>
          
          {qrCode && (
             <View style={styles.qrContainer}>
               <Text style={[styles.qrTitle, { color: theme.text }]}>Your Event QR Code</Text>
               <Card variant="outline" style={styles.qrCodeWrapper}>
                  <QRCode
                    value={`${event.id}-${user.id || user.email}`}
                    size={150}
                    color="#000"
                    backgroundColor="#fff"
                  />
                </Card>
               <Text style={[styles.qrInstructions, { color: theme.textSecondary }]}>
                 Present this QR code at the event entrance for check-in
               </Text>
               
               <Button
                 title="Leave Feedback"
                 variant="secondary"
                 onPress={() => navigation.navigate('Feedback', { event })}
                 style={styles.feedbackButton}
               />
             </View>
           )}
        </View>
      )}
    </Card>
  );

  return (
    <Background variant="gradient">
      <SafeAreaView style={styles.container}>
        <EventComments eventId={event.id} headerContent={renderEventHeader()} />
      </SafeAreaView>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: spacing.md,
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  categoryText: {
    color: '#fff',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  description: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.fontSize.md * 1.5,
    marginBottom: spacing.lg,
  },
  detailsContainer: {
    marginBottom: spacing.lg,
  },
  detailLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  detailValue: {
    fontSize: typography.fontSize.md,
    marginBottom: spacing.sm,
  },
  registerButton: {
    marginTop: spacing.md,
  },
  registeredContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  registeredText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.lg,
  },
  qrContainer: {
    alignItems: 'center',
  },
  qrTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  qrCodeWrapper: {
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  qrInstructions: {
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  feedbackButton: {
    marginTop: spacing.sm,
  },
});

export default EventDetailsScreen;