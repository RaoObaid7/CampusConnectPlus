import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import EventCard from './EventCard';
import { mockEvents } from '../data/mockEvents';

const EventList = ({ navigation, searchQuery = '', selectedCategory = 'All', sortBy = 'date', headerContent = null }) => {
  const { theme } = useTheme();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEvents(mockEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortEvents = () => {
    let filteredEvents = events;

    // Apply search filter
    if (searchQuery.trim()) {
      filteredEvents = filteredEvents.filter(event =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      filteredEvents = filteredEvents.filter(event => event.category === selectedCategory);
    }

    // Apply sorting
    switch (sortBy) {
      case 'date':
        filteredEvents.sort((a, b) => new Date(a.time) - new Date(b.time));
        break;
      case 'popular':
        filteredEvents.sort((a, b) => b.registrationCount - a.registrationCount);
        break;
      case 'newest':
        filteredEvents.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'availability':
        filteredEvents.sort((a, b) => (b.capacity - b.registrationCount) - (a.capacity - a.registrationCount));
        break;
      default:
        break;
    }

    return filteredEvents;
  };

  const handleEventPress = (event) => {
    navigation.navigate('EventDetails', { event });
  };

  const renderEvent = ({ item }) => (
    <EventCard 
      event={item} 
      onPress={() => handleEventPress(item)}
    />
  );

  const renderEmpty = () => (
    <View style={[styles.emptyContainer, { backgroundColor: theme.background }]}>
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
        {searchQuery || selectedCategory !== 'All' 
          ? 'No events found matching your criteria' 
          : 'No events available'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
          Loading events...
        </Text>
      </View>
    );
  }

  const filteredEvents = filterAndSortEvents();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={filteredEvents}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={headerContent}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={filteredEvents.length === 0 ? styles.emptyList : null}
        onRefresh={loadEvents}
        refreshing={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyList: {
    flexGrow: 1,
  },
});

export default EventList;