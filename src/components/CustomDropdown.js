import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const CustomDropdown = ({ 
  selectedValue, 
  onValueChange, 
  options, 
  placeholder = "Select option..." 
}) => {
  const { theme } = useTheme();
  const styles = createThemedStyles(theme);
  const [isVisible, setIsVisible] = useState(false);

  const handleSelect = (value) => {
    onValueChange(value);
    setIsVisible(false);
  };

  const getSelectedLabel = () => {
    const selected = options.find(option => option.value === selectedValue);
    return selected ? selected.label : placeholder;
  };

  const renderOption = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.option,
        { 
          backgroundColor: item.value === selectedValue ? theme.colors.primary : theme.colors.surface,
          borderBottomColor: theme.colors.border,
        }
      ]}
      onPress={() => handleSelect(item.value)}
    >
      <Text 
        style={[
          styles.optionText, 
          { 
            color: item.value === selectedValue ? '#FFFFFF' : theme.colors.text,
            fontWeight: item.value === selectedValue ? 'bold' : 'normal',
          }
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsVisible(true)}
      >
        <Text 
          style={styles.dropdownText}
          numberOfLines={1}
        >
          {getSelectedLabel()}
        </Text>
        <Text 
          style={styles.arrow}
        >
          ▼
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setIsVisible(false)}
        >
          <View 
            style={styles.modalContent}
          >
            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={(item) => item.value.toString()}
              showsVerticalScrollIndicator={false}
              bounces={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const createThemedStyles = (theme) => StyleSheet.create({
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: theme.radii.m,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    minHeight: 48,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  dropdownText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text,
    flex: 1,
  },
  arrow: {
    fontSize: 12,
    marginLeft: theme.spacing.s,
    color: theme.colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '60%',
    borderRadius: theme.radii.l,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
  },
  option: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: theme.typography.sizes.body,
  },
});

export default CustomDropdown;
