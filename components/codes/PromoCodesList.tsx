import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ticket, ChevronDown, ChevronUp, Archive } from 'lucide-react-native';
import { PromoCode } from '@/types';
import { PromoCodeCard } from './PromoCodeCard';
import { useSeenCodes } from '@/hooks/useSeenCodes';
import { DBDColors, Spacing, Typography, BorderRadius } from '@/constants/theme';

interface Props {
  codes: PromoCode[];
}

export function PromoCodesList({ codes }: Props) {
  const [showExpired, setShowExpired] = useState(false);
  const { isNewCode, markMultipleAsSeen, isLoaded } = useSeenCodes();

  const { activeCodes, expiredCodes } = useMemo(() => {
    const active: PromoCode[] = [];
    const expired: PromoCode[] = [];

    codes.forEach((code) => {
      if (code.isExpired) {
        expired.push(code);
      } else {
        active.push(code);
      }
    });

    // Sort active codes: new codes first, then expiring soon, then by days left (soonest first)
    active.sort((a, b) => {
      const aIsNew = isLoaded && isNewCode(a.id);
      const bIsNew = isLoaded && isNewCode(b.id);
      const aExpiringSoon = a.daysLeft !== null && a.daysLeft <= 7;
      const bExpiringSoon = b.daysLeft !== null && b.daysLeft <= 7;

      // 1. New codes first
      if (aIsNew && !bIsNew) return -1;
      if (!aIsNew && bIsNew) return 1;

      // 2. Among non-new codes, expiring soon (<=7 days) come next
      if (!aIsNew && !bIsNew) {
        if (aExpiringSoon && !bExpiringSoon) return -1;
        if (!aExpiringSoon && bExpiringSoon) return 1;

        // Within expiring soon, sort by fewest days first
        if (aExpiringSoon && bExpiringSoon) {
          return (a.daysLeft ?? 999) - (b.daysLeft ?? 999);
        }
      }

      // 3. Then by days left (soonest first - fewest days first)
      return (a.daysLeft ?? 999) - (b.daysLeft ?? 999);
    });

    return { activeCodes: active, expiredCodes: expired };
  }, [codes, isNewCode, isLoaded]);

  // Mark all active codes as seen after a short delay (user has seen them)
  useEffect(() => {
    if (isLoaded && activeCodes.length > 0) {
      const timer = setTimeout(() => {
        const codeIds = activeCodes.map((c) => c.id);
        markMultipleAsSeen(codeIds);
      }, 3000); // Mark as seen after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [activeCodes, markMultipleAsSeen, isLoaded]);

  if (codes.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Ticket size={24} color={DBDColors.accent.secondary} />
          <Text style={styles.title}>Promo Codes</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No codes available</Text>
          <Text style={styles.emptySubtext}>Pull down to refresh</Text>
        </View>
      </View>
    );
  }

  const newCodesCount = activeCodes.filter((c) => isNewCode(c.id)).length;
  const expiringSoonCount = activeCodes.filter(
    (c) => !isNewCode(c.id) && c.daysLeft !== null && c.daysLeft <= 7
  ).length;

  return (
    <View style={styles.container}>
      {/* Active Codes Section */}
      <View style={styles.header}>
        <Ticket size={24} color={DBDColors.accent.secondary} />
        <Text style={styles.title}>Active Codes</Text>
        {newCodesCount > 0 && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>{newCodesCount} NEW</Text>
          </View>
        )}
        {expiringSoonCount > 0 && (
          <View style={styles.warnBadge}>
            <Text style={styles.warnBadgeText}>{expiringSoonCount} EXPIRING</Text>
          </View>
        )}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{activeCodes.length}</Text>
        </View>
      </View>

      {activeCodes.length > 0 ? (
        <View style={styles.grid}>
          {activeCodes.map((code) => (
            <PromoCodeCard
              key={code.id}
              code={code}
              isNew={isNewCode(code.id)}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No active codes right now</Text>
        </View>
      )}

      {/* Expired Codes Section */}
      {expiredCodes.length > 0 && (
        <View style={styles.expiredSection}>
          <TouchableOpacity
            style={styles.expiredHeader}
            onPress={() => setShowExpired(!showExpired)}
            activeOpacity={0.7}
          >
            <Archive size={20} color={DBDColors.text.muted} />
            <Text style={styles.expiredTitle}>Expired Codes</Text>
            <View style={styles.expiredBadge}>
              <Text style={styles.expiredBadgeText}>{expiredCodes.length}</Text>
            </View>
            {showExpired ? (
              <ChevronUp size={20} color={DBDColors.text.muted} />
            ) : (
              <ChevronDown size={20} color={DBDColors.text.muted} />
            )}
          </TouchableOpacity>

          {showExpired && (
            <View style={styles.grid}>
              {expiredCodes.map((code) => (
                <PromoCodeCard key={code.id} code={code} isExpired />
              ))}
            </View>
          )}
        </View>
      )}
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
  newBadge: {
    backgroundColor: DBDColors.status.success,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  newBadgeText: {
    ...Typography.small,
    color: DBDColors.text.primary,
    fontWeight: 'bold',
  },
  warnBadge: {
    backgroundColor: DBDColors.status.warning,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  warnBadgeText: {
    fontSize: 10,
    color: DBDColors.text.primary,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
  expiredSection: {
    marginTop: Spacing.lg,
  },
  expiredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DBDColors.background.secondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  expiredTitle: {
    ...Typography.subtitle,
    color: DBDColors.text.muted,
    flex: 1,
  },
  expiredBadge: {
    backgroundColor: DBDColors.background.tertiary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  expiredBadgeText: {
    ...Typography.small,
    color: DBDColors.text.muted,
    fontWeight: 'bold',
  },
});
