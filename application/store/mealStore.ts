import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { DailyData, MealEntry } from '@/types/nutrition';

const STORAGE_KEY = '@calorie_tracker_data';

interface MealState {
  data: Record<string, DailyData>;
  loadAll: () => Promise<void>;
  getDailyData: (date: string) => DailyData | null;
  getWeeklyData: () => DailyData[];
  saveDailyData: (date: string, data: DailyData) => Promise<void>;
  addMeal: (date: string, meal: MealEntry) => Promise<void>;
  deleteMeal: (date: string, mealIndex: number) => Promise<void>;
  updateMeal: (date: string, mealIndex: number, meal: MealEntry) => Promise<void>;
  clearAll: () => Promise<void>;
}

function getWeekDates(): string[] {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

const emptyDaily = (date: string): DailyData => ({
  date,
  totalCalories: 0,
  totalCarbs: 0,
  totalProtein: 0,
  totalFats: 0,
  meals: [],
});

export const useMealStore = create<MealState>()(
  persist(
    (set, get) => ({
      data: {},

      loadAll: async () => {
        try {
          const raw = await AsyncStorage.getItem(STORAGE_KEY);
          const data = raw ? JSON.parse(raw) : {};
          set({ data });
        } catch (e) {
          console.error('mealStore loadAll:', e);
        }
      },

      getDailyData: (date) => {
        return get().data[date] ?? null;
      },

      getWeeklyData: () => {
        const { data } = get();
        return getWeekDates().map((dateStr) => data[dateStr] ?? emptyDaily(dateStr));
      },

      saveDailyData: async (date, dailyData) => {
        const next = { ...get().data, [date]: dailyData };
        set({ data: next });
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      },

      addMeal: async (date, meal) => {
        const { data } = get();
        const existing = data[date] ?? emptyDaily(date);
        const meals = [...existing.meals, meal];
        const totalCalories = meals.reduce((s, m) => s + m.calories, 0);
        const totalCarbs = meals.reduce((s, m) => s + m.macros.carbs, 0);
        const totalProtein = meals.reduce((s, m) => s + m.macros.protein, 0);
        const totalFats = meals.reduce((s, m) => s + m.macros.fats, 0);
        const updated: DailyData = {
          ...existing,
          meals,
          totalCalories,
          totalCarbs,
          totalProtein,
          totalFats,
        };
        await get().saveDailyData(date, updated);
      },

      deleteMeal: async (date, mealIndex) => {
        const { data } = get();
        const existing = data[date] ?? emptyDaily(date);
        const meals = existing.meals.filter((_, i) => i !== mealIndex);
        const totalCalories = meals.reduce((s, m) => s + m.calories, 0);
        const totalCarbs = meals.reduce((s, m) => s + m.macros.carbs, 0);
        const totalProtein = meals.reduce((s, m) => s + m.macros.protein, 0);
        const totalFats = meals.reduce((s, m) => s + m.macros.fats, 0);
        const updated: DailyData = {
          ...existing,
          meals,
          totalCalories,
          totalCarbs,
          totalProtein,
          totalFats,
        };
        await get().saveDailyData(date, updated);
      },

      updateMeal: async (date, mealIndex, meal) => {
        const { data } = get();
        const existing = data[date] ?? emptyDaily(date);
        const meals = [...existing.meals];
        meals[mealIndex] = meal;
        const totalCalories = meals.reduce((s, m) => s + m.calories, 0);
        const totalCarbs = meals.reduce((s, m) => s + m.macros.carbs, 0);
        const totalProtein = meals.reduce((s, m) => s + m.macros.protein, 0);
        const totalFats = meals.reduce((s, m) => s + m.macros.fats, 0);
        const updated: DailyData = {
          ...existing,
          meals,
          totalCalories,
          totalCarbs,
          totalProtein,
          totalFats,
        };
        await get().saveDailyData(date, updated);
      },

      clearAll: async () => {
        set({ data: {} });
        await AsyncStorage.removeItem(STORAGE_KEY);
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ data: s.data }),
    }
  )
);
