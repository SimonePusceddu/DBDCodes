/**
 * AdMob Configuration
 *
 * Test IDs are Google's official test ad units - always fill, never generate revenue
 * Production IDs should be replaced with your real AdMob ad unit IDs
 */

export const AD_CONFIG = {
  // Test IDs (Google's official test IDs for Banner Ads)
  TEST_IDS: {
    BANNER_ANDROID: 'ca-app-pub-3940256099942544/6300978111',
    BANNER_IOS: 'ca-app-pub-3940256099942544/2934735716',
  },

  // Production IDs (replace these with your real IDs from AdMob console)
  PROD_IDS: {
    BANNER_ANDROID: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
    BANNER_IOS: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
  },

  // Ad frequency - show an ad every N promo codes
  CODES_PER_AD: 8,

  // Enable/disable ads globally
  ADS_ENABLED: true,

  // Use test ads (automatically uses test IDs in development mode)
  USE_TEST_ADS: __DEV__,
} as const;

/**
 * Get the appropriate ad unit ID based on platform and environment
 * @param platform - 'ios' or 'android'
 * @returns Ad unit ID string
 */
export function getAdUnitId(platform: 'ios' | 'android'): string {
  if (AD_CONFIG.USE_TEST_ADS) {
    return platform === 'ios'
      ? AD_CONFIG.TEST_IDS.BANNER_IOS
      : AD_CONFIG.TEST_IDS.BANNER_ANDROID;
  }

  return platform === 'ios'
    ? AD_CONFIG.PROD_IDS.BANNER_IOS
    : AD_CONFIG.PROD_IDS.BANNER_ANDROID;
}
