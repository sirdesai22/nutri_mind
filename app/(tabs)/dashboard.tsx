import { storage } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Dimensions, Platform, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
    macros: {
      carbs: number;
      protein: number;
      fats: number;
    };
  }[];
}

export default function DashboardScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
  const [weeklyData, setWeeklyData] = useState<DailyStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
    
      const data = await storage.getDailyData(dateStr);
      
      if (data) {
        // Ensure all required fields exist with default values
        const safeData = {
          date: data.date || dateStr,
          totalCalories: data.totalCalories || 0,
          totalCarbs: data.totalCarbs || 0,
          totalProtein: data.totalProtein || 0,
          totalFats: data.totalFats || 0,
          meals: Array.isArray(data.meals) ? data.meals.map(meal => ({
            time: meal.time || '',
            food: meal.food || '',
            calories: meal.calories || 0,
            macros: {
              carbs: meal.macros?.carbs || 0,
              protein: meal.macros?.protein || 0,
              fats: meal.macros?.fats || 0
            }
          })) : []
        };
        setDailyStats(safeData);
      } else {
        console.log('[Dashboard] No data found, setting default values');
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
      // console.log('[Dashboard] Retrieved weekly data:', JSON.stringify(weekly, null, 2));
      
      // Ensure weekly data is an array
      if (Array.isArray(weekly)) {
        setWeeklyData(weekly);
      } else {
        console.log('[Dashboard] Invalid weekly data format, setting empty array');
        setWeeklyData([]);
      }
      // setDailyStats({
      //   date: selectedDate.toISOString().split('T')[0],
      //   totalCalories: 0,
      //   totalCarbs: 0,
      //   totalProtein: 0,
      //   totalFats: 0,
      //   meals: []
      // });
      // setWeeklyData([]);
    } catch (error) {
      console.error('[Dashboard] Error loading data:', error);
      // Set default values on error
      setDailyStats({
        date: selectedDate.toISOString().split('T')[0],
        totalCalories: 0,
        totalCarbs: 0,
        totalProtein: 0,
        totalFats: 0,
        meals: []
      });
      setWeeklyData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // // Refresh data when screen comes into focus
useEffect(() => {
  loadData();
}, [selectedDate]);

  //dummy data for chart
  // const chartData = {
  //   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  //   datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }]
  // };
  const chartData = useMemo(() => {
    try {
      if (!Array.isArray(weeklyData) || weeklyData.length === 0) {
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }]
        };
      }

      // Get today's date
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday, etc.

      // Ensure we have exactly 7 days of data
      const paddedData = [...weeklyData];
      while (paddedData.length < 7) {
        paddedData.push({
          date: new Date().toISOString().split('T')[0],
          totalCalories: 0,
          totalCarbs: 0,
          totalProtein: 0,
          totalFats: 0,
          meals: []
        });
      }

      // Map the data to the correct days of the week
      const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const adjustedData = weekDays.map((day, index) => {
        const dataIndex = (index) % 7; // Shift the index to start from Monday
        const dataPoint = paddedData[dataIndex];
        return typeof dataPoint.totalCalories === 'number' 
          ? Math.max(0, Math.min(dataPoint.totalCalories, 10000)) 
          : 0;
      });

      return {
        labels: weekDays,
        datasets: [{ data: adjustedData }]
      };
    } catch (error) {
      console.error('[Dashboard] Error preparing chart data:', error);
      return {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }]
      };
    }
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
    },
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: 'rgba(0,0,0,0.1)',
      strokeDasharray: '0',
    },
    propsForLabels: {
      fontSize: 12,
      fontWeight: '500',
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleResetToday = async () => {
    // Alert.alert('Data reset!');
    Alert.alert(
      'Reset All Data',
      'Are you sure you want to reset ALL data? This will clear everything and cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Reset All',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear all data in storage
              await storage.clearAllData();
              // Reset the selected date to today
              setSelectedDate(new Date());
              // Reload the data
              loadData();
            } catch (error) {
              Alert.alert(
                'Error',
                'Failed to reset data. Please try again.',
                [{ text: 'OK' }]
              );
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Ensure we have valid data before rendering
  if (!dailyStats) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>No data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadData} />}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <View style={styles.headerControls}>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={handleResetToday}>
              <Ionicons name="refresh-outline" size={20} color="#ff4444" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dateSelector}
              onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
              <Ionicons name="calendar-outline" size={20} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        {/* Weekly Calories Graph */}
        <View style={styles.graphContainer}>
          <Text style={styles.sectionTitle}>
            Weekly Calories
          </Text>
          {Array.isArray(weeklyData) && weeklyData.length > 0 ? (
            <View style={styles.graph}>
              <LineChart
                data={chartData}
                width={Dimensions.get('window').width - 64}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.graph}
                fromZero
                withInnerLines={true}
                withOuterLines={true}
                withVerticalLines={false}
                withHorizontalLines={true}
                withDots={true}
                withShadow={false}
                withVerticalLabels={true}
                withHorizontalLabels={true}
                segments={5}
              />
            </View>
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
                {Math.round(dailyStats.totalCalories || 0)}
              </Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {Math.round(dailyStats.totalCarbs || 0)}g
              </Text>
              <Text style={styles.statLabel}>Carbs</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {Math.round(dailyStats.totalProtein || 0)}g
              </Text>
              <Text style={styles.statLabel}>Protein</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {Math.round(dailyStats.totalFats || 0)}g
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
          {Array.isArray(dailyStats.meals) && dailyStats.meals.length > 0 ? (
            dailyStats.meals.map((meal, index) => (
              <View key={index} style={styles.mealItem}>
                <View style={styles.mealTimeContainer}>
                  <Text style={styles.mealTime}>{meal.time || 'N/A'}</Text>
                </View>
                <View style={styles.mealDetails}>
                  <Text style={styles.mealFood}>{meal.food.length > 30 ? meal.food.slice(0, 30) + '...' : meal.food}</Text>
                  <View style={styles.mealMacrosContainer}>
                    <Text style={styles.mealCalories}>{Math.round(meal.calories || 0)} cal</Text>
                    <Text style={styles.mealMacros}>{Math.round(meal.macros.carbs || 0)}g carbs, {Math.round(meal.macros.protein || 0)}g protein, {Math.round(meal.macros.fats || 0)}g fats</Text>
                  </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    // paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    // paddingTop: Platform.OS === 'ios' ? 25 : 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resetButton: {
    padding: 8,
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff4444',
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
    width: 50,
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
  mealMacrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealMacros: {
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
