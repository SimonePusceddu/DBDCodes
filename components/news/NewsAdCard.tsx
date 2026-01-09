import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import {
  DBDColors,
  Spacing,
  BorderRadius,
  Shadows,
  Typography,
} from '@/constants/theme';
import { getAdUnitIdForPlacement } from '@/constants/ads';

const AD_WIDTH = Dimensions.get('window').width - Spacing.lg * 2;

interface Props {
  adUnitId?: string;
}

export function NewsAdCard({ adUnitId }: Props) {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  const finalAdUnitId =
    adUnitId ||
    getAdUnitIdForPlacement('news', Platform.OS as 'ios' | 'android');

  const handleAdLoaded = () => {
    setAdLoaded(true);
    setAdError(false);
  };

  const handleAdFailedToLoad = (error: any) => {
    console.error('[NewsAdCard] Ad failed to load:', error);
    setAdError(true);
  };

  return (
    <View style={styles.card}>
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
  card: {
    width: AD_WIDTH,
    backgroundColor: DBDColors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: DBDColors.border.subtle,
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
    ...Typography.caption,
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
