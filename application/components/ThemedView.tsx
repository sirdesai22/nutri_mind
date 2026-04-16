import React from 'react';
import { View, type ViewProps } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { darkTheme, lightTheme } from '@/theme/colors';

export function ThemedView({ style, ...props }: ViewProps) {
  const isDark = useThemeStore((s) => s.isDark);
  const bg = isDark ? darkTheme['bg-base'] : lightTheme['bg-base'];
  return <View style={[{ backgroundColor: bg }, style]} {...props} />;
}
