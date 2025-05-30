import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export interface DailyData {
  date: string;
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFats: number;
  meals: {
    time: string;
    food: string;
    calories: number;
    macros: {
      carbs: number;
      protein: number;
      fats: number;
    };
  }[];
}

const STORAGE_KEY = '@calorie_tracker_data';

export const storage = {
  async saveDailyData(date: string, data: DailyData) {
    try {
      const existingData = await this.getAllData();
      if (existingData[date] || date === new Date().toISOString().split('T')[0]) {
        existingData[date] = data;
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error saving data in saveDailyData');
    }
  },

  async getDailyData(date: string): Promise<DailyData | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const allData = JSON.parse(data);
        return allData[date] || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting data:', error);
      Alert.alert('Error getting data in getDailyData');
      return null;
    }
  },

  async getAllData(): Promise<Record<string, DailyData>> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting all data:', error);
      Alert.alert('Error getting all data in getAllData');
      return {};
    }
  },

  async getWeeklyData(): Promise<DailyData[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (!data) return [];

      const allData = JSON.parse(data);
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());

      const weeklyData: DailyData[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        weeklyData.push(allData[dateStr] || {
          date: dateStr,
          totalCalories: 0,
          totalCarbs: 0,
          totalProtein: 0,
          totalFats: 0,
          meals: []
        });
      }
      return weeklyData;
    } catch (error) {
      console.error('Error getting weekly data:', error);
      Alert.alert('Error getting weekly data in getWeeklyData');
      return [];
    }
  },

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing data:', error);
      Alert.alert('Error clearing data in clearAllData');
      throw error;
    }
  }
}; 