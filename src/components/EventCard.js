import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import Card3D from './Card3D';
import { spacing, borderRadius, typography, transforms3D, animation } from '../utils/designSystem';

const EventCard = ({ event, onPress }) => {
  const { theme } = useTheme();
  const [pressed, setPressed] = useState(false);
  const [animatedValue] = useState(new Animated.Value(1));
  
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
      'Tech': [theme.info, theme.primary],
      'Sports': [theme.success, '#38a169'],
      'Seminar': [theme.warning, '#dd6b20'],
      'Cultural': [theme.secondary, theme.secondaryDark],
      'Workshop': [theme.primaryLight, theme.primary],
      'Academic': [theme.textSecondary, theme.text],
      'Art': [theme.accent, '#ed8936']
    };
    return colors[category] || [theme.primary, theme.primaryDark];
  };

  const availableSpots = event.capacity - event.registrationCount;
  const isAlmostFull = availableSpots <= 5;
  const isFull = availableSpots <= 0;

  const handlePressIn = () => {
    setPressed(true);
    Animated.spring(animatedValue, {
      toValue: transforms3D.scale.down,
      duration: animation.duration.fast,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setPressed(false);
    Animated.spring(animatedValue, {
      toValue: 1,
      duration: animation.duration.fast,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: animatedValue }] }}>
      <Card3D
        variant="elevated"
        size="medium"
        style={[styles.card, { marginHorizontal: spacing.md, marginVertical: spacing.sm }]}
        onPress={onPress}
        tiltEffect={true}
      >
        <TouchableOpacity 
          activeOpacity={1}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={onPress}
          style={styles.cardContent}
        >
          {/* Category Badge with Gradient */}
          <View style={styles.header}>
            <LinearGradient
              colors={getCategoryColor(event.category)}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.categoryBadge}
            >
              <Text style={styles.categoryText}>{event.category}</Text>
            </LinearGradient>
            
            {/* Urgency and Status Badges */}
            <View style={styles.badgeContainer}>
              {isFull && (
                <LinearGradient
                  colors={[theme.error, theme.errorGradient?.split(' ')[2] || theme.error]}
                  style={styles.urgencyBadge}
                >
                  <Text style={styles.urgencyText}>FULL</Text>
                </LinearGradient>
              )}
              {isAlmostFull && !isFull && (
                <LinearGradient
                  colors={[theme.warning, theme.warningGradient?.split(' ')[2] || theme.warning]}
                  style={styles.urgencyBadge}
                >
                  <Text style={styles.urgencyText}>Almost Full!</Text>
                </LinearGradient>
              )}
            </View>
          </View>
          
          {/* Event Title with Modern Typography */}
          <Text 
            style={[
              styles.title, 
              { 
                color: theme.text,
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.bold,
                letterSpacing: 0.3
              }
            ]} 
            numberOfLines={2}
          >
            {event.name}
          </Text>
          
          {/* Event Details with Enhanced Icons */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
                <Text style={styles.detailIcon}>📅</Text>
              </View>
              <Text style={[styles.detailText, { color: theme.textSecondary }]}>
                {formatDate(event.time)}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <View style={[styles.iconContainer, { backgroundColor: theme.secondary + '20' }]}>
                <Text style={styles.detailIcon}>📍</Text>
              </View>
              <Text style={[styles.detailText, { color: theme.textSecondary }]}>
                {event.venue}
              </Text>
            </View>
          </View>
          
          {/* Enhanced Footer with Progress Bar */}
          <View style={styles.footer}>
            <View style={styles.attendanceSection}>
              <Text style={[styles.attendance, { color: theme.textSecondary }]}>
                👥 {event.registrationCount}/{event.capacity}
              </Text>
              
              {/* Progress Bar */}
              <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                <LinearGradient
                  colors={isFull ? [theme.error, theme.error] : 
                         isAlmostFull ? [theme.warning, theme.warning] : 
                         [theme.success, theme.success]}
                  style={[
                    styles.progressFill,
                    { 
                      width: `${Math.min((event.registrationCount / event.capacity) * 100, 100)}%`
                    }
                  ]}
                />
              </View>
            </View>
            
            <View style={[
              styles.spotsContainer,
              { 
                backgroundColor: isFull ? theme.error + '20' : 
                                isAlmostFull ? theme.warning + '20' : 
                                theme.success + '20'
              }
            ]}>
              <Text style={[
                styles.spots, 
                { 
                  color: isFull ? theme.error : 
                        isAlmostFull ? theme.warning : 
                        theme.success
                }
              ]}>
                {isFull ? 'Full' : `${availableSpots} left`}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Card3D>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    // Card styles are handled by Card3D component
  },
  cardContent: {
    // No additional styling needed as Card3D handles padding
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  badgeContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    ...{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3,
    },
  },
  categoryText: {
    color: '#fff',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  urgencyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    ...{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
  },
  urgencyText: {
    color: '#fff',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.3,
  },
  title: {
    marginBottom: spacing.sm,
    lineHeight: typography.fontSize.lg * 1.3,
  },
  detailsContainer: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailIcon: {
    fontSize: 14,
  },
  detailText: {
    fontSize: typography.fontSize.sm,
    flex: 1,
    fontWeight: typography.fontWeight.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  attendanceSection: {
    flex: 1,
    marginRight: spacing.md,
  },
  attendance: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.xs,
  },
  progressBar: {
    height: 4,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  spotsContainer: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  spots: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});

export default EventCard;