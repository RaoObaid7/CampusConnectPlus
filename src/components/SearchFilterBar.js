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
  const styles = createThemedStyles(theme);

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
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search events or venues..."
        placeholderTextColor={theme.colors.textSecondary}
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

const createThemedStyles = (theme) => StyleSheet.create({
  container: {
    padding: theme.spacing.m,
    zIndex: 1000,
    backgroundColor: theme.colors.surface,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: theme.radii.m,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    fontSize: theme.typography.sizes.body,
    marginBottom: theme.spacing.m,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    borderColor: theme.colors.border,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: theme.spacing.m,
    justifyContent: 'space-between',
  },
  dropdownContainer: {
    flex: 1,
  },
});

export default SearchFilterBar;