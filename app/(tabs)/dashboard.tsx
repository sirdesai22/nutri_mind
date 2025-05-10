import { storage } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface DailyStats {
  date: string;
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFats: number;
  meals: {
    time: string;
    food: string;
    calories: number;
  }[];
}

export default function DashboardScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
  const [weeklyData, setWeeklyData] = useState<DailyStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const dateStr = selectedDate.toISOString().split('T')[0];
        const data = await storage.getDailyData(dateStr);
        if (data) {
          setDailyStats(data);
        } else {
          setDailyStats({
            date: dateStr,
            totalCalories: 0,
            totalCarbs: 0,
            totalProtein: 0,
            totalFats: 0,
            meals: []
          });
        }

        const weekly = await storage.getWeeklyData();
        setWeeklyData(weekly);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [selectedDate]);

  const chartData = useMemo(() => {
    if (!weeklyData.length) {
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }]
      };
    }

    return {
      labels: weeklyData.map(d => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })),
      datasets: [{
        data: weeklyData.map(d => d.totalCalories || 0)
      }]
    };
  }, [weeklyData]);

  const chartConfig = {
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#F5F5F5',
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#4CAF50'
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity 
          style={styles.dateSelector}
          onPress={() => {
            // TODO: Implement date picker
          }}>
          <Text style={styles.dateText}>{dailyStats?.date || 'Loading...'}</Text>
          <Ionicons name="calendar-outline" size={20} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Weekly Calories Graph */}
      <View style={styles.graphContainer}>
        <Text style={styles.sectionTitle}>
          Weekly Calories
        </Text>
        {weeklyData.length > 0 ? (
          <LineChart
            data={chartData}
            width={Dimensions.get('window').width - 32}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.graph}
            fromZero
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No data available for this week</Text>
          </View>
        )}
      </View>

      {/* Daily Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.sectionTitle}>
          Daily Summary
        </Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {dailyStats?.totalCalories || 0}
            </Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {(dailyStats?.totalCarbs || 0).toFixed(1)}g
            </Text>
            <Text style={styles.statLabel}>Carbs</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {(dailyStats?.totalProtein || 0).toFixed(1)}g
            </Text>
            <Text style={styles.statLabel}>Protein</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {(dailyStats?.totalFats || 0).toFixed(1)}g
            </Text>
            <Text style={styles.statLabel}>Fats</Text>
          </View>
        </View>
      </View>

      {/* Meal History */}
      <View style={styles.mealHistoryContainer}>
        <Text style={styles.sectionTitle}>
          Meal History
        </Text>
        {dailyStats?.meals && dailyStats.meals.length > 0 ? (
          dailyStats.meals.map((meal, index) => (
            <View key={index} style={styles.mealItem}>
              <View style={styles.mealTimeContainer}>
                <Text style={styles.mealTime}>{meal.time}</Text>
              </View>
              <View style={styles.mealDetails}>
                <Text style={styles.mealFood}>{meal.food}</Text>
                <Text style={styles.mealCalories}>{meal.calories} cal</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No meals recorded for this day</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateText: {
    color: '#333333',
  },
  graphContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  graph: {
    marginVertical: 8,
    borderRadius: 12,
  },
  summaryContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statLabel: {
    color: '#666666',
  },
  mealHistoryContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mealItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  mealTimeContainer: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealTime: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  mealDetails: {
    flex: 1,
    marginLeft: 12,
  },
  mealFood: {
    color: '#333333',
    marginBottom: 4,
  },
  mealCalories: {
    color: '#666666',
    fontSize: 12,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    color: '#666666',
  },
  loadingText: {
    color: '#333333',
    fontSize: 16,
  },
});
