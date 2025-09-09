import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const EventCard = ({ event, onPress }) => {
  const { theme } = useTheme();
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Tech': '#2196F3',
      'Sports': '#4CAF50',
      'Seminar': '#FF9800',
      'Cultural': '#E91E63',
      'Workshop': '#9C27B0',
      'Academic': '#607D8B',
      'Art': '#FF5722'
    };
    return colors[category] || theme.primary;
  };

  const availableSpots = event.capacity - event.registrationCount;
  const isAlmostFull = availableSpots <= 5;

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(event.category) }]}>
          <Text style={styles.categoryText}>{event.category}</Text>
        </View>
        {isAlmostFull && (
          <View style={[styles.urgencyBadge, { backgroundColor: theme.warning }]}>
            <Text style={styles.urgencyText}>Almost Full!</Text>
          </View>
        )}
      </View>
      
      <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
        {event.name}
      </Text>
      
      <Text style={[styles.time, { color: theme.textSecondary }]}>
        📅 {formatDate(event.time)}
      </Text>
      
      <Text style={[styles.venue, { color: theme.textSecondary }]}>
        📍 {event.venue}
      </Text>
      
      <View style={styles.footer}>
        <Text style={[styles.attendance, { color: theme.textSecondary }]}>
          👥 {event.registrationCount}/{event.capacity}
        </Text>
        <Text style={[styles.spots, { color: isAlmostFull ? theme.warning : theme.success }]}>
          {availableSpots} spots left
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 24,
  },
  time: {
    fontSize: 14,
    marginBottom: 4,
  },
  venue: {
    fontSize: 14,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendance: {
    fontSize: 14,
  },
  spots: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default EventCard;