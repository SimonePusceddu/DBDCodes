import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ticket } from 'lucide-react-native';
import { PromoCode } from '@/types';
import { PromoCodeCard } from './PromoCodeCard';
import { DBDColors, Spacing, Typography } from '@/constants/theme';

interface Props {
  codes: PromoCode[];
}

export function PromoCodesList({ codes }: Props) {
  if (codes.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Ticket size={24} color={DBDColors.accent.secondary} />
          <Text style={styles.title}>Promo Codes</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No active codes available</Text>
          <Text style={styles.emptySubtext}>Pull down to refresh</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ticket size={24} color={DBDColors.accent.secondary} />
        <Text style={styles.title}>Promo Codes</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{codes.length}</Text>
        </View>
      </View>
      {codes.map((code) => (
        <PromoCodeCard key={code.id} code={code} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.title,
    color: DBDColors.text.primary,
    flex: 1,
  },
  badge: {
    backgroundColor: DBDColors.accent.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  badgeText: {
    ...Typography.small,
    color: DBDColors.text.primary,
    fontWeight: 'bold',
  },
  emptyState: {
    backgroundColor: DBDColors.background.secondary,
    borderRadius: 12,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: DBDColors.text.secondary,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    ...Typography.caption,
    color: DBDColors.text.muted,
  },
});
