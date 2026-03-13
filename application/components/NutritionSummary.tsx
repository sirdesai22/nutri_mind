import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface NutritionSummaryProps {
  calories: number;
  macros: {
    carbs: number;
    protein: number;
    fats: number;
  };
}

export function NutritionSummary({ calories, macros }: NutritionSummaryProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.calories}>
        {calories} kcal
      </Text>
      <View style={styles.macrosContainer}>
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Carbs</Text>
          <Text style={styles.macroValue}>{macros.carbs}g</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Protein</Text>
          <Text style={styles.macroValue}>{macros.protein}g</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Fats</Text>
          <Text style={styles.macroValue}>{macros.fats}g</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  calories: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 16,
    color: '#666666',
  },
}); 