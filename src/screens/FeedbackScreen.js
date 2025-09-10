import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { saveFeedback } from '../utils/storage';

const FeedbackScreen = ({ route, navigation }) => {
  const { event } = route.params;
  const { theme } = useTheme();
  const styles = createThemedStyles(theme);
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleStarPress = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please provide a rating before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      await saveFeedback(event.id, rating, comment, user);
      Alert.alert('Thank You!', `${user.fullName}, your feedback has been submitted successfully. We appreciate your input!`, [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleStarPress(i)}
          style={styles.starButton}
        >
          <Text style={[styles.star, { color: i <= rating ? theme.colors.warning : theme.colors.border }]}>
            ★
          </Text>
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Event Feedback</Text>
        <Text style={styles.eventName}>{event.name}</Text>

        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>How was the event?</Text>
          <View style={styles.starsContainer}>
            {renderStars()}
          </View>
          {rating > 0 && (
            <Text style={styles.ratingText}>
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </Text>
          )}
        </View>

        <View style={styles.commentSection}>
          <Text style={styles.sectionTitle}>
            Additional Comments (Optional)
          </Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Share your thoughts about the event..."
            placeholderTextColor={theme.colors.textSecondary}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton, 
            { backgroundColor: theme.colors.primary },
            submitting && { opacity: 0.6 }
          ]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const createThemedStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.m,
    backgroundColor: theme.colors.background,
  },
  card: {
    padding: theme.spacing.l,
    borderRadius: theme.radii.l,
    borderWidth: 1,
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
  },
  title: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.weights.bold,
    textAlign: 'center',
    marginBottom: theme.spacing.s,
    color: theme.colors.text,
  },
  eventName: {
    fontSize: theme.typography.sizes.body,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    color: theme.colors.textSecondary,
  },
  ratingSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.medium,
    marginBottom: theme.spacing.m,
    color: theme.colors.text,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.m,
  },
  starButton: {
    padding: theme.spacing.xs,
  },
  star: {
    fontSize: 40,
  },
  ratingText: {
    fontSize: theme.typography.sizes.body,
    textAlign: 'center',
    fontStyle: 'italic',
    color: theme.colors.textSecondary,
  },
  commentSection: {
    marginBottom: theme.spacing.xl,
  },
  commentInput: {
    borderWidth: 1,
    borderRadius: theme.radii.m,
    padding: theme.spacing.m,
    fontSize: theme.typography.sizes.body,
    minHeight: 120,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    borderColor: theme.colors.border,
  },
  submitButton: {
    padding: theme.spacing.m,
    borderRadius: theme.radii.m,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.bold,
  },
});

export default FeedbackScreen;