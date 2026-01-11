import { AD_CONFIG } from '@/constants/ads';
import { BorderRadius, DBDColors, Spacing, Typography } from '@/constants/theme';
import { useSeenCodes } from '@/hooks/useSeenCodes';
import { PromoCode, PromoListItem } from '@/types';
import { insertAdsIntoCodesList } from '@/utils/adInsertion';
import { Archive, ChevronDown, ChevronUp, Sparkles, Ticket } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BannerAdCard } from './BannerAdCard';
import { PromoCodeCard } from './PromoCodeCard';

interface Props {
  codes: PromoCode[];
}

export function PromoCodesList({ codes }: Props) {
  const [showExpired, setShowExpired] = useState(false);
  const { isNewCode, markMultipleAsSeen, isLoaded } = useSeenCodes();

  // Separate new codes from other active codes
  const { newCodes, otherActiveCodes, expiredCodes } = useMemo(() => {
    const newList: PromoCode[] = [];
    const otherActive: PromoCode[] = [];
    const expired: PromoCode[] = [];

    codes.forEach((code) => {
      if (code.isExpired) {
        expired.push(code);
      } else if (isLoaded && isNewCode(code.id)) {
        newList.push(code);
      } else {
        otherActive.push(code);
      }
    });

    // Sort other active codes: expiring soon first, then by days left
    otherActive.sort((a, b) => {
      const aExpiringSoon = a.daysLeft !== null && a.daysLeft <= 7;
      const bExpiringSoon = b.daysLeft !== null && b.daysLeft <= 7;

      // Expiring soon codes come first
      if (aExpiringSoon && !bExpiringSoon) return -1;
      if (!aExpiringSoon && bExpiringSoon) return 1;

      // Within expiring soon, sort by fewest days first
      if (aExpiringSoon && bExpiringSoon) {
        return (a.daysLeft ?? 999) - (b.daysLeft ?? 999);
      }

      // Then by days left (soonest first)
      return (a.daysLeft ?? 999) - (b.daysLeft ?? 999);
    });

    return { newCodes: newList, otherActiveCodes: otherActive, expiredCodes: expired };
  }, [codes, isNewCode, isLoaded]);

  // Create mixed arrays with ads inserted every N codes
  const newCodesWithAds = useMemo<PromoListItem[]>(() => {
    if (!AD_CONFIG.ADS_ENABLED) {
      return newCodes.map(code => ({ type: 'code', data: code }));
    }
    return insertAdsIntoCodesList(newCodes, AD_CONFIG.CODES_PER_AD);
  }, [newCodes]);

  const otherActiveCodesWithAds = useMemo<PromoListItem[]>(() => {
    if (!AD_CONFIG.ADS_ENABLED) {
      return otherActiveCodes.map(code => ({ type: 'code', data: code }));
    }
    return insertAdsIntoCodesList(otherActiveCodes, AD_CONFIG.CODES_PER_AD);
  }, [otherActiveCodes]);

  const expiredCodesWithAds = useMemo<PromoListItem[]>(() => {
    if (!AD_CONFIG.ADS_ENABLED) {
      return expiredCodes.map(code => ({ type: 'code', data: code }));
    }
    return insertAdsIntoCodesList(expiredCodes, AD_CONFIG.CODES_PER_AD);
  }, [expiredCodes]);

  // Mark all active codes as seen after a short delay (user has seen them)
  useEffect(() => {
    const allActiveCodes = [...newCodes, ...otherActiveCodes];
    if (isLoaded && allActiveCodes.length > 0) {
      const timer = setTimeout(() => {
        const codeIds = allActiveCodes.map((c) => c.id);
        markMultipleAsSeen(codeIds);
      }, 30000); // Mark as seen after 30 seconds - gives users time to see and copy new codes

      return () => clearTimeout(timer);
    }
  }, [newCodes, otherActiveCodes, markMultipleAsSeen, isLoaded]);

  // Helper to render either a code or an ad
  const renderItem = (item: PromoListItem, isNew: boolean = false) => {
    if (item.type === 'ad') {
      return <BannerAdCard key={item.id} />;
    }
    return (
      <PromoCodeCard
        key={item.data.id}
        code={item.data}
        isNew={isNew}
      />
    );
  };

  if (codes.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Ticket size={24} color={DBDColors.accent.secondary} />
          <Text style={styles.title}>Promo Codes</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No codes available</Text>
        </View>
      </View>
    );
  }

  const expiringSoonCount = otherActiveCodes.filter(
    (c) => c.daysLeft !== null && c.daysLeft <= 7
  ).length;
  const totalActiveCodes = newCodes.length + otherActiveCodes.length;

  return (
    <View style={styles.container}>
      {/* NEW CODES SECTION */}
      {newCodes.length > 0 && (
        <View style={styles.newCodesSection}>
          <View style={styles.newCodesHeader}>
            <View style={styles.newCodesHeaderLeft}>
              <View style={styles.sparkleIconContainer}>
                <Sparkles size={20} color={DBDColors.text.primary} />
              </View>
              <View>
                <Text style={styles.newCodesTitle}>New Codes!</Text>
                <Text style={styles.newCodesSubtitle}>
                  {newCodes.length} new {newCodes.length === 1 ? 'code' : 'codes'} available
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.grid}>
            {newCodesWithAds.map((item) => renderItem(item, true))}
          </View>
        </View>
      )}

      {/* OTHER ACTIVE CODES SECTION */}
      {otherActiveCodes.length > 0 && (
        <View style={styles.otherCodesSection}>
          <View style={styles.header}>
            <Ticket size={24} color={DBDColors.accent.secondary} />
            <Text style={styles.title}>
              {newCodes.length > 0 ? 'Other Active Codes' : 'Active Codes'}
            </Text>
            {expiringSoonCount > 0 && (
              <View style={styles.warnBadge}>
                <Text style={styles.warnBadgeText}>{expiringSoonCount} EXPIRING</Text>
              </View>
            )}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{otherActiveCodes.length}</Text>
            </View>
          </View>
          <View style={styles.grid}>
            {otherActiveCodesWithAds.map((item) => renderItem(item, false))}
          </View>
        </View>
      )}

      {/* Empty state when no active codes */}
      {totalActiveCodes === 0 && (
        <View style={styles.header}>
          <Ticket size={24} color={DBDColors.accent.secondary} />
          <Text style={styles.title}>Active Codes</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>0</Text>
          </View>
        </View>
      )}
      {totalActiveCodes === 0 && (
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
              {expiredCodesWithAds.map((item) => {
                if (item.type === 'ad') {
                  return <BannerAdCard key={item.id} />;
                }
                return <PromoCodeCard key={item.data.id} code={item.data} isExpired />;
              })}
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
  // New Codes Section Styles
  newCodesSection: {
    marginBottom: Spacing.xl,
  },
  newCodesHeader: {
    backgroundColor: DBDColors.status.success + '20',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: DBDColors.status.success,
  },
  newCodesHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  sparkleIconContainer: {
    backgroundColor: DBDColors.status.success,
    borderRadius: BorderRadius.full,
    padding: Spacing.sm,
  },
  newCodesTitle: {
    ...Typography.title,
    color: DBDColors.status.success,
    fontWeight: 'bold',
  },
  newCodesSubtitle: {
    ...Typography.small,
    color: DBDColors.text.secondary,
    marginTop: 2,
  },
  otherCodesSection: {
    marginTop: Spacing.md,
  },
});
