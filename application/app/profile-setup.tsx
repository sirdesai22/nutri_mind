import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useProfileStore } from '@/store/profileStore';
import { useThemeStore } from '@/store/themeStore';
import { darkTheme, lightTheme } from '@/app/theme/colors';
import { fonts } from '@/app/theme/typography';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const isDark = useThemeStore((s) => s.isDark);
  const theme = isDark ? darkTheme : lightTheme;
  const bgBase = theme['bg-base'];
  const bgCard = theme['bg-card'];
  const textPrimary = theme['text-primary'];
  const textMuted = theme['text-muted'];
  const accent = theme.accent;
  const accentFg = theme['accent-fg'] ?? (isDark ? '#0D1210' : '#FFFFFF');
  const border = theme.border;

  const { profile, setProfileData, getBmi, getMaintenanceCalories } = useProfileStore();

  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age ? String(profile.age) : '');
  const [heightCm, setHeightCm] = useState(profile.heightCm ? String(profile.heightCm) : '');
  const [weightKg, setWeightKg] = useState(profile.weightKg ? String(profile.weightKg) : '');
  const [submitting, setSubmitting] = useState(false);

  const liveBmi = useMemo(() => {
    const a = Number(age) || null;
    const h = Number(heightCm) || null;
    const w = Number(weightKg) || null;
    if (!h || !w) return null;
    const hMeters = h / 100;
    if (hMeters <= 0) return null;
    const bmi = w / (hMeters * hMeters);
    return Number.isFinite(bmi) ? Math.round(bmi * 10) / 10 : null;
  }, [age, heightCm, weightKg]);

  const liveMaintenance = useMemo(() => {
    const a = Number(age) || null;
    const h = Number(heightCm) || null;
    const w = Number(weightKg) || null;
    if (!a || !h || !w) return null;
    const bmr = 10 * w + 6.25 * h - 5 * a + 5;
    const maintenance = bmr * 1.55;
    return Number.isFinite(maintenance) ? Math.round(maintenance) : null;
  }, [age, heightCm, weightKg]);

  const canContinue = name.trim().length > 0 && Number(age) > 0 && Number(heightCm) > 0 && Number(weightKg) > 0;

  const handleContinue = async () => {
    if (!canContinue || submitting) return;
    setSubmitting(true);
    setProfileData({
      name: name.trim(),
      age: Number(age) || null,
      heightCm: Number(heightCm) || null,
      weightKg: Number(weightKg) || null,
    });
    // rely on updated profileComplete in store
    router.replace('/setup');
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: bgBase }]} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: textPrimary }]}>Set up your profile</Text>
          <Text style={[styles.headerSubtitle, { color: textMuted }]}>
            We use this to estimate your BMI and daily calorie needs.
          </Text>
        </View>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            entering={FadeInDown.duration(300)}
            style={[styles.card, { backgroundColor: bgCard, borderColor: border }]}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: textPrimary }]}>Basics</Text>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: textMuted }]}>Name</Text>
              <TextInput
                style={[
                  styles.input,
                  { borderColor: border, color: textPrimary, backgroundColor: bgBase },
                ]}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={textMuted}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
            <Animated.View entering={FadeInDown.delay(80).duration(260)} style={styles.row}>
              <View style={styles.col}>
                <Text style={[styles.label, { color: textMuted }]}>Age</Text>
                <TextInput
                  style={[
                    styles.input,
                    { borderColor: border, color: textPrimary, backgroundColor: bgBase },
                  ]}
                  value={age}
                  onChangeText={setAge}
                  placeholder="24"
                  placeholderTextColor={textMuted}
                  keyboardType="numeric"
                  returnKeyType="next"
                />
              </View>
              <View style={styles.col}>
                <Text style={[styles.label, { color: textMuted }]}>Height (cm)</Text>
                <TextInput
                  style={[
                    styles.input,
                    { borderColor: border, color: textPrimary, backgroundColor: bgBase },
                  ]}
                  value={heightCm}
                  onChangeText={setHeightCm}
                  placeholder="172"
                  placeholderTextColor={textMuted}
                  keyboardType="numeric"
                  returnKeyType="next"
                />
              </View>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(140).duration(260)} style={styles.row}>
              <View style={styles.col}>
                <Text style={[styles.label, { color: textMuted }]}>Weight (kg)</Text>
                <TextInput
                  style={[
                    styles.input,
                    { borderColor: border, color: textPrimary, backgroundColor: bgBase },
                  ]}
                  value={weightKg}
                  onChangeText={setWeightKg}
                  placeholder="68"
                  placeholderTextColor={textMuted}
                  keyboardType="numeric"
                  returnKeyType="done"
                />
              </View>
              <View style={styles.colSummary}>
                <Text style={[styles.summaryLabel, { color: textMuted }]}>Estimated BMI</Text>
                <Text style={[styles.summaryValue, { color: textPrimary }]}>
                  {liveBmi ?? getBmi() ?? '—'}
                </Text>
                <Text style={[styles.summaryHint, { color: textMuted }]}>18.5–24.9 is considered normal</Text>
              </View>
            </Animated.View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(220).duration(260)}
            style={[styles.card, { backgroundColor: bgCard, borderColor: border }]}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: textPrimary }]}>Daily calories</Text>
            </View>
            <Text style={[styles.helperText, { color: textMuted }]}>
              Based on your details, we estimate your maintenance calories:
            </Text>
            <View style={styles.kcalRow}>
              <Text style={[styles.kcalValue, { color: textPrimary }]}>
                {liveMaintenance ?? getMaintenanceCalories() ?? '—'}
              </Text>
              <Text style={[styles.kcalUnit, { color: textMuted }]}>kcal / day</Text>
            </View>
            <Text style={[styles.helperSmall, { color: textMuted }]}>
              You can fine-tune your daily macro goals later from the Profile tab.
            </Text>
          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.primaryCta,
              { backgroundColor: canContinue ? accent : 'rgba(0,0,0,0.15)' },
            ]}
            disabled={!canContinue || submitting}
            onPress={handleContinue}
            activeOpacity={0.9}
          >
            <Text style={[styles.primaryCtaText, { color: accentFg }]}>
              {submitting ? 'Saving…' : 'Continue'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color={accentFg} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  headerTitle: {
    fontFamily: fonts.syne.bold,
    fontSize: 22,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: fonts.manrope.regular,
    fontSize: 14,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontFamily: fonts.manrope.bold,
    fontSize: 15,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    fontFamily: fonts.manrope.medium,
    fontSize: 13,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: fonts.manrope.regular,
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  col: {
    flex: 1,
  },
  colSummary: {
    flex: 1.1,
    justifyContent: 'center',
  },
  summaryLabel: {
    fontFamily: fonts.manrope.medium,
    fontSize: 12,
    marginBottom: 4,
  },
  summaryValue: {
    fontFamily: fonts.syne.bold,
    fontSize: 24,
  },
  summaryHint: {
    fontFamily: fonts.manrope.regular,
    fontSize: 11,
    marginTop: 2,
  },
  helperText: {
    fontFamily: fonts.manrope.regular,
    fontSize: 13,
    marginBottom: 8,
  },
  helperSmall: {
    fontFamily: fonts.manrope.regular,
    fontSize: 12,
    marginTop: 8,
  },
  kcalRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  kcalValue: {
    fontFamily: fonts.syne.bold,
    fontSize: 32,
  },
  kcalUnit: {
    fontFamily: fonts.manrope.regular,
    fontSize: 14,
    paddingBottom: 4,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  primaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 999,
    gap: 8,
  },
  primaryCtaText: {
    fontFamily: fonts.syne.bold,
    fontSize: 16,
  },
});

