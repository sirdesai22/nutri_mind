import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <TouchableOpacity onPress={toggleTheme} style={styles.container}>
      <Ionicons
        name={theme === 'dark' ? 'sunny' : 'moon'}
        size={24}
        color={theme === 'dark' ? '#FFD700' : '#2C3E50'}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 20,
  },
}); 