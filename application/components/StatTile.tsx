import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fonts } from '@/theme/typography';

interface StatTileProps {
  value: number | string;
  label: string;
  accentColor: string;
  textMuted: string;
  bgCard: string;
}

export function StatTile({ value, label, accentColor, textMuted, bgCard }: StatTileProps) {
  return (
    <View style={[styles.tile, { backgroundColor: bgCard }]}>
      <Text style={[styles.value, { color: accentColor }]}>{value}</Text>
      <Text style={[styles.label, { color: textMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    padding: 16,
    borderRadius: 12,
    flexBasis: '48%',
  },
  value: {
    fontFamily: fonts.syne.bold,
    fontSize: 24,
    marginBottom: 4,
  },
  label: {
    fontFamily: fonts.manrope.regular,
    fontSize: 13,
  },
});
