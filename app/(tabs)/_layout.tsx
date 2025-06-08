import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '../context/ThemeContext';
import { darkTheme, lightTheme } from '../theme/colors';

export default function TabLayout() {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4CAF50',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => <View style={{ backgroundColor: theme.tabBarBackground, paddingBottom: 100 }} />,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tracker',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="fitness_center" color={color} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="dashboard" color={color} />,
        }}
      />
    </Tabs>
  );
}
