import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import EventCard from './EventCard';
import Card3D from './Card3D';
import { useScreenSize } from './ResponsiveLayout';
import { getRecommendedEvents } from '../utils/aiRecommendations';
import { mockEvents } from '../data/mockEvents';
import { spacing, borderRadius, typography } from '../utils/designSystem';

const AIRecommendations = ({ navigation, isSidebar = false }) => {
  const { theme } = useTheme();
  const { isMobile } = useScreenSize();
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
      <Card3D variant="elevated" style={[styles.container, isSidebar && styles.sidebarContainer]}>
        <Text style={[styles.title, { color: theme.text }]}>🤖 AI Recommendations</Text>
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
          Analyzing your preferences...
        </Text>
      </Card3D>
    );
  }

  if (recommendedEvents.length === 0) {
    return (
      <Card3D variant="elevated" style={[styles.container, isSidebar && styles.sidebarContainer]}>
        <Text style={[styles.title, { color: theme.text }]}>🤖 AI Recommendations</Text>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          Register for events to get personalized recommendations!
        </Text>
      </Card3D>
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
    <Card3D variant="elevated" style={[styles.container, isSidebar && styles.sidebarContainer]}>
      <Text style={[styles.title, { color: theme.text }]}>🤖 Recommended for You</Text>
      <FlatList 
        data={isSidebar ? recommendedEvents.slice(0, 3) : recommendedEvents}
        renderItem={renderRecommendedEvent}
        keyExtractor={(item) => item.id}
        horizontal={!isSidebar && !isMobile}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          (isSidebar || isMobile) && styles.verticalScrollContent
        ]}
        scrollEnabled={!isSidebar || isMobile}
        nestedScrollEnabled={isMobile && isSidebar}
      />
    </Card3D>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
    marginHorizontal: spacing.sm,
  },
  sidebarContainer: {
    marginVertical: spacing.sm,
    marginHorizontal: 0,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
  },
  loadingText: {
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.md,
    fontWeight: typography.fontWeight.medium,
  },
  emptyText: {
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: typography.fontSize.sm * 1.4,
    fontWeight: typography.fontWeight.medium,
  },
  verticalScrollContent: {
    paddingHorizontal: 0,
  },
  cardContainer: {
    width: 280,
    marginBottom: spacing.sm,
  },
});

export default AIRecommendations;