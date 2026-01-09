import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { DBDColors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { getAdUnitId } from '@/constants/ads';

// Full width for ads (spans entire row)
const AD_WIDTH = Dimensions.get('window').width - Spacing.lg * 2;

interface Props {
  adUnitId?: string;
}

export function BannerAdCard({ adUnitId }: Props) {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  // Get platform-specific ad unit ID
  const finalAdUnitId = adUnitId || getAdUnitId(Platform.OS as 'ios' | 'android');

  console.log('[BannerAdCard] Rendering with ad unit ID:', finalAdUnitId);

  const handleAdLoaded = () => {
    console.log('[BannerAdCard] Ad loaded successfully');
    setAdLoaded(true);
    setAdError(false);
  };

  const handleAdFailedToLoad = (error: any) => {
    console.error('[BannerAdCard] Ad failed to load:', error);
    setAdError(true);
  };

  return (
    <View style={styles.container}>
      {/* Ad Badge - Required by AdMob policy */}
      <View style={styles.adBadge}>
        <Text style={styles.adBadgeText}>AD</Text>
      </View>

      {adError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Ad failed to load</Text>
        </View>
      ) : (
        <View style={styles.adWrapper}>
          <BannerAd
            unitId={finalAdUnitId}
            size={BannerAdSize.MEDIUM_RECTANGLE}
            requestOptions={{
              requestNonPersonalizedAdsOnly: false,
            }}
            onAdLoaded={handleAdLoaded}
            onAdFailedToLoad={handleAdFailedToLoad}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: AD_WIDTH,
    backgroundColor: DBDColors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderTopWidth: 3,
    borderTopColor: DBDColors.accent.secondary,
    ...Shadows.card,
    alignItems: 'center',
    justifyContent: 'center',
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
  adWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  errorText: {
    color: DBDColors.text.muted,
    fontSize: 12,
  },
});
