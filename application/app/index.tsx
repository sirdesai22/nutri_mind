import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useConfigStore } from '@/store/configStore';

const ONBOARDING_COMPLETE_KEY = 'onboarding_complete';

export default function IndexRedirect() {
  const { session, subscriptionStatus, isTrialActive, loading: authLoading } = useAuth();
  const { hydrate, mode, hasApiKey, isLoading: configLoading } = useConfigStore();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY).then((v) => {
      setOnboardingComplete(v === 'true');
    });
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const loading = onboardingComplete === null || authLoading || configLoading;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!onboardingComplete) {
    return <Redirect href="/onboarding" />;
  }

  if (!session) {
    return <Redirect href="/auth" />;
  }

  if (subscriptionStatus === 'lifetime') {
    return <Redirect href="/(tabs)" />;
  }
  if (mode === 'byok' && hasApiKey) {
    return <Redirect href="/(tabs)" />;
  }
  if (isTrialActive && mode === 'subscription') {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/setup" />;
}
