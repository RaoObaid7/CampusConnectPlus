import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import EventCard from './EventCard';
import { getRecommendedEvents } from '../utils/aiRecommendations';
import { mockEvents } from '../data/mockEvents';

const AIRecommendations = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createThemedStyles(theme);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const recommendations = await getRecommendedEvents(mockEvents);
      setRecommendedEvents(recommendations);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventPress = (event) => {
    navigation.navigate('EventDetails', { event });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🤖 AI Recommendations</Text>
        <Text style={styles.loadingText}>
          Analyzing your preferences...
        </Text>
      </View>
    );
  }

  if (recommendedEvents.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🤖 AI Recommendations</Text>
        <Text style={styles.emptyText}>
          Register for events to get personalized recommendations!
        </Text>
      </View>
    );
  }

  const renderRecommendedEvent = ({ item }) => (
    <View style={styles.cardContainer}>
      <EventCard 
        event={item} 
        onPress={() => handleEventPress(item)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🤖 Recommended for You</Text>
      <FlatList 
        data={recommendedEvents}
        renderItem={renderRecommendedEvent}
        keyExtractor={(item) => item.id}
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      />
    </View>
  );
};

const createThemedStyles = (theme) => StyleSheet.create({
  container: {
    marginVertical: theme.spacing.m,
  },
  title: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.bold,
    marginHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.m,
    color: theme.colors.text,
  },
  loadingText: {
    fontSize: theme.typography.sizes.body,
    textAlign: 'center',
    marginTop: theme.spacing.m,
    color: theme.colors.textSecondary,
  },
  emptyText: {
    fontSize: theme.typography.sizes.body,
    textAlign: 'center',
    marginTop: theme.spacing.m,
    marginHorizontal: theme.spacing.xl,
    color: theme.colors.textSecondary,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.s,
  },
  cardContainer: {
    width: 300,
  },
});

export default AIRecommendations;