import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { categories } from '../data/mockEvents';
import CustomDropdown from './CustomDropdown';

const SearchFilterBar = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory,
  sortBy,
  setSortBy 
}) => {
  const { theme } = useTheme();

  // Prepare options for dropdowns
  const categoryOptions = categories.map(category => ({
    label: category,
    value: category
  }));

  const sortOptions = [
    { label: "By Date", value: "date" },
    { label: "Most Popular", value: "popular" },
    { label: "Newest", value: "newest" },
    { label: "Availability", value: "availability" }
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <TextInput
        style={[styles.searchInput, { 
          backgroundColor: theme.background, 
          color: theme.text,
          borderColor: theme.border 
        }]}
        placeholder="Search events or venues..."
        placeholderTextColor={theme.textSecondary}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      <View style={styles.filtersRow}>
        <View style={styles.dropdownContainer}>
          <CustomDropdown
            selectedValue={selectedCategory}
            onValueChange={setSelectedCategory}
            options={categoryOptions}
            placeholder="All Categories"
          />
        </View>
        
        <View style={styles.dropdownContainer}>
          <CustomDropdown
            selectedValue={sortBy}
            onValueChange={setSortBy}
            options={sortOptions}
            placeholder="Sort By"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    zIndex: 1000,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  dropdownContainer: {
    flex: 1,
  },
});

export default SearchFilterBar;