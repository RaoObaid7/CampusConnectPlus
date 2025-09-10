import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import SearchFilterBar from '../components/SearchFilterBar';
import EventList from '../components/EventList';
import AIRecommendations from '../components/AIRecommendations';

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createThemedStyles(theme);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  return (
    <SafeAreaView style={styles.container}>
      <SearchFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <EventList
        navigation={navigation}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        sortBy={sortBy}
        headerContent={<AIRecommendations navigation={navigation} />}
      />
    </SafeAreaView>
  );
};

const createThemedStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

export default HomeScreen;