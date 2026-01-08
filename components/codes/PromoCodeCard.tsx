import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Copy, Clock, Sparkles, AlertCircle } from 'lucide-react-native';
import { PromoCode } from '@/types';
import {
  DBDColors,
  Spacing,
  BorderRadius,
  Typography,
  Shadows,
} from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';

const CARD_WIDTH = (Dimensions.get('window').width - Spacing.lg * 3) / 2;

interface Props {
  code: PromoCode;
  isNew?: boolean;
  isExpired?: boolean;
}

export function PromoCodeCard({ code, isNew = false, isExpired = false }: Props) {
  const { dispatch } = useAppContext();
  const isExpiringSoon = !isExpired && code.daysLeft !== null && code.daysLeft <= 7;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(code.code);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    dispatch({ type: 'SHOW_TOAST', payload: `Copied: ${code.code}` });
    setTimeout(() => {
      dispatch({ type: 'HIDE_TOAST' });
    }, 2000);
  };

  const getExpirationColor = () => {
    if (isExpired || code.isExpired) return DBDColors.status.error;
    if (code.daysLeft !== null && code.daysLeft <= 3)
      return DBDColors.status.warning;
    return DBDColors.status.success;
  };

  const getBorderColor = () => {
    if (isExpired) return DBDColors.text.muted;
    if (isExpiringSoon) return DBDColors.status.warning;
    return DBDColors.accent.primary;
  };

  return (
    <View style={[
      styles.card,
      isExpired && styles.expiredCard,
      isExpiringSoon && styles.expiringSoonCard,
      { borderTopColor: getBorderColor() }
    ]}>
      {isNew && !isExpired && !isExpiringSoon && (
        <View style={styles.newBadge}>
          <Sparkles size={10} color={DBDColors.text.primary} />
          <Text style={styles.newBadgeText}>NEW</Text>
        </View>
      )}

      {isExpiringSoon && (
        <View style={styles.expiringSoonBadge}>
          <AlertCircle size={10} color={DBDColors.text.primary} />
          <Text style={styles.expiringSoonBadgeText}>EXPIRING SOON</Text>
        </View>
      )}

      <Text style={[styles.title, isExpired && styles.expiredText]} numberOfLines={2}>
        {code.title}
      </Text>

      <View style={[
        styles.codeContainer,
        isExpired && styles.expiredCodeContainer,
        isExpiringSoon && styles.expiringSoonCodeContainer
      ]}>
        <Text style={[styles.codeText, isExpired && styles.expiredCodeText]} numberOfLines={1}>
          {code.code}
        </Text>
      </View>

      {code.daysLeft !== null && (
        <View style={styles.expirationRow}>
          <Clock size={12} color={getExpirationColor()} />
          <Text style={[styles.expiration, { color: getExpirationColor() }]}>
            {isExpired || code.isExpired ? 'Expired' : `${code.daysLeft}d left`}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.copyButton, isExpired && styles.expiredButton]}
        onPress={handleCopy}
        activeOpacity={0.7}
      >
        <Copy size={14} color={DBDColors.text.primary} />
        <Text style={styles.copyText}>COPY</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: DBDColors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderTopWidth: 3,
    borderTopColor: DBDColors.accent.primary,
    ...Shadows.card,
  },
  expiredCard: {
    opacity: 0.6,
    borderTopColor: DBDColors.text.muted,
  },
  expiringSoonCard: {
    borderTopWidth: 4,
    backgroundColor: DBDColors.background.tertiary,
  },
  newBadge: {
    position: 'absolute',
    top: -8,
    right: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DBDColors.status.success,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 2,
  },
  newBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: DBDColors.text.primary,
  },
  expiringSoonBadge: {
    position: 'absolute',
    top: -8,
    right: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DBDColors.status.warning,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 2,
  },
  expiringSoonBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: DBDColors.text.primary,
  },
  title: {
    ...Typography.caption,
    color: DBDColors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    minHeight: 36,
  },
  expiredText: {
    color: DBDColors.text.muted,
  },
  codeContainer: {
    backgroundColor: DBDColors.background.tertiary,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  expiredCodeContainer: {
    backgroundColor: DBDColors.background.primary,
  },
  expiringSoonCodeContainer: {
    borderWidth: 1,
    borderColor: DBDColors.status.warning,
  },
  codeText: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: DBDColors.accent.secondary,
    textAlign: 'center',
  },
  expiredCodeText: {
    color: DBDColors.text.muted,
  },
  expirationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: Spacing.sm,
  },
  expiration: {
    ...Typography.small,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DBDColors.accent.primary,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  expiredButton: {
    backgroundColor: DBDColors.text.muted,
  },
  copyText: {
    ...Typography.small,
    color: DBDColors.text.primary,
    fontWeight: 'bold',
  },
});
