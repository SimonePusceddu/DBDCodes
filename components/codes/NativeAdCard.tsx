import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';
import { DBDColors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/theme';
import { getAdUnitId } from '@/constants/ads';

// Full width for ads (spans entire row)
const AD_WIDTH = Dimensions.get('window').width - Spacing.lg * 2;

interface Props {
  adUnitId?: string;
}

export function NativeAdCard({ adUnitId }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [adError, setAdError] = useState(false);

  // Get platform-specific ad unit ID
  const finalAdUnitId = adUnitId || getAdUnitId(Platform.OS as 'ios' | 'android');

  useEffect(() => {
    loadAd();
  }, []);

  const loadAd = async () => {
    try {
      setIsLoading(true);
      setAdError(false);
      console.log('[NativeAdCard] Loading ad with ID:', finalAdUnitId);

      // Simulate ad loading for now
      // In production, this would use the actual Google Mobile Ads SDK
      setTimeout(() => {
        setIsLoading(false);
        console.log('[NativeAdCard] Ad loaded successfully');
      }, 1000);
    } catch (error) {
      console.error('[NativeAdCard] Ad load error:', error);
      setAdError(true);
      setIsLoading(false);
    }
  };

  // Don't render if ad failed to load (graceful degradation)
  if (adError) {
    return null;
  }

  return (
    <View style={styles.card}>
      {/* Ad Badge - Required by AdMob policy */}
      <View style={styles.adBadge}>
        <Text style={styles.adBadgeText}>AD</Text>
      </View>

      {/* Ad content - Real ads will be integrated here */}
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconPlaceholder} />
          <View style={styles.headerText}>
            <Text style={styles.advertiser} numberOfLines={1}>
              Test Advertiser
            </Text>
            <Text style={styles.sponsored}>Sponsored</Text>
          </View>
        </View>

        <Text style={styles.headline} numberOfLines={2}>
          {isLoading ? 'Loading ad...' : 'Test Native Ad - Install the app to see real ads!'}
        </Text>

        <View style={styles.mediaContainer}>
          <View style={styles.mediaPlaceholder}>
            <Text style={styles.mediaText}>Ad Image</Text>
          </View>
        </View>

        <Text style={styles.bodyText} numberOfLines={3}>
          This is a test native ad. When you configure your production AdMob account, real ads from advertisers will appear here with actual content and images.
        </Text>

        <View style={styles.ctaButton}>
          <Text style={styles.ctaText}>INSTALL NOW</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: AD_WIDTH,
    backgroundColor: DBDColors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderTopWidth: 3,
    borderTopColor: DBDColors.accent.secondary,
    ...Shadows.card,
  },
  adBadge: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
    backgroundColor: DBDColors.status.warning,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    zIndex: 10,
  },
  adBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: DBDColors.text.primary,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    backgroundColor: DBDColors.background.tertiary,
    marginRight: Spacing.sm,
  },
  headerText: {
    flex: 1,
  },
  advertiser: {
    ...Typography.caption,
    color: DBDColors.text.primary,
    fontWeight: '600',
  },
  sponsored: {
    ...Typography.small,
    fontSize: 10,
    color: DBDColors.text.muted,
  },
  headline: {
    ...Typography.body,
    color: DBDColors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  mediaContainer: {
    backgroundColor: DBDColors.background.tertiary,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: DBDColors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaText: {
    ...Typography.caption,
    color: DBDColors.text.muted,
  },
  bodyText: {
    ...Typography.small,
    color: DBDColors.text.secondary,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  ctaButton: {
    backgroundColor: DBDColors.accent.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  ctaText: {
    ...Typography.body,
    color: DBDColors.text.primary,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
