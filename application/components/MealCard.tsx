import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Animated as RNAnimated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { fonts } from '@/theme/typography';

interface MealCardProps {
  food: string;
  calories: number;
  macros: { carbs: number; protein: number; fats: number };
  onDelete: () => void;
  onEdit?: () => void;
  bgCard: string;
  textPrimary: string;
  accent: string;
  textMuted: string;
  destructive: string;
  dotColor?: string;
}

export function MealCard({
  food,
  calories,
  macros,
  onDelete,
  onEdit,
  bgCard,
  textPrimary,
  accent,
  textMuted,
  destructive,
  dotColor,
}: MealCardProps) {
  const opacity = React.useRef(new RNAnimated.Value(1)).current;

  const handleDelete = () => {
    RNAnimated.timing(opacity, { toValue: 0, duration: 120, useNativeDriver: true }).start(() => onDelete());
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(200)}
      style={[styles.card, { backgroundColor: bgCard }]}
    >
      <TouchableOpacity
        onPress={onEdit}
        activeOpacity={0.9}
        style={styles.inner}
      >
        {dotColor != null && (
          <View style={[styles.dot, { backgroundColor: dotColor }]} />
        )}
        <View style={styles.info}>
          <Text style={[styles.food, { color: textPrimary }]} numberOfLines={1}>
            {food}
          </Text>
          <Text style={[styles.macros, { color: textMuted }]}>
            Carbs <Text style={{ color: accent }}>{Math.round(macros.carbs)}g</Text>
            {' · '}
            Protein <Text style={{ color: accent }}>{Math.round(macros.protein)}g</Text>
            {' · '}
            Fats <Text style={{ color: accent }}>{Math.round(macros.fats)}g</Text>
          </Text>
        </View>
        <View style={styles.right}>
          <Text style={[styles.cal, { color: textPrimary }]}>{calories}</Text>
          <TouchableOpacity onPress={handleDelete} hitSlop={12} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={18} color={destructive} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 10, alignSelf: 'center', flexShrink: 0 },
  info: { flex: 1 },
  food: { fontFamily: fonts.manrope.medium, fontSize: 16, flexShrink: 1 },
  macros: { fontFamily: fonts.mono, fontSize: 12, marginTop: 2 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cal: { fontFamily: fonts.syne.bold, fontSize: 18 },
  deleteBtn: { padding: 4 },
});
