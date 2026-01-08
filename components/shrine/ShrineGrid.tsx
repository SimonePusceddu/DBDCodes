import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Store } from 'lucide-react-native';
import { PerkCard } from './PerkCard';
import { CountdownTimer } from './CountdownTimer';
import { ShrinePerk } from '@/types';
import { DBDColors, Spacing, Typography } from '@/constants/theme';

interface Props {
  perks: ShrinePerk[];
  resetTime: Date;
}

export function ShrineGrid({ perks, resetTime }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Store size={24} color={DBDColors.accent.secondary} />
          <Text style={styles.title}>Shrine of Secrets</Text>
        </View>
        <CountdownTimer targetDate={resetTime} />
      </View>

      <View style={styles.grid}>
        {perks.slice(0, 4).map((perk) => (
          <PerkCard key={perk.id} perk={perk} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    ...Typography.title,
    color: DBDColors.text.primary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
