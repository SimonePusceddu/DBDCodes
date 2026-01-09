import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Platform } from 'react-native';
import NativeAdView from 'react-native-google-mobile-ads';
import { DBDColors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/theme';
import { getAdUnitId } from '@/constants/ads';

const CARD_WIDTH = (Dimensions.get('window').width - Spacing.lg * 3) / 2;

interface Props {
  adUnitId?: string;
}

export function NativeAdCard({ adUnitId }: Props) {
  const [nativeAd, setNativeAd] = useState<any>(null);
  const [adError, setAdError] = useState(false);

  // Get platform-specific ad unit ID
  const finalAdUnitId = adUnitId || getAdUnitId(Platform.OS as 'ios' | 'android');

  useEffect(() => {
    loadAd();
    return () => {
      // Cleanup ad on unmount
      nativeAd?.destroy?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAd = async () => {
    try {
      // Note: The exact implementation will depend on react-native-google-mobile-ads API
      // This is a placeholder structure that matches the expected pattern
      setAdError(false);
      console.log('[NativeAdCard] Ad loading...');
      // Actual ad loading would happen here with the SDK
    } catch (error) {
      console.error('[NativeAdCard] Ad load error:', error);
      setAdError(true);
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

      {/* Ad content will be rendered here by the NativeAdView */}
      <View style={styles.content}>
        <View style={styles.placeholderIcon} />
        <Text style={styles.title} numberOfLines={2}>
          Advertisement
        </Text>
        <View style={styles.mediaContainer}>
          <View style={styles.mediaPlaceholder} />
        </View>
        <Text style={styles.bodyText} numberOfLines={2}>
          Sponsored content
        </Text>
        <View style={styles.ctaButton}>
          <Text style={styles.ctaText}>LEARN MORE</Text>
        </View>
      </View>
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
  placeholderIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    backgroundColor: DBDColors.background.tertiary,
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.caption,
    color: DBDColors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    minHeight: 36,
  },
  mediaContainer: {
    backgroundColor: DBDColors.background.tertiary,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
    height: 80,
  },
  mediaPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: DBDColors.background.tertiary,
  },
  bodyText: {
    ...Typography.small,
    color: DBDColors.text.secondary,
    marginBottom: Spacing.sm,
    lineHeight: 16,
  },
  ctaButton: {
    backgroundColor: DBDColors.accent.primary,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  ctaText: {
    ...Typography.small,
    color: DBDColors.text.primary,
    fontWeight: 'bold',
  },
});
