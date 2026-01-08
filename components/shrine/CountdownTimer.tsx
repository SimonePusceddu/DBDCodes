import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Timer } from 'lucide-react-native';
import { useCountdown, formatCountdown } from '@/hooks/useCountdown';
import { DBDColors, Spacing, Typography, BorderRadius } from '@/constants/theme';

interface Props {
  targetDate: Date;
}

export function CountdownTimer({ targetDate }: Props) {
  const countdown = useCountdown(targetDate);

  return (
    <View style={styles.container}>
      <Timer size={14} color={DBDColors.accent.secondary} />
      <Text style={styles.text}>{formatCountdown(countdown)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DBDColors.background.tertiary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  text: {
    ...Typography.small,
    color: DBDColors.accent.secondary,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
});
