import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/HapticTab';
import { useThemeStore } from '@/store/themeStore';
import { darkTheme, lightTheme } from '../theme/colors';
import { fonts } from '../theme/typography';

const TAB_BAR_HEIGHT = 56;

function TabIcon({
  name,
  focusedName,
  focused,
  color,
  accentColor,
}: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  focusedName: React.ComponentProps<typeof Ionicons>['name'];
  focused: boolean;
  color: string;
  accentColor: string;
}) {
  return (
    <View style={tabIconStyles.wrap}>
      <Ionicons name={focused ? focusedName : name} size={22} color={color} />
      {focused && <View style={[tabIconStyles.dot, { backgroundColor: accentColor }]} />}
    </View>
  );
}

const tabIconStyles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  dot: { width: 4, height: 4, borderRadius: 2, marginTop: 3 },
});

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const isDark = useThemeStore((s) => s.isDark);
  const theme = isDark ? darkTheme : lightTheme;
  const tabBarBg = theme['bg-surface'] ?? theme.tabBarBackground;

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme['text-muted'],
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarLabelStyle: { fontFamily: fonts.manrope.medium, fontSize: 11, marginTop: -4 },
          tabBarBackground: () => (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: tabBarBg }]} />
          ),
          tabBarStyle: [
            Platform.select({
              ios: { position: 'absolute' as const },
              default: {},
            }),
            {
              height: TAB_BAR_HEIGHT + insets.bottom,
              backgroundColor: tabBarBg,
              borderTopColor: theme.border,
              borderTopWidth: 1,
            },
          ],
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Tracker',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name="restaurant-outline"
                focusedName="restaurant"
                focused={focused}
                color={color}
                accentColor={theme.accent}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Progress',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name="analytics-outline"
                focusedName="analytics"
                focused={focused}
                color={color}
                accentColor={theme.accent}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
