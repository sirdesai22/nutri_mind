import { MealCard } from '@/components/MealCard';
import { WeeklyBarChart } from '@/components/WeeklyBarChart';
import { WeeklyLineChart } from '@/components/WeeklyLineChart';
import { useMealStore } from '@/store/mealStore';
import { useThemeStore } from '@/store/themeStore';
import type { MealEntry } from '@/types/nutrition';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeToggle } from '../components/ThemeToggle';
import { darkTheme, lightTheme } from '../theme/colors';
import { fonts } from '../theme/typography';

// ─── constants ─────────────────────────────────────────────────────────────

const MACRO_TARGETS = { carbs: 250, protein: 150, fats: 65 };
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MEAL_DOTS = {
  Morning: '#F59E0B',
  Afternoon: '#34D399',
  Evening: '#818CF8',
} as const;

// ─── helpers ───────────────────────────────────────────────────────────────

function getTimeGroup(time: string): 'Morning' | 'Afternoon' | 'Evening' {
  const hour = parseInt(time.split(':')[0] || '12', 10);
  const meridiem = time.toLowerCase().includes('pm') ? 12 : 0;
  const h = hour === 12 ? (meridiem ? 12 : 0) : hour + meridiem;
  if (h >= 5 && h < 12) return 'Morning';
  if (h >= 12 && h < 17) return 'Afternoon';
  return 'Evening';
}

function groupMealsByTime(meals: MealEntry[]): Record<string, MealEntry[]> {
  const groups: Record<string, MealEntry[]> = { Morning: [], Afternoon: [], Evening: [] };
  for (const m of meals) {
    const g = getTimeGroup(m.time);
    groups[g].push(m);
  }
  return groups;
}

// ─── component ─────────────────────────────────────────────────────────────

export default function ProgressScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editing, setEditing] = useState<{
    index: number;
    group: 'Morning' | 'Afternoon' | 'Evening';
    food: string;
    calories: string;
    carbs: string;
    protein: string;
    fats: string;
  } | null>(null);

  const isDark = useThemeStore((s) => s.isDark);
  const theme = isDark ? darkTheme : lightTheme;
  const bgBase = theme['bg-base'];
  const bgCard = theme['bg-card'];
  const textPrimary = theme['text-primary'];
  const textMuted = theme['text-muted'];
  const accent = theme.accent;
  const border = theme.border;
  const borderStrong = theme['border-strong'];
  const destructive = theme.destructive ?? theme.error ?? '#FF6B6B';
  const insets = useSafeAreaInsets();
  const tabBarHeight = 56;

  const { getDailyData, getWeeklyData, deleteMeal, updateMeal } = useMealStore();
  const allMealData = useMealStore((s) => s.data);

  const dateStr = selectedDate.toISOString().split('T')[0];
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = useMemo(() => {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return y.toISOString().split('T')[0];
  }, []);

  const dailyData = getDailyData(dateStr);
  const weeklyData = getWeeklyData();

  const todayIndex = weeklyData.findIndex((d) => d.date === todayStr);
  const todayIdx = todayIndex >= 0 ? todayIndex : new Date().getDay();

  // ── weekly chart values ──
  const barChartValues = useMemo(() => {
    const vals = weeklyData.map((d) => d.totalCalories ?? 0);
    while (vals.length < 7) vals.push(0);
    return vals.slice(0, 7);
  }, [weeklyData]);

  const maxBar = useMemo(() => Math.max(1, ...barChartValues), [barChartValues]);

  // ── weekly summary stats ──
  const weeklyTotal = useMemo(() => barChartValues.reduce((a, b) => a + b, 0), [barChartValues]);
  const daysLogged = useMemo(() => barChartValues.filter((v) => v > 0).length, [barChartValues]);
  const weeklyAvg = useMemo(
    () => (daysLogged > 0 ? Math.round(weeklyTotal / daysLogged) : 0),
    [weeklyTotal, daysLogged]
  );
  const bestDayIdx = useMemo(() => {
    const peak = Math.max(...barChartValues);
    return peak > 0 ? barChartValues.indexOf(peak) : -1;
  }, [barChartValues]);
  const bestDayName = bestDayIdx >= 0 ? DAY_NAMES[bestDayIdx] : '—';
  const peakCalories = useMemo(() => Math.max(0, ...barChartValues), [barChartValues]);

  // ── insights ──
  const calDiff = Math.round(
    (allMealData[todayStr]?.totalCalories ?? 0) - (allMealData[yesterdayStr]?.totalCalories ?? 0)
  );

  const bestMacroInsight = useMemo(() => {
    const td = allMealData[todayStr];
    if (!td) return null;
    const candidates = [
      { name: 'Carbs', value: td.totalCarbs ?? 0 },
      { name: 'Protein', value: td.totalProtein ?? 0 },
      { name: 'Fats', value: td.totalFats ?? 0 },
    ];
    return candidates.reduce((a, b) => (a.value > b.value ? a : b));
  }, [allMealData, todayStr]);

  const streakDays = useMemo(() => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      if ((allMealData[dStr]?.meals?.length ?? 0) > 0) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }, [allMealData]);

  // ── meal groups ──
  const groupedMeals = useMemo(() => {
    return groupMealsByTime(dailyData?.meals ?? []);
  }, [dailyData]);

  const mealIndexOffset = useMemo(() => {
    const offset: Record<string, number> = { Morning: 0, Afternoon: 0, Evening: 0 };
    let running = 0;
    for (const g of ['Morning', 'Afternoon', 'Evening'] as const) {
      offset[g] = running;
      running += groupedMeals[g].length;
    }
    return offset;
  }, [groupedMeals]);

  // ── handlers ──
  const loadData = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  }, []);

  useEffect(() => { loadData(); }, [selectedDate, loadData]);

  const handleDateChange = (_: unknown, date?: Date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  const formatDateChip = (date: Date) => {
    const d = date.toISOString().split('T')[0];
    const t = new Date().toISOString().split('T')[0];
    const y = new Date(Date.now() - 864e5).toISOString().split('T')[0];
    if (d === t) return 'Today';
    if (d === y) return 'Yesterday';
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
  };

  const handleResetAll = () => {
    Alert.alert('Reset All Data', 'Are you sure? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset All',
        style: 'destructive',
        onPress: async () => {
          await useMealStore.getState().clearAll();
          setSelectedDate(new Date());
          loadData();
        },
      },
    ]);
  };

  const handleDeleteMeal = useCallback(
    async (mealIndex: number) => {
      const meals = dailyData?.meals ?? [];
      if (mealIndex >= 0 && mealIndex < meals.length) {
        await deleteMeal(dateStr, mealIndex);
      }
    },
    [dateStr, dailyData, deleteMeal]
  );

  const handleEditMeal = useCallback(
    (group: 'Morning' | 'Afternoon' | 'Evening', localIndex: number, meal: MealEntry) => {
      const globalIndex = mealIndexOffset[group] + localIndex;
      setEditing({
        index: globalIndex,
        group,
        food: meal.food,
        calories: String(meal.calories),
        carbs: String(Math.round(meal.macros.carbs)),
        protein: String(Math.round(meal.macros.protein)),
        fats: String(Math.round(meal.macros.fats)),
      });
    },
    [mealIndexOffset]
  );

  const handleSaveEdit = useCallback(async () => {
    if (!editing) return;
    const meals = dailyData?.meals ?? [];
    const existing = meals[editing.index];
    const meal: MealEntry = {
      time: existing?.time ?? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      food: editing.food,
      calories: Number(editing.calories) || 0,
      macros: {
        carbs: Number(editing.carbs) || 0,
        protein: Number(editing.protein) || 0,
        fats: Number(editing.fats) || 0,
      },
    };
    await updateMeal(dateStr, editing.index, meal);
    setEditing(null);
  }, [editing, dailyData, dateStr, updateMeal]);

  // ── derived display values ──
  const todayCalories = Math.round(dailyData?.totalCalories ?? 0);
  const totalCarbs = Math.round(dailyData?.totalCarbs ?? 0);
  const totalProtein = Math.round(dailyData?.totalProtein ?? 0);
  const totalFats = Math.round(dailyData?.totalFats ?? 0);

  const calDiffLabel =
    calDiff === 0
      ? 'Same as yesterday'
      : calDiff > 0
      ? `+${calDiff} kcal more than yesterday`
      : `${Math.abs(calDiff)} kcal less than yesterday`;

  // ── render ──────────────────────────────────────────────────────────────

  return (
    <View style={[styles.container, { backgroundColor: bgBase }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bgBase} />

      {/* STICKY HEADER */}
      <View style={[styles.header, { borderBottomColor: border, backgroundColor: bgBase }]}>
        <Text style={[styles.headerTitle, { color: textPrimary }]}>Progress</Text>
        <View style={styles.headerRight}>
          <ThemeToggle />
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={[styles.dateChip, { backgroundColor: bgCard, borderColor: borderStrong }]}
          >
            <Text style={[styles.dateChipText, { color: textPrimary }]}>
              {formatDateChip(selectedDate)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + tabBarHeight + 24 },
        ]}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadData} />}
        showsVerticalScrollIndicator={false}
      >
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        {/* ── WEEKLY CALORIES CARD ── */}
        <View style={[styles.card, { backgroundColor: bgCard, borderColor: border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: textPrimary }]}>Weekly Calories</Text>
            <Text style={[styles.cardMeta, { color: textMuted }]}>
              {weeklyTotal.toLocaleString()} kcal
            </Text>
          </View>
          <WeeklyBarChart
            data={barChartValues}
            maxValue={maxBar}
            accentColor={accent}
            barColor={bgBase}
            todayIndex={todayIdx}
            textMuted={textMuted}
            chartHeight={160}
          />
          <Text style={[styles.chartSummary, { color: textMuted }]}>
            Avg {weeklyAvg} kcal/day
            {bestDayName !== '—' ? ` · Best: ${bestDayName}` : ''}
            {' · '}{daysLogged}/7 days logged
          </Text>
        </View>

        {/* ── CALORIE TREND CARD ── */}
        <View style={[styles.card, { backgroundColor: bgCard, borderColor: border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: textPrimary }]}>Calorie Trend</Text>
            <View style={[styles.chip, { backgroundColor: bgBase, borderColor: border }]}>
              <Text style={[styles.chipText, { color: textMuted }]}>This Week</Text>
            </View>
          </View>
          <WeeklyLineChart
            data={barChartValues}
            maxValue={maxBar}
            accentColor={accent}
            lineColor={textMuted}
            todayIndex={todayIdx}
            textMuted={textMuted}
            chartHeight={140}
            goalCalories={2000}
          />
          <View style={styles.statPillsRow}>
            <View style={[styles.statPill, { backgroundColor: bgBase, borderColor: border }]}>
              <Text style={[styles.statPillText, { color: textPrimary }]}>
                ↑ Peak {peakCalories} kcal
              </Text>
            </View>
            <View style={[styles.statPill, { backgroundColor: bgBase, borderColor: border }]}>
              <Text style={[styles.statPillText, { color: textPrimary }]}>
                ⌀ Avg {weeklyAvg} kcal
              </Text>
            </View>
          </View>
        </View>

        {/* ── TODAY'S MACROS CARD ── */}
        <View style={[styles.card, { backgroundColor: bgCard, borderColor: border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: textPrimary }]}>Today's Macros</Text>
            <Text style={[styles.cardMeta, { color: textMuted }]}>
              {formatDateChip(selectedDate)}
            </Text>
          </View>
          <View style={styles.calorieBigRow}>
            <Text style={[styles.calorieBigNum, { color: textPrimary }]}>{todayCalories}</Text>
            <Text style={[styles.calorieBigUnit, { color: textMuted }]}>kcal</Text>
          </View>
          <View style={styles.macroColumns}>
            {[
              { label: 'Carbs', value: totalCarbs, target: MACRO_TARGETS.carbs },
              { label: 'Protein', value: totalProtein, target: MACRO_TARGETS.protein },
              { label: 'Fats', value: totalFats, target: MACRO_TARGETS.fats },
            ].map(({ label, value, target }) => {
              const pct = Math.min(100, Math.round((value / target) * 100));
              return (
                <View key={label} style={styles.macroColumn}>
                  <Text style={[styles.macroValue, { color: accent }]}>{value}g</Text>
                  <Text style={[styles.macroLabel, { color: textMuted }]}>{label}</Text>
                  <View style={[styles.macroBarTrack, { backgroundColor: bgBase }]}>
                    <View
                      style={[
                        styles.macroBarFill,
                        {
                          width: `${pct}%` as unknown as number,
                          backgroundColor: accent,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.macroTarget, { color: textMuted }]}>/ {target}g</Text>
                </View>
              );
            })}
          </View>
          {totalCarbs === 0 && totalProtein === 0 && totalFats === 0 && (
            <Text style={[styles.macroEmpty, { color: textMuted }]}>
              No meals logged · Set goals →
            </Text>
          )}
        </View>

        {/* ── INSIGHTS CARD ── */}
        <View style={[styles.card, { backgroundColor: bgCard, borderColor: border }]}>
          <Text style={[styles.cardTitle, { color: textPrimary }]}>Insights</Text>
          <View style={styles.insightsList}>
            <View style={styles.insightRow}>
              <Text style={styles.insightIcon}>🔥</Text>
              <View style={styles.insightBody}>
                <Text style={[styles.insightLabel, { color: textMuted }]}>
                  Calories vs yesterday
                </Text>
                <Text style={[styles.insightValue, { color: textPrimary }]}>{calDiffLabel}</Text>
              </View>
            </View>
            <View style={[styles.insightDivider, { backgroundColor: border }]} />
            <View style={styles.insightRow}>
              <Text style={styles.insightIcon}>🥩</Text>
              <View style={styles.insightBody}>
                <Text style={[styles.insightLabel, { color: textMuted }]}>Best macro today</Text>
                <Text style={[styles.insightValue, { color: textPrimary }]}>
                  {bestMacroInsight && bestMacroInsight.value > 0
                    ? `${bestMacroInsight.name} — ${Math.round(bestMacroInsight.value)}g logged`
                    : 'No meals logged today'}
                </Text>
              </View>
            </View>
            <View style={[styles.insightDivider, { backgroundColor: border }]} />
            <View style={styles.insightRow}>
              <Text style={styles.insightIcon}>📅</Text>
              <View style={styles.insightBody}>
                <Text style={[styles.insightLabel, { color: textMuted }]}>Streak</Text>
                <Text style={[styles.insightValue, { color: textPrimary }]}>
                  {streakDays === 0
                    ? 'Start tracking today!'
                    : `${streakDays} day${streakDays === 1 ? '' : 's'} logged in a row`}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── MEAL HISTORY CARD ── */}
        <View style={[styles.card, { backgroundColor: bgCard, borderColor: border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: textPrimary }]}>Meal History</Text>
            <Text style={[styles.cardMeta, { color: textMuted }]}>
              {formatDateChip(selectedDate)}
            </Text>
          </View>

          {(['Morning', 'Afternoon', 'Evening'] as const).map((group, gi) => (
            <View key={group}>
              {gi > 0 && (
                <View style={[styles.groupDivider, { backgroundColor: border }]} />
              )}
              <View style={styles.groupHeader}>
                <View style={[styles.groupDot, { backgroundColor: MEAL_DOTS[group] }]} />
                <Text style={[styles.groupLabel, { color: textMuted }]}>
                  {group.toUpperCase()}
                </Text>
              </View>

              {groupedMeals[group].length > 0 ? (
                groupedMeals[group].map((meal, i) => {
                  const globalIdx = mealIndexOffset[group] + i;
                  return (
                    <MealCard
                      key={`${meal.time}-${i}`}
                      food={meal.food}
                      calories={meal.calories}
                      macros={meal.macros}
                      onDelete={() => handleDeleteMeal(globalIdx)}
                      onEdit={() => handleEditMeal(group, i, meal)}
                      dotColor={MEAL_DOTS[group]}
                      bgCard={bgBase}
                      textPrimary={textPrimary}
                      accent={accent}
                      textMuted={textMuted}
                      destructive={destructive}
                    />
                  );
                })
              ) : (
                <View style={[styles.emptyRow, { borderColor: border }]}>
                  <Text style={[styles.emptyRowText, { color: textMuted }]}>Nothing logged</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* ── RESET ── */}
        <TouchableOpacity onPress={handleResetAll} style={styles.resetBtn}>
          <Ionicons name="trash-outline" size={16} color={textMuted} />
          <Text style={[styles.resetText, { color: textMuted }]}>Reset All Data</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── EDIT MODAL ── */}
      <Modal
        visible={!!editing}
        transparent
        animationType="fade"
        onRequestClose={() => setEditing(null)}
      >
        <View style={styles.editOverlay}>
          <View style={[styles.editCard, { backgroundColor: bgCard }]}>
            <Text style={[styles.editTitle, { color: textPrimary }]}>edit meal</Text>
            {editing && (
              <>
                <TextInput
                  style={[styles.editInput, { borderColor: border, color: textPrimary, backgroundColor: bgBase }]}
                  value={editing.food}
                  onChangeText={(v) => setEditing((p) => (p ? { ...p, food: v } : p))}
                  placeholder="meal"
                  placeholderTextColor={textMuted}
                />
                <View style={styles.editRow}>
                  <View style={styles.editCol}>
                    <Text style={[styles.editLabel, { color: textMuted }]}>kcal</Text>
                    <TextInput
                      style={[styles.editInputSmall, { borderColor: border, color: textPrimary, backgroundColor: bgBase }]}
                      value={editing.calories}
                      onChangeText={(v) => setEditing((p) => (p ? { ...p, calories: v } : p))}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.editCol}>
                    <Text style={[styles.editLabel, { color: textMuted }]}>carbs (g)</Text>
                    <TextInput
                      style={[styles.editInputSmall, { borderColor: border, color: textPrimary, backgroundColor: bgBase }]}
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
                      style={[styles.editInputSmall, { borderColor: border, color: textPrimary, backgroundColor: bgBase }]}
                      value={editing.protein}
                      onChangeText={(v) => setEditing((p) => (p ? { ...p, protein: v } : p))}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.editCol}>
                    <Text style={[styles.editLabel, { color: textMuted }]}>fats (g)</Text>
                    <TextInput
                      style={[styles.editInputSmall, { borderColor: border, color: textPrimary, backgroundColor: bgBase }]}
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
                  <TouchableOpacity
                    style={[styles.editSave, { backgroundColor: accent }]}
                    onPress={handleSaveEdit}
                  >
                    <Text style={[styles.editSaveText, { color: bgBase }]}>Save</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header (sticky, outside ScrollView)
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: { fontFamily: fonts.syne.bold, fontSize: 22 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dateChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  dateChipText: { fontFamily: fonts.manrope.semiBold, fontSize: 14 },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },

  // Card base
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: { fontFamily: fonts.manrope.bold, fontSize: 15 },
  cardMeta: { fontFamily: fonts.manrope.regular, fontSize: 13 },

  // Chart summary
  chartSummary: {
    fontFamily: fonts.manrope.regular,
    fontSize: 12,
    marginTop: 6,
  },

  // "This Week" chip
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  chipText: { fontFamily: fonts.manrope.medium, fontSize: 12 },

  // Stat pills
  statPillsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  statPill: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  statPillText: { fontFamily: fonts.mono, fontSize: 12 },

  // Macros card
  calorieBigRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
    gap: 6,
  },
  calorieBigNum: {
    fontFamily: fonts.syne.bold,
    fontSize: 52,
    lineHeight: 56,
    letterSpacing: -1,
  },
  calorieBigUnit: {
    fontFamily: fonts.manrope.regular,
    fontSize: 15,
    paddingBottom: 7,
  },
  macroColumns: { flexDirection: 'row', gap: 12 },
  macroColumn: { flex: 1, gap: 2 },
  macroValue: { fontFamily: fonts.syne.bold, fontSize: 20 },
  macroLabel: { fontFamily: fonts.manrope.regular, fontSize: 12 },
  macroBarTrack: {
    height: 4,
    borderRadius: 2,
    marginTop: 6,
    marginBottom: 4,
    overflow: 'hidden',
  },
  macroBarFill: { height: 4, borderRadius: 2 },
  macroTarget: { fontFamily: fonts.mono, fontSize: 10 },
  macroEmpty: {
    fontFamily: fonts.manrope.regular,
    fontSize: 13,
    marginTop: 12,
    textAlign: 'center',
  },

  // Insights card
  insightsList: { marginTop: 10, gap: 0 },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
  },
  insightIcon: { fontSize: 20, width: 28, textAlign: 'center' },
  insightBody: { flex: 1, gap: 2 },
  insightLabel: { fontFamily: fonts.manrope.regular, fontSize: 12 },
  insightValue: { fontFamily: fonts.manrope.semiBold, fontSize: 14 },
  insightDivider: { height: StyleSheet.hairlineWidth },

  // Meal history card
  groupDivider: { height: StyleSheet.hairlineWidth, marginVertical: 12 },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  groupDot: { width: 6, height: 6, borderRadius: 3 },
  groupLabel: {
    fontFamily: fonts.manrope.semiBold,
    fontSize: 11,
    letterSpacing: 0.8,
  },
  emptyRow: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 4,
  },
  emptyRowText: { fontFamily: fonts.manrope.regular, fontSize: 13 },

  // Reset button
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 12,
    alignSelf: 'center',
  },
  resetText: { fontFamily: fonts.manrope.medium, fontSize: 13 },

  // Edit modal
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
  editActions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 12, marginTop: 4 },
  editCancelText: { fontFamily: fonts.manrope.medium, fontSize: 14 },
  editSave: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999 },
  editSaveText: { fontFamily: fonts.syne.bold, fontSize: 15 },
});
