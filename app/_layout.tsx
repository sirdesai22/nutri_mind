import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';
import { Platform, View } from 'react-native';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { darkTheme, lightTheme } from './theme/colors';

// Initialize SVG components
if (Platform.OS === 'ios') {
  require('react-native-svg');
}

function RootLayoutContent() {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}
