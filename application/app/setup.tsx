import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/context/AnalyticsContext';
import { useConfigStore } from '@/store/configStore';
import { useThemeStore } from '@/store/themeStore';
import { darkTheme, lightTheme } from '@/theme/colors';
import { fonts } from '@/theme/typography';

export default function SetupScreen() {
  const router = useRouter();
  const isDark = useThemeStore((s) => s.isDark);
  const theme = isDark ? darkTheme : lightTheme;
  const bgBase = theme['bg-base'];
  const bgCard = theme['bg-card'];
  const textPrimary = theme['text-primary'];
  const textMuted = theme['text-muted'];
  const accent = theme.accent;
  const accentFg = theme['accent-fg'] ?? (isDark ? '#0D1210' : '#FFFFFF');
  const accentSoft = theme['accent-soft'] ?? '#1E3020';
  const border = theme.border;

  const { setMode, setApiKey } = useConfigStore();
  const { capture } = useAnalytics();
  const { isTrialActive, profile } = useAuth();
  const [selectedMode, setSelectedMode] = useState<'byok' | 'subscription' | null>(null);
  const [keyInput, setKeyInput] = useState('');
  const [saving, setSaving] = useState(false);
  const expandAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(expandAnim, {
      toValue: selectedMode === 'byok' ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [selectedMode, expandAnim]);

  const handleByokComplete = async () => {
    if (!keyInput.trim()) {
      Alert.alert('API key required', 'Enter your Gemini API key.');
      return;
    }
    setSaving(true);
    try {
      await setMode('byok');
      await setApiKey(keyInput.trim());
      capture('setup_mode_selected', { mode: 'byok' });
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      router.replace('/(tabs)');
    } catch (e) {
      Alert.alert('Error', 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubscriptionComplete = async () => {
    if (isTrialActive) {
      await setMode('subscription');
      capture('setup_mode_selected', { mode: 'subscription' });
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      router.replace('/(tabs)');
      return;
    }
    Alert.alert('Coming soon', 'Lifetime subscription purchase will be available soon. Use Bring Your Own Key for now.');
  };

  const handleCta = () => {
    if (selectedMode === 'byok') {
      handleByokComplete();
    } else if (selectedMode === 'subscription') {
      handleSubscriptionComplete();
    } else {
      Alert.alert('Choose an option', 'Select App Subscription or Bring Your Own Key.');
    }
  };

  const isLoading = saving;
  const trialExpired = !!profile?.trial_started_at && !isTrialActive;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgBase }]} edges={['top', 'left', 'right', 'bottom']}>
      {trialExpired ? (
        <Text style={[styles.title, { color: textPrimary }]}>Your 3-day trial has ended</Text>
      ) : (
        <Text style={[styles.title, { color: textPrimary }]}>how do you want to use NutriMind?</Text>
      )}

      <TouchableOpacity
        style={[
          styles.optionCard,
          { backgroundColor: selectedMode === 'subscription' ? accentSoft : bgCard, borderColor: border },
          selectedMode === 'subscription' && styles.optionSelected,
        ]}
        onPress={() => setSelectedMode('subscription')}
        activeOpacity={0.85}
      >
        <Ionicons name="card-outline" size={24} color={textPrimary} style={styles.optionIcon} />
        <View style={styles.optionTextWrap}>
          <Text style={[styles.optionTitle, { color: textPrimary }]}>
            App Subscription {isTrialActive ? '(3 days free)' : '(coming soon)'}
          </Text>
          <Text style={[styles.optionDesc, { color: textMuted }]}>
            {isTrialActive
              ? 'Free for 3 days. Lifetime purchase coming soon.'
              : 'Lifetime purchase coming soon. Use your own key for now.'}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.optionCard,
          { backgroundColor: selectedMode === 'byok' ? accentSoft : bgCard, borderColor: border },
          selectedMode === 'byok' && styles.optionSelected,
        ]}
        onPress={() => setSelectedMode('byok')}
        activeOpacity={0.85}
      >
        <Ionicons name="key-outline" size={24} color={textPrimary} style={styles.optionIcon} />
        <View style={styles.optionTextWrap}>
          <Text style={[styles.optionTitle, { color: textPrimary }]}>Bring Your Own Key</Text>
          <Text style={[styles.optionDesc, { color: textMuted }]}>
            Use your own Gemini API key. Your key stays on your device.
          </Text>
        </View>
      </TouchableOpacity>

      <Animated.View style={[styles.byokExpand, { opacity: expandAnim }]}>
        <TextInput
          style={[styles.input, { backgroundColor: bgCard, color: textPrimary, borderColor: border }]}
          placeholder="paste your api key here"
          placeholderTextColor={textMuted}
          value={keyInput}
          onChangeText={setKeyInput}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />
      </Animated.View>

      <TouchableOpacity
        style={[styles.cta, { backgroundColor: accent }]}
        onPress={handleCta}
        disabled={isLoading}
        activeOpacity={0.9}
      >
        {isLoading ? (
          <Text style={[styles.ctaText, { color: accentFg }]}>Saving...</Text>
        ) : (
          <Text style={[styles.ctaText, { color: accentFg }]}>
            {selectedMode === 'subscription' && isTrialActive ? 'Start free trial →' : "Let's go →"}
          </Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 48,
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.syne.bold,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 32,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  optionSelected: {
    borderWidth: 1.5,
    borderColor: '#A8FF6B',
  },
  optionIcon: { marginRight: 14 },
  optionTextWrap: { flex: 1 },
  optionTitle: { fontFamily: fonts.manrope.bold, fontSize: 17, marginBottom: 4 },
  optionDesc: { fontFamily: fonts.manrope.regular, fontSize: 14 },
  byokExpand: { marginBottom: 12, overflow: 'hidden' },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    fontFamily: fonts.mono,
    fontSize: 14,
  },
  cta: {
    marginTop: 28,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  ctaText: { fontFamily: fonts.syne.bold, fontSize: 17 },
});
