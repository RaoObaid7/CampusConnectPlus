import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { saveFeedback } from '../utils/storage';
import Background from '../components/Background';
import Card from '../components/Card';
import Button from '../components/Button';
import { spacing, borderRadius, typography } from '../utils/designSystem';

const FeedbackScreen = ({ route, navigation }) => {
  const { event } = route.params;
  const { theme } = useTheme();
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
        <Button
          key={i}
          onPress={() => handleStarPress(i)}
          variant="icon"
          style={styles.starButton}
        >
          <Text style={[styles.star, { color: i <= rating ? '#FFD700' : theme.border }]}>
            ★
          </Text>
        </Button>
      );
    }
    return stars;
  };

  return (
    <Background variant="gradient">
      <SafeAreaView style={styles.container}>
        <Card variant="elevated" style={styles.card}>
          <Text style={[styles.title, { color: theme.text }]}>Event Feedback</Text>
          <Text style={[styles.eventName, { color: theme.textSecondary }]}>{event.name}</Text>

        <View style={styles.ratingSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>How was the event?</Text>
          <View style={styles.starsContainer}>
            {renderStars()}
          </View>
          {rating > 0 && (
            <Text style={[styles.ratingText, { color: theme.textSecondary }]}>
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </Text>
          )}
        </View>

        <View style={styles.commentSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Additional Comments (Optional)
          </Text>
          <TextInput
            style={[styles.commentInput, { 
              backgroundColor: theme.surface, 
              color: theme.text,
              borderColor: theme.border 
            }]}
            placeholder="Share your thoughts about the event..."
            placeholderTextColor={theme.textSecondary}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <Button
          title={submitting ? 'Submitting...' : 'Submit Feedback'}
          variant="gradient"
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={submitting}
        />
        </Card>
      </SafeAreaView>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  card: {
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  eventName: {
    fontSize: typography.fontSize.md,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  ratingSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.md,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  starButton: {
    padding: spacing.xs,
  },
  star: {
    fontSize: 40,
  },
  ratingText: {
    fontSize: typography.fontSize.md,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  commentSection: {
    marginBottom: spacing.xl,
  },
  commentInput: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    fontSize: typography.fontSize.md,
    minHeight: 100,
  },
  submitButton: {
    marginTop: spacing.md,
  },
});

export default FeedbackScreen;