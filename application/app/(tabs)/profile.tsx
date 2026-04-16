import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SkeletonShimmer } from '@/components/SkeletonShimmer';
import { useAuth } from '@/hooks/useAuth';
import { useMealStore } from '@/store/mealStore';
import { useProfileStore } from '@/store/profileStore';
import { useThemeStore } from '@/store/themeStore';
import { darkTheme, lightTheme } from '@/theme/colors';
import { fonts } from '@/theme/typography';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, setProfileData, getBmi, getMaintenanceCalories, setMacroTargets } = useProfileStore();
  const clearMeals = useMealStore((s) => s.clearAll);

  const isDark = useThemeStore((s) => s.isDark);
  const theme = isDark ? darkTheme : lightTheme;
  const bgBase = theme['bg-base'];
  const bgCard = theme['bg-card'];
  const textPrimary = theme['text-primary'];
  const textMuted = theme['text-muted'];
  const accent = theme.accent;
  const accentFg = theme['accent-fg'] ?? (isDark ? '#0D1210' : '#FFFFFF');
  const border = theme.border;

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editAge, setEditAge] = useState(profile.age ? String(profile.age) : '');
  const [editHeight, setEditHeight] = useState(profile.heightCm ? String(profile.heightCm) : '');
  const [editWeight, setEditWeight] = useState(profile.weightKg ? String(profile.weightKg) : '');

  const [editGoalsOpen, setEditGoalsOpen] = useState(false);
  const [editCalories, setEditCalories] = useState(String(profile.macroTargets.calories));
  const [editCarbs, setEditCarbs] = useState(String(profile.macroTargets.carbs));
  const [editProtein, setEditProtein] = useState(String(profile.macroTargets.protein));
  const [editFats, setEditFats] = useState(String(profile.macroTargets.fats));

  const streakValue = useMemo(() => {
    const data = useMealStore.getState().data;
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split('T')[0];
      if ((data[key]?.meals?.length ?? 0) > 0) count++;
      else break;
    }
    return count;
  }, []);

  const initials = useMemo(() => {
    if (profile.name.trim().length === 0 && user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return profile.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p.charAt(0).toUpperCase())
      .join('');
  }, [profile.name, user?.email]);

  const bmi = getBmi();
  const maintenance = getMaintenanceCalories();

  const subStatusLabel =
    profile.subscription_status === 'lifetime'
      ? 'Lifetime access'
      : profile.subscription_status === 'trial'
      ? 'Trial'
      : 'Free';

  const signOutScale = useSharedValue(1);
  const signOutStyle = useAnimatedStyle(() => ({
    transform: [{ scale: signOutScale.value }],
  }));

  const handlePressSignOutIn = () => {
    signOutScale.value = withSpring(0.96);
  };
  const handlePressSignOutOut = () => {
    signOutScale.value = withSpring(1);
  };

  const handleSaveProfile = () => {
    setProfileData({
      name: editName.trim(),
      age: Number(editAge) || null,
      heightCm: Number(editHeight) || null,
      weightKg: Number(editWeight) || null,
    });
    setEditProfileOpen(false);
  };

  const handleSaveGoals = () => {
    setMacroTargets({
      calories: Number(editCalories) || 2000,
      carbs: Number(editCarbs) || 250,
      protein: Number(editProtein) || 150,
      fats: Number(editFats) || 65,
    });
    setEditGoalsOpen(false);
  };

  const handleResetAll = () => {
    Alert.alert('Reset everything?', 'This will clear all meals and local profile data.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          await clearMeals();
          await useProfileStore.getState().clearProfile();
        },
      },
    ]);
  };

  const loading = authLoading;

  return (
    <View style={[styles.container, { backgroundColor: bgBase }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bgBase} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: border, backgroundColor: bgBase }]}>
        <Text style={[styles.headerTitle, { color: textPrimary }]}>Profile</Text>
        <View style={styles.headerRight}>
          <ThemeToggle />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <>
            <SkeletonShimmer height={140} borderRadius={16} style={styles.skeletonCard} />
            <SkeletonShimmer height={160} borderRadius={16} style={styles.skeletonCard} />
            <SkeletonShimmer height={150} borderRadius={16} style={styles.skeletonCard} />
          </>
        ) : (
          <>
            {/* Card 1 — User Info */}
            <Animated.View
              entering={FadeInDown.duration(260)}
              style={[styles.card, { backgroundColor: bgCard, borderColor: border }]}
            >
              <View style={styles.userRow}>
                <View style={[styles.avatar, { backgroundColor: accent }]}>
                  <Text style={[styles.avatarText, { color: accentFg }]}>
                    {initials || '?'}
                  </Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={[styles.nameText, { color: textPrimary }]}>
                    {profile.name || 'Anonymous'}
                  </Text>
                  <Text style={[styles.emailText, { color: textMuted }]}>
                    {user?.email ?? 'No email'}
                  </Text>
                </View>
                <View style={[styles.subPill, { borderColor: border }]}>
                  <Text style={[styles.subPillText, { color: textMuted }]}>{subStatusLabel}</Text>
                </View>
              </View>
            </Animated.View>

            {/* Card 2 — Body Stats */}
            <Animated.View
              entering={FadeInDown.delay(80).duration(260)}
              style={[styles.card, { backgroundColor: bgCard, borderColor: border }]}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: textPrimary }]}>Body stats</Text>
                <TouchableOpacity
                  onPress={() => {
                    setEditName(profile.name);
                    setEditAge(profile.age ? String(profile.age) : '');
                    setEditHeight(profile.heightCm ? String(profile.heightCm) : '');
                    setEditWeight(profile.weightKg ? String(profile.weightKg) : '');
                    setEditProfileOpen(true);
                  }}
                  style={styles.iconButton}
                  hitSlop={10}
                >
                  <Ionicons name="pencil-outline" size={16} color={textMuted} />
                </TouchableOpacity>
              </View>
              <View style={styles.statsGrid}>
                <View style={styles.statCell}>
                  <Text style={[styles.statLabel, { color: textMuted }]}>Age</Text>
                  <Text style={[styles.statValue, { color: textPrimary }]}>
                    {profile.age ?? '—'}
                  </Text>
                </View>
                <View style={styles.statCell}>
                  <Text style={[styles.statLabel, { color: textMuted }]}>Height</Text>
                  <Text style={[styles.statValue, { color: textPrimary }]}>
                    {profile.heightCm ? `${profile.heightCm} cm` : '—'}
                  </Text>
                </View>
                <View style={styles.statCell}>
                  <Text style={[styles.statLabel, { color: textMuted }]}>Weight</Text>
                  <Text style={[styles.statValue, { color: textPrimary }]}>
                    {profile.weightKg ? `${profile.weightKg} kg` : '—'}
                  </Text>
                </View>
                <View style={styles.statCell}>
                  <Text style={[styles.statLabel, { color: textMuted }]}>BMI</Text>
                  <Text style={[styles.statValue, { color: textPrimary }]}>
                    {bmi ?? '—'}
                  </Text>
                </View>
              </View>
              <Text style={[styles.helperText, { color: textMuted }]}>
                Maintenance calories:{' '}
                <Text style={{ color: textPrimary, fontFamily: fonts.syne.bold }}>
                  {maintenance ? `${maintenance} kcal/day` : '—'}
                </Text>
              </Text>
            </Animated.View>

            {/* Card 3 — Daily Goals */}
            <Animated.View
              entering={FadeInDown.delay(160).duration(260)}
              style={[styles.card, { backgroundColor: bgCard, borderColor: border }]}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: textPrimary }]}>Daily goals</Text>
                <TouchableOpacity
                  onPress={() => {
                    setEditCalories(String(profile.macroTargets.calories));
                    setEditCarbs(String(profile.macroTargets.carbs));
                    setEditProtein(String(profile.macroTargets.protein));
                    setEditFats(String(profile.macroTargets.fats));
                    setEditGoalsOpen(true);
                  }}
                  style={styles.iconButton}
                  hitSlop={10}
                >
                  <Ionicons name="pencil-outline" size={16} color={textMuted} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.goalCalories, { color: textPrimary }]}>
                {profile.macroTargets.calories} kcal
              </Text>
              <View style={styles.goalMacrosRow}>
                <View style={styles.goalMacro}>
                  <Text style={[styles.goalMacroValue, { color: textPrimary }]}>
                    {profile.macroTargets.carbs}g
                  </Text>
                  <Text style={[styles.goalMacroLabel, { color: textMuted }]}>Carbs</Text>
                </View>
                <View style={styles.goalMacro}>
                  <Text style={[styles.goalMacroValue, { color: textPrimary }]}>
                    {profile.macroTargets.protein}g
                  </Text>
                  <Text style={[styles.goalMacroLabel, { color: textMuted }]}>Protein</Text>
                </View>
                <View style={styles.goalMacro}>
                  <Text style={[styles.goalMacroValue, { color: textPrimary }]}>
                    {profile.macroTargets.fats}g
                  </Text>
                  <Text style={[styles.goalMacroLabel, { color: textMuted }]}>Fats</Text>
                </View>
              </View>
            </Animated.View>

            {/* Card 4 — Account */}
            <Animated.View
              entering={FadeInDown.delay(240).duration(260)}
              style={[styles.card, { backgroundColor: bgCard, borderColor: border }]}
            >
              <Text style={[styles.cardTitle, { color: textPrimary, marginBottom: 12 }]}>
                Account
              </Text>
              <Animated.View style={[styles.signOutBtn, signOutStyle]}>
                <TouchableOpacity
                  onPress={signOut}
                  onPressIn={handlePressSignOutIn}
                  onPressOut={handlePressSignOutOut}
                  activeOpacity={0.9}
                  style={styles.signOutTouchable}
                >
                  <Ionicons name="log-out-outline" size={18} color={accentFg} />
                  <Text style={[styles.signOutText, { color: accentFg }]}>Sign out</Text>
                </TouchableOpacity>
              </Animated.View>
              <TouchableOpacity
                onPress={handleResetAll}
                style={styles.resetRow}
              >
                <Ionicons name="trash-outline" size={16} color={textMuted} />
                <Text style={[styles.resetText, { color: textMuted }]}>Reset all data</Text>
              </TouchableOpacity>
            </Animated.View>
          </>
        )}
      </ScrollView>

      {/* Edit profile modal */}
      <Modal
        visible={editProfileOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setEditProfileOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: bgCard }]}>
            <Text style={[styles.modalTitle, { color: textPrimary }]}>Edit profile</Text>
            <TextInput
              style={[
                styles.modalInput,
                { borderColor: border, color: textPrimary, backgroundColor: bgBase },
              ]}
              value={editName}
              onChangeText={setEditName}
              placeholder="Name"
              placeholderTextColor={textMuted}
            />
            <View style={styles.modalRow}>
              <View style={styles.modalCol}>
                <Text style={[styles.modalLabel, { color: textMuted }]}>Age</Text>
                <TextInput
                  style={[
                    styles.modalInputSmall,
                    { borderColor: border, color: textPrimary, backgroundColor: bgBase },
                  ]}
                  value={editAge}
                  onChangeText={setEditAge}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.modalCol}>
                <Text style={[styles.modalLabel, { color: textMuted }]}>Height (cm)</Text>
                <TextInput
                  style={[
                    styles.modalInputSmall,
                    { borderColor: border, color: textPrimary, backgroundColor: bgBase },
                  ]}
                  value={editHeight}
                  onChangeText={setEditHeight}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.modalRow}>
              <View style={styles.modalCol}>
                <Text style={[styles.modalLabel, { color: textMuted }]}>Weight (kg)</Text>
                <TextInput
                  style={[
                    styles.modalInputSmall,
                    { borderColor: border, color: textPrimary, backgroundColor: bgBase },
                  ]}
                  value={editWeight}
                  onChangeText={setEditWeight}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setEditProfileOpen(false)}>
                <Text style={[styles.modalCancelText, { color: textMuted }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSave, { backgroundColor: accent }]}
                onPress={handleSaveProfile}
              >
                <Text style={[styles.modalSaveText, { color: bgBase }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit goals modal */}
      <Modal
        visible={editGoalsOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setEditGoalsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: bgCard }]}>
            <Text style={[styles.modalTitle, { color: textPrimary }]}>Daily goals</Text>
            <View style={styles.modalRow}>
              <View style={styles.modalCol}>
                <Text style={[styles.modalLabel, { color: textMuted }]}>Calories (kcal)</Text>
                <TextInput
                  style={[
                    styles.modalInputSmall,
                    { borderColor: border, color: textPrimary, backgroundColor: bgBase },
                  ]}
                  value={editCalories}
                  onChangeText={setEditCalories}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.modalRow}>
              <View style={styles.modalCol}>
                <Text style={[styles.modalLabel, { color: textMuted }]}>Carbs (g)</Text>
                <TextInput
                  style={[
                    styles.modalInputSmall,
                    { borderColor: border, color: textPrimary, backgroundColor: bgBase },
                  ]}
                  value={editCarbs}
                  onChangeText={setEditCarbs}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.modalCol}>
                <Text style={[styles.modalLabel, { color: textMuted }]}>Protein (g)</Text>
                <TextInput
                  style={[
                    styles.modalInputSmall,
                    { borderColor: border, color: textPrimary, backgroundColor: bgBase },
                  ]}
                  value={editProtein}
                  onChangeText={setEditProtein}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.modalRow}>
              <View style={styles.modalCol}>
                <Text style={[styles.modalLabel, { color: textMuted }]}>Fats (g)</Text>
                <TextInput
                  style={[
                    styles.modalInputSmall,
                    { borderColor: border, color: textPrimary, backgroundColor: bgBase },
                  ]}
                  value={editFats}
                  onChangeText={setEditFats}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setEditGoalsOpen(false)}>
                <Text style={[styles.modalCancelText, { color: textMuted }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSave, { backgroundColor: accent }]}
                onPress={handleSaveGoals}
              >
                <Text style={[styles.modalSaveText, { color: bgBase }]}>Save goals</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontFamily: fonts.syne.bold,
    fontSize: 22,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  skeletonCard: {
    marginBottom: 12,
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
    marginBottom: 10,
  },
  cardTitle: {
    fontFamily: fonts.manrope.bold,
    fontSize: 15,
  },
  iconButton: {
    padding: 6,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fonts.syne.bold,
    fontSize: 20,
  },
  userInfo: {
    flex: 1,
  },
  nameText: {
    fontFamily: fonts.syne.bold,
    fontSize: 18,
  },
  emailText: {
    fontFamily: fonts.manrope.regular,
    fontSize: 13,
    marginTop: 2,
  },
  subPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  subPillText: {
    fontFamily: fonts.manrope.medium,
    fontSize: 11,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  statCell: {
    width: '47%',
  },
  statLabel: {
    fontFamily: fonts.manrope.regular,
    fontSize: 12,
    marginBottom: 2,
  },
  statValue: {
    fontFamily: fonts.syne.bold,
    fontSize: 18,
  },
  helperText: {
    fontFamily: fonts.manrope.regular,
    fontSize: 12,
    marginTop: 6,
  },
  goalCalories: {
    fontFamily: fonts.syne.bold,
    fontSize: 26,
    marginBottom: 8,
  },
  goalMacrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  goalMacro: {
    flex: 1,
  },
  goalMacroValue: {
    fontFamily: fonts.syne.bold,
    fontSize: 18,
  },
  goalMacroLabel: {
    fontFamily: fonts.manrope.regular,
    fontSize: 12,
  },
  signOutBtn: {
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 12,
  },
  signOutTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#D33C3C',
    gap: 8,
  },
  signOutText: {
    fontFamily: fonts.syne.bold,
    fontSize: 14,
  },
  resetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  resetText: {
    fontFamily: fonts.manrope.medium,
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontFamily: fonts.syne.bold,
    fontSize: 18,
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: fonts.manrope.regular,
    fontSize: 15,
    marginBottom: 12,
  },
  modalRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  modalCol: {
    flex: 1,
  },
  modalLabel: {
    fontFamily: fonts.manrope.regular,
    fontSize: 12,
    marginBottom: 4,
  },
  modalInputSmall: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontFamily: fonts.mono,
    fontSize: 13,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  modalCancelText: {
    fontFamily: fonts.manrope.medium,
    fontSize: 14,
  },
  modalSave: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  modalSaveText: {
    fontFamily: fonts.syne.bold,
    fontSize: 15,
  },
});

