import { getUserPreferences } from './storage';

export const getRecommendedEvents = async (events) => {
  try {
    const preferences = await getUserPreferences();
    const categoryCount = preferences.categoryCount || {};
    
    if (Object.keys(categoryCount).length === 0) {
      // No preferences yet, return popular events
      return events
        .sort((a, b) => b.registrationCount - a.registrationCount)
        .slice(0, 3);
    }
    
    // Calculate recommendation scores based on user preferences
    const scoredEvents = events.map(event => {
      const categoryScore = categoryCount[event.category] || 0;
      const popularityScore = event.registrationCount / 100; // Normalize popularity
      const capacityScore = (event.capacity - event.registrationCount) / event.capacity; // Availability
      
      // Weighted scoring: preference (60%), popularity (25%), availability (15%)
      const totalScore = (categoryScore * 0.6) + (popularityScore * 0.25) + (capacityScore * 0.15);
      
      return {
        ...event,
        recommendationScore: totalScore
      };
    });
    
    // Sort by recommendation score and return top 3
    return scoredEvents
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 3);
      
  } catch (error) {
    console.error('Error getting recommendations:', error);
    // Fallback to popular events
    return events
      .sort((a, b) => b.registrationCount - a.registrationCount)
      .slice(0, 3);
  }
};

export const getSimilarEvents = (currentEvent, allEvents) => {
  return allEvents
    .filter(event => 
      event.id !== currentEvent.id && 
      event.category === currentEvent.category
    )
    .slice(0, 2);
};

export const getPopularEvents = (events) => {
  return events
    .sort((a, b) => b.registrationCount - a.registrationCount)
    .slice(0, 5);
};

export const getUpcomingEvents = (events) => {
  const now = new Date();
  return events
    .filter(event => new Date(event.time) > now)
    .sort((a, b) => new Date(a.time) - new Date(b.time))
    .slice(0, 5);
};