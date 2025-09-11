import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const DropdownMenu = ({ options, value, onValueChange, style }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();

  const selectedOption = options.find(option => option.value === value);

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.card }]}
        onPress={() => setIsVisible(true)}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>
          {selectedOption?.label || 'Select option'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  option.value === value && styles.selectedOption,
                ]}
                onPress={() => {
                  onValueChange(option.value);
                  setIsVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: theme.text },
                    option.value === value && styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  button: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  buttonText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 12,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  option: {
    padding: 16,
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: 'rgba(0,122,255,0.1)',
  },
  optionText: {
    fontSize: 16,
  },
  selectedOptionText: {
    fontWeight: '600',
  },
});

export default DropdownMenu;
