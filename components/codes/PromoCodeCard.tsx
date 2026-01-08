import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Copy, Clock, Gift } from 'lucide-react-native';
import { PromoCode } from '@/types';
import {
  DBDColors,
  Spacing,
  BorderRadius,
  Typography,
  Shadows,
} from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';

interface Props {
  code: PromoCode;
}

export function PromoCodeCard({ code }: Props) {
  const { dispatch } = useAppContext();

  const handleCopy = async () => {
    await Clipboard.setStringAsync(code.code);

    // Haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Show toast
    dispatch({ type: 'SHOW_TOAST', payload: `Copied: ${code.code}` });

    // Auto-hide toast after 2 seconds
    setTimeout(() => {
      dispatch({ type: 'HIDE_TOAST' });
    }, 2000);
  };

  const getExpirationColor = () => {
    if (code.isExpired) return DBDColors.status.error;
    if (code.daysLeft !== null && code.daysLeft <= 3)
      return DBDColors.status.warning;
    return DBDColors.status.success;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Gift size={20} color={DBDColors.accent.secondary} />
        <Text style={styles.title} numberOfLines={2}>
          {code.title}
        </Text>
      </View>

      <View style={styles.codeContainer}>
        <Text style={styles.codeText} selectable>
          {code.code}
        </Text>
        <TouchableOpacity
          style={styles.copyButton}
          onPress={handleCopy}
          activeOpacity={0.7}
        >
          <Copy size={18} color={DBDColors.text.primary} />
          <Text style={styles.copyText}>COPY</Text>
        </TouchableOpacity>
      </View>

      {code.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {code.description}
        </Text>
      ) : null}

      {code.expiresAt || code.daysLeft !== null ? (
        <View style={styles.expirationRow}>
          <Clock size={14} color={getExpirationColor()} />
          <Text style={[styles.expiration, { color: getExpirationColor() }]}>
            {code.isExpired
              ? 'Expired'
              : code.expiresAt
                ? `Expires: ${code.expiresAt}`
                : ''}
            {code.daysLeft !== null && !code.isExpired
              ? ` (${code.daysLeft}d left)`
              : ''}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: DBDColors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: DBDColors.accent.primary,
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.subtitle,
    color: DBDColors.text.primary,
    flex: 1,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DBDColors.background.tertiary,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  codeText: {
    ...Typography.code,
    color: DBDColors.accent.secondary,
    flex: 1,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DBDColors.accent.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  copyText: {
    ...Typography.small,
    color: DBDColors.text.primary,
    fontWeight: 'bold',
  },
  description: {
    ...Typography.body,
    color: DBDColors.text.secondary,
    marginBottom: Spacing.sm,
  },
  expirationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  expiration: {
    ...Typography.caption,
  },
});
