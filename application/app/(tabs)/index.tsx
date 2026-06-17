import { MealCard } from '@/components/MealCard';
import { analyzeFood } from '@/services/nutritionService';
import { useAnalytics } from '@/context/AnalyticsContext';
import { useAuth } from '@/hooks/useAuth';
import { useConfigStore } from '@/store/configStore';
import { useDateStore } from '@/store/dateStore';
import { useMealStore } from '@/store/mealStore';
import { useThemeStore } from '@/store/themeStore';
import type { MealEntry } from '@/types/nutrition';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useFocusEffect } from 'expo-router/react-navigation';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { darkTheme, lightTheme } from '@/theme/colors';
import { fonts } from '@/theme/typography';

interface EditingState {
  index: number;
  food: string;
  calories: string;
  carbs: string;
  protein: string;
  fats: string;
}

const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL ?? '';

export default function TrackerScreen() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editing, setEditing] = useState<EditingState | null>(null);
  const selectedDate = useDateStore((s) => s.selectedDate);
  const setSelectedDate = useDateStore((s) => s.setSelectedDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const isDark = useThemeStore((s) => s.isDark);
  const theme = isDark ? darkTheme : lightTheme;
  const bgBase = theme['bg-base'];
  const bgSurface = theme['bg-surface'];
  const bgCard = theme['bg-card'];
  const textPrimary = theme['text-primary'];
  const textMuted = theme['text-muted'];
  const accent = theme.accent;
  const accentFg = theme['accent-fg'] ?? (isDark ? '#0D1210' : '#FFFFFF');
  const border = theme.border;
  const destructive = theme.destructive ?? theme.error ?? '#FF6B6B';

  const { mode, isConfigured, getApiKey } = useConfigStore();
  const { capture } = useAnalytics();
  const { subscriptionStatus } = useAuth();
  const { getDailyData, addMeal, deleteMeal, updateMeal } = useMealStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tabBarHeight = 56;
  const bottomInset = insets.bottom + tabBarHeight;

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  })();
  const dateLabel =
    selectedDate === todayStr
      ? 'Today'
      : selectedDate === yesterdayStr
      ? 'Yesterday'
      : new Date(selectedDate + 'T00:00:00').toLocaleDateString([], { weekday: 'short', day: 'numeric' });

  const dailyData = getDailyData(selectedDate);
  const meals = dailyData?.meals ?? [];
  const totalCalories = dailyData?.totalCalories ?? 0;
  const totalMacros = {
    carbs: dailyData?.totalCarbs ?? 0,
    protein: dailyData?.totalProtein ?? 0,
    fats: dailyData?.totalFats ?? 0,
  };

  useFocusEffect(useCallback(() => {}, []));

  const handleSend = useCallback(
    async (text: string) => {
      if (!mode || !isConfigured()) throw new Error('Not configured');
      const apiKey = mode === 'byok' ? await getApiKey() : undefined;
      if (mode === 'byok' && !apiKey?.trim()) throw new Error('API key required');

      setIsLoading(true);
      try {
        const nutritionInfo = await analyzeFood(text, {
          mode,
          apiKey: apiKey ?? undefined,
          apiBaseUrl: mode === 'subscription' ? apiBaseUrl : undefined,
        });

        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        const newMeal: MealEntry = {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          food: text,
          calories: nutritionInfo.calories,
          macros: nutritionInfo.macros,
        };
        await addMeal(selectedDate, newMeal);
        capture('meal_logged', { calories: nutritionInfo.calories });
        setInputText('');
      } catch (e) {
        Alert.alert('Error', 'Failed to analyze food. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [mode, selectedDate, addMeal, getApiKey, capture]
  );

  const handleDelete = useCallback(
    async (index: number) => {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
      await deleteMeal(selectedDate, index);
    },
    [selectedDate, deleteMeal]
  );

  const handleEdit = useCallback((index: number, meal: MealEntry) => {
    setEditing({
      index,
      food: meal.food,
      calories: String(meal.calories),
      carbs: String(Math.round(meal.macros.carbs)),
      protein: String(Math.round(meal.macros.protein)),
      fats: String(Math.round(meal.macros.fats)),
    });
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editing) return;
    const meal: MealEntry = {
      time: meals[editing.index]?.time ?? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      food: editing.food,
      calories: Number(editing.calories) || 0,
      macros: {
        carbs: Number(editing.carbs) || 0,
        protein: Number(editing.protein) || 0,
        fats: Number(editing.fats) || 0,
      },
    };
    await updateMeal(selectedDate, editing.index, meal);
    setEditing(null);
  }, [editing, meals, selectedDate, updateMeal]);

  if (!isConfigured()) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: bgBase }]}>
        <Text style={[styles.setupTitle, { color: textPrimary }]}>API not configured</Text>
        <Text style={[styles.setupSubtitle, { color: textMuted }]}>
          Complete setup to start tracking meals.
        </Text>
        <TouchableOpacity
          style={[styles.setupButton, { backgroundColor: accent }]}
          onPress={() => router.push('/setup')}
        >
          <Text style={[styles.setupButtonText, { color: accentFg }]}>Set up</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderMeal = ({ item, index }: { item: MealEntry; index: number }) => (
    <MealCard
      food={item.food}
      calories={item.calories}
      macros={item.macros}
      onDelete={() => handleDelete(index)}
      onEdit={() => handleEdit(index, item)}
      bgCard={bgCard}
      textPrimary={textPrimary}
      accent={accent}
      textMuted={textMuted}
      destructive={destructive}
    />
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: bgBase }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bgBase} />
      <View style={[styles.inner]}>
        <View style={[styles.topBar, { borderBottomColor: border }]}>
          <Text style={[styles.title, { color: textPrimary }]}>Tracker</Text>
          <View style={styles.topBarRight}>
            {mode === 'subscription' && subscriptionStatus !== 'lifetime' && (
              <TouchableOpacity
                style={[styles.buyBtn, { backgroundColor: accent }]}
                onPress={() => Alert.alert('Coming soon', 'Lifetime subscription purchase will be available soon.')}
                activeOpacity={0.85}
              >
                <Ionicons name="card-outline" size={16} color={accentFg} style={styles.buyBtnIcon} />
                <Text style={[styles.buyBtnText, { color: accentFg }]}>Buy Subscription</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.dateChip, { backgroundColor: bgCard }]}
              activeOpacity={0.7}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={14} color={textMuted} style={{ marginRight: 2 }} />
              <Text style={[styles.dateChipText, { color: textMuted }]}>{dateLabel}</Text>
              <Ionicons name="chevron-down" size={14} color={textMuted} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/setup')} hitSlop={16} style={styles.settingsIcon}>
              <Ionicons name="settings-outline" size={18} color={textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.heroSection}>
          <Text style={[styles.calorieHero, { color: textPrimary }]}>{totalCalories}</Text>
          <Text style={[styles.calorieLabel, { color: textMuted }]}>kcal</Text>
          <View style={[styles.macroStrip, { backgroundColor: bgCard }]}>
            <Text style={[styles.macroText, { color: textMuted }]}>
              Carbs <Text style={{ color: accent }}>{Math.round(totalMacros.carbs)}g</Text>
              {' · '}
              Protein <Text style={{ color: accent }}>{Math.round(totalMacros.protein)}g</Text>
              {' · '}
              Fats <Text style={{ color: accent }}>{Math.round(totalMacros.fats)}g</Text>
            </Text>
          </View>
        </View>

        <FlatList
          data={meals}
          renderItem={renderMeal}
          keyExtractor={(item, i) => `${item.time}-${i}`}
          removeClippedSubviews
          contentContainerStyle={[styles.listContent, meals.length === 0 && styles.listEmpty]}
          ListEmptyComponent={
            <View style={[styles.emptyCard, { borderColor: border }]}>
              <Text style={[styles.emptyText, { color: textMuted }]}>
                Start by logging your first meal
              </Text>
              <Text style={[styles.emptyArrow, { color: textMuted }]}>↓</Text>
            </View>
          }
        />

        <View
          style={[
            styles.inputWrap,
            {
              backgroundColor: bgSurface,
              borderTopColor: border,
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: Math.max(insets.bottom, 20) + 8,
            },
          ]}
        >
          <View style={[styles.inputPill, { backgroundColor: bgCard, borderColor: border }]}>
            <TextInput
              style={[styles.input, { color: textPrimary }]}
              value={inputText}
              onChangeText={setInputText}
              placeholder="what did you eat?"
              placeholderTextColor={textMuted}
              editable={!isLoading}
              onSubmitEditing={() => Keyboard.dismiss()}
            />
            <TouchableOpacity
              style={[styles.sendBtn, { backgroundColor: accent, opacity: isLoading || !inputText.trim() ? 0.5 : 1 }]}
              onPress={() => inputText.trim() && !isLoading && handleSend(inputText.trim())}
              disabled={isLoading || !inputText.trim()}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={accentFg} />
              ) : (
                <Ionicons name="arrow-up" size={22} color={accentFg} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Date picker modal */}
      <Modal visible={showDatePicker} transparent animationType="fade" onRequestClose={() => setShowDatePicker(false)}>
        <TouchableOpacity
          style={styles.datePickerOverlay}
          activeOpacity={1}
          onPress={() => setShowDatePicker(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View style={[styles.datePickerCard, { backgroundColor: bgSurface }]}>
              <Text style={[styles.datePickerTitle, { color: textPrimary }]}>Select date</Text>
              <DateTimePicker
                value={new Date(selectedDate + 'T00:00:00')}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                maximumDate={new Date()}
                themeVariant={isDark ? 'dark' : 'light'}
                onChange={(event, date) => {
                  if (Platform.OS === 'android') setShowDatePicker(false);
                  if (date) setSelectedDate(date.toISOString().split('T')[0]);
                }}
              />
              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={[styles.datePickerDone, { backgroundColor: accent }]}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={[styles.datePickerDoneText, { color: accentFg }]}>Done</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal visible={!!editing} transparent animationType="fade" onRequestClose={() => setEditing(null)}>
        <View style={styles.editOverlay}>
          <View style={[styles.editCard, { backgroundColor: bgSurface }]}>
            <Text style={[styles.editTitle, { color: textPrimary }]}>edit meal</Text>
            {editing && (
              <>
                <TextInput
                  style={[styles.editInput, { borderColor: border, color: textPrimary, backgroundColor: bgCard }]}
                  value={editing.food}
                  onChangeText={(v) => setEditing((p) => (p ? { ...p, food: v } : p))}
                  placeholder="meal"
                  placeholderTextColor={textMuted}
                />
                <View style={styles.editRow}>
                  <View style={styles.editCol}>
                    <Text style={[styles.editLabel, { color: textMuted }]}>kcal</Text>
                    <TextInput
                      style={[styles.editInputSmall, { borderColor: border, color: textPrimary, backgroundColor: bgCard }]}
                      value={editing.calories}
                      onChangeText={(v) => setEditing((p) => (p ? { ...p, calories: v } : p))}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.editCol}>
                    <Text style={[styles.editLabel, { color: textMuted }]}>carbs (g)</Text>
                    <TextInput
                      style={[styles.editInputSmall, { borderColor: border, color: textPrimary, backgroundColor: bgCard }]}
                      value={editing.carbs}
                      onChangeText={(v) => setEditing((p) => (p ? { ...p, carbs: v } : p))}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <View style={styles.editRow}>
                  <View style={styles.editCol}>
                    <Text style={[styles.editLabel, { color: textMuted }]}>protein (g)</Text>
                    <TextInput
                      style={[styles.editInputSmall, { borderColor: border, color: textPrimary, backgroundColor: bgCard }]}
                      value={editing.protein}
                      onChangeText={(v) => setEditing((p) => (p ? { ...p, protein: v } : p))}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.editCol}>
                    <Text style={[styles.editLabel, { color: textMuted }]}>fats (g)</Text>
                    <TextInput
                      style={[styles.editInputSmall, { borderColor: border, color: textPrimary, backgroundColor: bgCard }]}
                      value={editing.fats}
                      onChangeText={(v) => setEditing((p) => (p ? { ...p, fats: v } : p))}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <View style={styles.editActions}>
                  <TouchableOpacity onPress={() => setEditing(null)}>
                    <Text style={[styles.editCancelText, { color: textMuted }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.editSave, { backgroundColor: accent }]} onPress={handleSaveEdit}>
                    <Text style={[styles.editSaveText, { color: accentFg }]}>Save</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: 'center', alignItems: 'center', padding: 24 },
  setupTitle: { fontFamily: fonts.syne.bold, fontSize: 20, marginBottom: 8, textAlign: 'center' },
  setupSubtitle: { fontFamily: fonts.manrope.regular, fontSize: 14, marginBottom: 24, textAlign: 'center' },
  setupButton: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 },
  setupButtonText: { fontFamily: fonts.syne.bold, fontSize: 16 },
  inner: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  title: { fontFamily: fonts.syne.bold, fontSize: 22 },
  topBarRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  dateChipText: { fontFamily: fonts.manrope.medium, fontSize: 14 },
  buyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buyBtnIcon: { marginRight: 6 },
  buyBtnText: { fontFamily: fonts.manrope.semiBold, fontSize: 13 },
  settingsIcon: { padding: 8 },
  heroSection: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  calorieHero: { fontFamily: fonts.syne.bold, fontSize: 72, lineHeight: 80, letterSpacing: -1 },
  calorieLabel: { fontFamily: fonts.manrope.regular, fontSize: 14, marginTop: 4 },
  macroStrip: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  macroText: { fontFamily: fonts.mono, fontSize: 13 },
  listContent: { paddingHorizontal: 20, paddingBottom: 24 },
  listEmpty: { flexGrow: 1, justifyContent: 'center' },
  emptyCard: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: { fontFamily: fonts.manrope.regular, fontSize: 15 },
  emptyArrow: { fontFamily: fonts.manrope.regular, fontSize: 14, marginTop: 4 },
  inputWrap: {
    borderTopWidth: 1,
  },
  inputPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 28,
    borderWidth: 1,
    paddingLeft: 20,
    paddingRight: 6,
    paddingVertical: 6,
    minHeight: 56,
  },
  input: {
    flex: 1,
    fontFamily: fonts.manrope.regular,
    fontSize: 16,
    paddingVertical: 12,
    paddingRight: 12,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  editCard: { width: '100%', borderRadius: 16, padding: 20 },
  editTitle: { fontFamily: fonts.syne.bold, fontSize: 18, marginBottom: 12 },
  editInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: fonts.manrope.regular,
    fontSize: 15,
    marginBottom: 12,
  },
  editRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  editCol: { flex: 1 },
  editLabel: { fontFamily: fonts.manrope.regular, fontSize: 12, marginBottom: 4 },
  editInputSmall: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontFamily: fonts.mono,
    fontSize: 13,
  },
  editActions: { flexDirection: 'row', justifyContent: 'flex-end' , alignItems: 'center', gap: 12, marginTop: 4 },
  editCancelText: { fontFamily: fonts.manrope.medium, fontSize: 14 },
  editSave: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999 },
  editSaveText: { fontFamily: fonts.syne.bold, fontSize: 15 },
  datePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  datePickerCard: {
    borderRadius: 20,
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  datePickerTitle: {
    fontFamily: fonts.syne.bold,
    fontSize: 18,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  datePickerDone: {
    marginTop: 12,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 999,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  datePickerDoneText: { fontFamily: fonts.syne.bold, fontSize: 15 },
});
