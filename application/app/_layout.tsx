import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import React from 'react';
import { PostHogProvider } from 'posthog-react-native';
import { AuthAnalyticsSync } from '@/components/AuthAnalyticsSync';
import { AnalyticsProvider, NoopAnalyticsProvider } from '@/context/AnalyticsContext';
import { Platform, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useThemeStore } from '@/store/themeStore';
import { darkTheme, lightTheme } from '@/theme/colors';

if (Platform.OS === 'ios') {
  require('react-native-svg');
}

function RootLayoutContent() {
  const isDark = useThemeStore((s) => s.isDark);
  const theme = isDark ? darkTheme : lightTheme;
  const bg = theme['bg-base'] ?? theme.background;

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: bg }}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={bg}
        translucent={Platform.OS === 'android'}
      />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: bg },
          animation: 'none',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="profile-setup" />
        <Stack.Screen name="setup" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </SafeAreaProvider>
  );
}

const APP_FONTS = (() => {
  try {
    const syne = require('@expo-google-fonts/syne');
    const manrope = require('@expo-google-fonts/manrope');
    const ibmPlexMono = require('@expo-google-fonts/ibm-plex-mono');
    return {
      ...syne.Syne_400Regular,
      ...syne.Syne_700Bold,
      ...manrope.Manrope_400Regular,
      ...manrope.Manrope_500Medium,
      ...manrope.Manrope_600SemiBold,
      ...manrope.Manrope_700Bold,
      ...ibmPlexMono.IBMPlexMono_400Regular,
      ...ibmPlexMono.IBMPlexMono_500Medium,
    };
  } catch {
    return {};
  }
})();

const posthogApiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY ?? '';
const posthogHost = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';

export default function RootLayout() {
  const [fontsLoaded] = useFonts(APP_FONTS);

  if (!fontsLoaded) {
    return null;
  }

  const AnalyticsWrapper = posthogApiKey ? (
    <PostHogProvider apiKey={posthogApiKey} options={{ host: posthogHost }}>
      <AnalyticsProvider>
        <AuthAnalyticsSync />
        <RootLayoutContent />
      </AnalyticsProvider>
    </PostHogProvider>
  ) : (
    <NoopAnalyticsProvider>
      <AuthAnalyticsSync />
      <RootLayoutContent />
    </NoopAnalyticsProvider>
  );
  return AnalyticsWrapper;
}
