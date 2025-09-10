import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { categories } from '../data/mockEvents';
import CustomDropdown from './CustomDropdown';
import Input3D from './Input3D';
import Card3D from './Card3D';
import { spacing, borderRadius, typography } from '../utils/designSystem';

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
    <Card3D 
      variant="elevated" 
      size="medium" 
      style={styles.container}
      glassEffect={true}
    >
      {/* Search Input with 3D Effects */}
      <Input3D
        placeholder="Search events or venues... 🔍"
        value={searchQuery}
        onChangeText={setSearchQuery}
        variant="filled"
        gradientBorder={true}
        icon={<Text style={styles.searchIcon}>🔍</Text>}
        style={styles.searchInput}
      />
      
      {/* Filter Row */}
      <View style={styles.filtersRow}>
        <View style={styles.dropdownContainer}>
          <Text style={[styles.filterLabel, { color: theme.text }]}>Category</Text>
          <CustomDropdown
            selectedValue={selectedCategory}
            onValueChange={setSelectedCategory}
            options={categoryOptions}
            placeholder="All Categories"
          />
        </View>
        
        <View style={styles.dropdownContainer}>
          <Text style={[styles.filterLabel, { color: theme.text }]}>Sort By</Text>
          <CustomDropdown
            selectedValue={sortBy}
            onValueChange={setSortBy}
            options={sortOptions}
            placeholder="Sort By"
          />
        </View>
      </View>
    </Card3D>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: spacing.md,
    zIndex: 1000,
  },
  searchInput: {
    marginBottom: spacing.md,
  },
  searchIcon: {
    fontSize: 18,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  dropdownContainer: {
    flex: 1,
  },
  filterLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
    letterSpacing: 0.3,
  },
});

export default SearchFilterBar;