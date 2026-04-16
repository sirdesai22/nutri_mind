import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { darkTheme, lightTheme } from '@/theme/colors';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';
  const accent = isDark ? darkTheme.accent : lightTheme.accent;
  const textMuted = isDark ? darkTheme['text-muted'] : lightTheme['text-muted'];

  return (
    <TouchableOpacity onPress={toggleTheme} style={styles.container}>
      <Ionicons
        name={isDark ? 'sunny' : 'moon'}
        size={22}
        color={isDark ? accent : textMuted}
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
