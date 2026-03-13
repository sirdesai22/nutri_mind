import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAnalytics } from '@/context/AnalyticsContext';
import { useThemeStore } from '@/store/themeStore';
import { darkTheme, lightTheme } from '@/app/theme/colors';
import { fonts } from '@/app/theme/typography';

const ONBOARDING_COMPLETE_KEY = 'onboarding_complete';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FEATURES = [
  {
    icon: 'nutrition-outline' as const,
    label: 'AI-powered analysis',
    description: 'Describe any meal in plain English. Get instant calorie and macro estimates.',
  },
  {
    icon: 'trending-up-outline' as const,
    label: 'Track your progress',
    description: 'Weekly charts and daily summaries help you stay on top of your goals.',
  },
  {
    icon: 'shield-checkmark-outline' as const,
    label: 'Your data stays yours',
    description: 'Offline-first. Sync when you want. No ads, no tracking.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { capture } = useAnalytics();
  const isDark = useThemeStore((s) => s.isDark);
  const theme = isDark ? darkTheme : lightTheme;
  const bgBase = theme['bg-base'];
  const textPrimary = theme['text-primary'];
  const textMuted = theme['text-muted'];
  const accent = theme.accent;
  const accentFg = theme['accent-fg'] ?? (isDark ? '#0D1210' : '#FFFFFF');
  const bgCard = theme['bg-card'];

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentIndex(idx);
  };

  const handleGetStarted = async () => {
    capture('onboarding_completed');
    await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
    router.replace('/auth');
  };

  const renderSlide = ({ item, index }: { item: string; index: number }) => {
    if (index === 0) {
      return (
        <View style={[styles.slide, { width: SCREEN_WIDTH, backgroundColor: bgBase }]}>
          <View style={styles.slideContent}>
            <Text style={[styles.heroTitle, { color: textPrimary }]}>NutriMind</Text>
            <Text style={[styles.heroSubtext, { color: textMuted }]}>
              Log meals in plain English. Get instant calorie and macro estimates powered by AI.
            </Text>
            <TouchableOpacity
              style={[styles.cta, { backgroundColor: accent }]}
              onPress={handleGetStarted}
              activeOpacity={0.9}
            >
              <Text style={[styles.ctaText, { color: accentFg }]}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (index === 1) {
      return (
        <View style={[styles.slide, { width: SCREEN_WIDTH, backgroundColor: bgBase }]}>
          <View style={styles.slideContent}>
            <Text style={[styles.heroTitle, { color: textPrimary, fontSize: 24 }]}>Features</Text>
            <Text style={[styles.heroSubtext, { color: textMuted, marginBottom: 32 }]}>
              Everything you need to track nutrition
            </Text>
            {FEATURES.map((f, i) => (
              <Animated.View
                key={f.label}
                entering={FadeInDown.delay(150 * i).duration(300)}
                style={[styles.featureRow, { backgroundColor: bgCard }]}
              >
                <Ionicons name={f.icon} size={28} color={accent} style={styles.featureIcon} />
                <View style={styles.featureText}>
                  <Text style={[styles.featureLabel, { color: textPrimary }]}>{f.label}</Text>
                  <Text style={[styles.featureDesc, { color: textMuted }]}>{f.description}</Text>
                </View>
              </Animated.View>
            ))}
            <TouchableOpacity
              style={[styles.cta, { backgroundColor: accent, marginTop: 24 }]}
              onPress={handleGetStarted}
              activeOpacity={0.9}
            >
              <Text style={[styles.ctaText, { color: accentFg }]}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (index === 2) {
      return (
        <View style={[styles.slide, { width: SCREEN_WIDTH, backgroundColor: bgBase }]}>
          <View style={styles.slideContent}>
            <Text style={[styles.heroTitle, { color: textPrimary, fontSize: 24 }]}>Join thousands</Text>
            <View style={[styles.socialProof, { backgroundColor: bgCard }]}>
              <Text style={[styles.quote, { color: textPrimary }]}>
                "Finally, an app that understands 'two chicken tacos and a side of rice'." — Sarah M.
              </Text>
              <Text style={[styles.metric, { color: accent }]}>50K+ meals logged</Text>
            </View>
            <TouchableOpacity
              style={[styles.cta, { backgroundColor: accent }]}
              onPress={handleGetStarted}
              activeOpacity={0.9}
            >
              <Text style={[styles.ctaText, { color: accentFg }]}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgBase }]} edges={['top', 'left', 'right', 'bottom']}>
      <FlatList
        ref={flatListRef}
        data={['hero', 'features', 'social']}
        renderItem={renderSlide}
        keyExtractor={(item) => item}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      <View style={styles.dots}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i === currentIndex ? accent : textMuted },
              i === currentIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideContent: {
    paddingHorizontal: 28,
    alignItems: 'center',
    maxWidth: 360,
  },
  heroTitle: {
    fontFamily: fonts.syne.bold,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtext: {
    fontFamily: fonts.manrope.regular,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  cta: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  ctaText: {
    fontFamily: fonts.syne.bold,
    fontSize: 17,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
  },
  featureIcon: {
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureLabel: {
    fontFamily: fonts.manrope.semiBold,
    fontSize: 16,
    marginBottom: 4,
  },
  featureDesc: {
    fontFamily: fonts.manrope.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  socialProof: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 32,
    width: '100%',
  },
  quote: {
    fontFamily: fonts.manrope.regular,
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 16,
    lineHeight: 24,
  },
  metric: {
    fontFamily: fonts.syne.bold,
    fontSize: 18,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.5,
  },
  dotActive: {
    opacity: 1,
    width: 24,
  },
});
