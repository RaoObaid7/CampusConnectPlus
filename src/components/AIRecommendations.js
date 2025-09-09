import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import EventCard from './EventCard';
import { getRecommendedEvents } from '../utils/aiRecommendations';
import { mockEvents } from '../data/mockEvents';

const AIRecommendations = ({ navigation }) => {
  const { theme } = useTheme();
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
        <Text style={[styles.title, { color: theme.text }]}>🤖 AI Recommendations</Text>
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
          Analyzing your preferences...
        </Text>
      </View>
    );
  }

  if (recommendedEvents.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>🤖 AI Recommendations</Text>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
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
      <Text style={[styles.title, { color: theme.text }]}>🤖 Recommended for You</Text>
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

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    marginHorizontal: 32,
  },
  scrollContent: {
    paddingHorizontal: 8,
  },
  cardContainer: {
    width: 300,
  },
});

export default AIRecommendations;