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
          backgroundColor: item.value === selectedValue ? theme.primary : theme.surface,
          borderBottomColor: theme.border
        }
      ]}
      onPress={() => handleSelect(item.value)}
    >
      <Text 
        style={[
          styles.optionText, 
          { 
            color: item.value === selectedValue ? '#ffffff' : theme.text,
            fontWeight: item.value === selectedValue ? 'bold' : 'normal'
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
        style={[
          styles.dropdown,
          { 
            backgroundColor: theme.surface,
            borderColor: theme.border
          }
        ]}
        onPress={() => setIsVisible(true)}
      >
        <Text 
          style={[
            styles.dropdownText,
            { color: theme.text }
          ]}
          numberOfLines={1}
        >
          {getSelectedLabel()}
        </Text>
        <Text 
          style={[
            styles.arrow,
            { color: theme.text }
          ]}
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
            style={[
              styles.modalContent,
              { 
                backgroundColor: theme.surface,
                borderColor: theme.border
              }
            ]}
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

const styles = StyleSheet.create({
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    minHeight: 48,
  },
  dropdownText: {
    fontSize: 16,
    flex: 1,
  },
  arrow: {
    fontSize: 12,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '60%',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
  },
});

export default CustomDropdown;
