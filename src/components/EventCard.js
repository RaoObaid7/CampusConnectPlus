import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const EventCard = ({ event, onPress }) => {
  const { theme } = useTheme();
  const styles = createThemedStyles(theme);
  
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
      'Tech': theme.colors.primary,
      'Sports': theme.colors.success,
      'Seminar': theme.colors.secondary,
      'Cultural': '#E91E63', // Custom color
      'Workshop': '#9C27B0', // Custom color
      'Academic': '#607D8B', // Custom color
      'Art': '#FF5722', // Custom color
    };
    return colors[category] || theme.colors.primary;
  };

  const availableSpots = event.capacity - event.registrationCount;
  const isAlmostFull = availableSpots <= 5;

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(event.category) }]}>
          <Text style={styles.categoryText}>{event.category}</Text>
        </View>
        {isAlmostFull && (
          <View style={[styles.urgencyBadge, { backgroundColor: theme.colors.warning }]}>
            <Text style={styles.urgencyText}>Almost Full!</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.title} numberOfLines={2}>
        {event.name}
      </Text>
      
      <Text style={styles.time}>
        📅 {formatDate(event.time)}
      </Text>
      
      <Text style={styles.venue}>
        📍 {event.venue}
      </Text>
      
      <View style={styles.footer}>
        <Text style={styles.attendance}>
          👥 {event.registrationCount}/{event.capacity}
        </Text>
        <Text style={[styles.spots, { color: isAlmostFull ? theme.colors.warning : theme.colors.success }]}>
          {availableSpots} spots left
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const createThemedStyles = (theme) => StyleSheet.create({
  card: {
    borderRadius: theme.radii.l,
    padding: theme.spacing.m,
    marginVertical: theme.spacing.s,
    marginHorizontal: theme.spacing.m,
    borderWidth: 1,
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    ...theme.elevation.low,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  categoryBadge: {
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radii.l,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.medium,
  },
  urgencyBadge: {
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radii.l,
  },
  urgencyText: {
    color: '#FFFFFF',
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.medium,
  },
  title: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
    lineHeight: 24,
  },
  time: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  venue: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.m,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendance: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textSecondary,
  },
  spots: {
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.bold,
  },
});

export default EventCard;