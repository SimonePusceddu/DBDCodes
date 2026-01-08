import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Store } from 'lucide-react-native';
import { PerkCard } from './PerkCard';
import { PerkDetailModal } from './PerkDetailModal';
import { CountdownTimer } from './CountdownTimer';
import { ShrinePerk } from '@/types';
import { DBDColors, Spacing, Typography } from '@/constants/theme';

interface Props {
  perks: ShrinePerk[];
  resetTime: Date;
}

export function ShrineGrid({ perks, resetTime }: Props) {
  const [selectedPerk, setSelectedPerk] = useState<ShrinePerk | null>(null);

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
          <PerkCard
            key={perk.id}
            perk={perk}
            onPress={() => setSelectedPerk(perk)}
          />
        ))}
      </View>

      <PerkDetailModal
        perk={selectedPerk}
        onClose={() => setSelectedPerk(null)}
      />
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
