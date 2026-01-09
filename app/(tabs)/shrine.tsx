import React from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Text,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShrineGrid } from '@/components/shrine/ShrineGrid';
import { BannerAdCard } from '@/components/codes/BannerAdCard';
import { useShrineOfSecrets } from '@/hooks/useShrineOfSecrets';
import { getAdUnitIdForPlacement } from '@/constants/ads';
import { DBDColors, Spacing, Typography } from '@/constants/theme';

export default function ShrineScreen() {
  const { shrine, refresh } = useShrineOfSecrets();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  if (!shrine) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={DBDColors.accent.secondary} />
          <Text style={styles.loadingText}>Loading Shrine...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={DBDColors.accent.secondary}
            colors={[DBDColors.accent.secondary]}
            progressBackgroundColor={DBDColors.background.secondary}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Shrine of</Text>
          <Text style={styles.titleAccent}>Secrets</Text>
        </View>

        <View style={styles.weekBadge}>
          <Text style={styles.weekText}>Week {shrine.week}</Text>
        </View>

        <ShrineGrid perks={shrine.perks} resetTime={shrine.endTime} />

        <View style={styles.adContainer}>
          <BannerAdCard
            adUnitId={getAdUnitIdForPlacement(
              'shrine',
              Platform.OS as 'ios' | 'android'
            )}
          />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About the Shrine</Text>
          <Text style={styles.infoText}>
            The Shrine of Secrets refreshes every Tuesday at 15:00 UTC with 4
            random perks. You can purchase these perks with Iridescent Shards
            without owning the character.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DBDColors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  title: {
    ...Typography.header,
    color: DBDColors.text.primary,
  },
  titleAccent: {
    ...Typography.header,
    color: DBDColors.accent.secondary,
  },
  weekBadge: {
    alignSelf: 'flex-start',
    backgroundColor: DBDColors.background.tertiary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    marginBottom: Spacing.lg,
  },
  weekText: {
    ...Typography.body,
    color: DBDColors.text.secondary,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    ...Typography.body,
    color: DBDColors.text.muted,
  },
  infoCard: {
    backgroundColor: DBDColors.background.secondary,
    borderRadius: 12,
    padding: Spacing.lg,
    marginTop: Spacing.xl,
    borderLeftWidth: 3,
    borderLeftColor: DBDColors.shrine.shards,
  },
  adContainer: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  infoTitle: {
    ...Typography.subtitle,
    color: DBDColors.text.primary,
    marginBottom: Spacing.sm,
  },
  infoText: {
    ...Typography.body,
    color: DBDColors.text.secondary,
    lineHeight: 22,
  },
});
