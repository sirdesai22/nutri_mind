import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

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
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.calories}>
        {calories} kcal
      </ThemedText>
      <ThemedView style={styles.macrosContainer}>
        <ThemedView style={styles.macroItem}>
          <ThemedText type="defaultSemiBold">Carbs</ThemedText>
          <ThemedText>{macros.carbs}g</ThemedText>
        </ThemedView>
        <ThemedView style={styles.macroItem}>
          <ThemedText type="defaultSemiBold">Protein</ThemedText>
          <ThemedText>{macros.protein}g</ThemedText>
        </ThemedView>
        <ThemedView style={styles.macroItem}>
          <ThemedText type="defaultSemiBold">Fats</ThemedText>
          <ThemedText>{macros.fats}g</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  calories: {
    fontSize: 24,
    marginBottom: 8,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
  },
}); 