import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import mobileAds, {
  AdsConsent,
  AdsConsentStatus,
  MaxAdContentRating,
} from 'react-native-google-mobile-ads';
import { requestTrackingPermission } from 'react-native-tracking-transparency';

export function useAdMobInit() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [consentStatus, setConsentStatus] = useState<AdsConsentStatus | null>(
    null
  );

  useEffect(() => {
    initializeAdMob();
  }, []);

  const initializeAdMob = async () => {
    try {
      // Step 1: Request tracking permission on iOS (required for iOS 14+)
      if (Platform.OS === 'ios') {
        const trackingStatus = await requestTrackingPermission();
        console.log('[AdMob] iOS tracking status:', trackingStatus);
      }

      // Step 2: Request consent information (GDPR/CCPA compliance)
      const consentInfo = await AdsConsent.requestInfoUpdate();
      setConsentStatus(consentInfo.status);
      console.log('[AdMob] Consent status:', consentInfo.status);

      // Step 3: Show consent form if required
      if (
        consentInfo.isConsentFormAvailable &&
        consentInfo.status === AdsConsentStatus.REQUIRED
      ) {
        console.log('[AdMob] Showing consent form...');
        await AdsConsent.showForm();
      }

      // Step 4: Initialize Mobile Ads SDK
      await mobileAds().initialize();
      console.log('[AdMob] SDK initialized');

      // Step 5: Configure ad request settings
      await mobileAds().setRequestConfiguration({
        // Maximum ad content rating
        maxAdContentRating: MaxAdContentRating.PG,
        // Set to true if your app is designed for children
        tagForChildDirectedTreatment: false,
        // Set to true if you want to treat users as under age of consent
        tagForUnderAgeOfConsent: false,
      });

      setIsInitialized(true);
      console.log('[AdMob] Initialization complete');
    } catch (error) {
      console.error('[AdMob] Initialization failed:', error);
      setIsInitialized(false);
    }
  };

  return {
    isInitialized,
    consentStatus,
  };
}
