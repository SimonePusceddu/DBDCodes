import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { fetchPromoCodes } from '@/services/promoCodeScraper';
import { fetchShrineOfSecrets } from '@/services/shrineApi';
import { fetchNews } from '@/services/newsApi';
import { notifyNewPromoCodes, notifyShrineReset, notifyNewNews } from '@/services/notifications';
import { PromoCodesResponse, ShrineData, NewsResponse } from '@/types';

const NOTIFICATION_SETTINGS_KEY = '@dbd_notification_settings';

// Cache keys for storing fetched data
export const CACHE_KEYS = {
  PROMO_CODES: '@dbd_codes_cache',
  SHRINE: '@dbd_shrine_cache',
  NEWS: '@dbd_news_cache',
} as const;

const BACKGROUND_FETCH_TASK = 'background-fetch-dbdcodes';

// Helper function to load notification settings
async function getNotificationSettings(): Promise<{
  promoCodes: boolean;
  shrine: boolean;
  news: boolean;
}> {
  try {
    const stored = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load notification settings:', error);
  }
  return { promoCodes: false, shrine: false, news: false };
}

// Helper function to detect new promo codes
function getNewPromoCodes(oldCodes: PromoCode[], newCodes: PromoCode[]): PromoCode[] {
  if (!oldCodes || oldCodes.length === 0) return [];
  const oldIds = new Set(oldCodes.map(c => c.id));
  return newCodes.filter(c => !oldIds.has(c.id));
}

// Helper function to detect if shrine changed
function hasShrineChanged(oldShrine: ShrineData | null, newShrine: ShrineData | null): boolean {
  if (!oldShrine || !newShrine) return !!newShrine; // New shrine if old is null
  // Compare week number first (most reliable)
  if (oldShrine.week !== newShrine.week) return true;
  // Compare perk IDs
  if (oldShrine.perks.length !== newShrine.perks.length) return true;
  const oldPerkIds = new Set(oldShrine.perks.map(p => p.id));
  const newPerkIds = new Set(newShrine.perks.map(p => p.id));
  // Check if any perk IDs differ
  return oldPerkIds.size !== newPerkIds.size || 
         ![...oldPerkIds].every(id => newPerkIds.has(id));
}

// Helper function to detect new news items
function getNewNewsItems(oldNews: NewsItem[], newNews: NewsItem[]): NewsItem[] {
  if (!oldNews || oldNews.length === 0) return [];
  const oldIds = new Set(oldNews.map(n => n.id));
  return newNews.filter(n => !oldIds.has(n.id));
}

// Background fetch function (can be called manually or by background task)
export async function performBackgroundFetch(): Promise<void> {
  try {
    console.log('[Background Fetch] Starting background data fetch...');

    // Load notification settings
    const notificationSettings = await getNotificationSettings();

    // Load old data for comparison
    const [oldPromoCodesStr, oldShrineStr, oldNewsStr] = await Promise.all([
      AsyncStorage.getItem(CACHE_KEYS.PROMO_CODES),
      AsyncStorage.getItem(CACHE_KEYS.SHRINE),
      AsyncStorage.getItem(CACHE_KEYS.NEWS),
    ]);

    const oldPromoCodes: PromoCodesResponse | null = oldPromoCodesStr 
      ? JSON.parse(oldPromoCodesStr) 
      : null;
    const oldShrine: ShrineData | null = oldShrineStr 
      ? JSON.parse(oldShrineStr) 
      : null;
    const oldNews: NewsResponse | null = oldNewsStr 
      ? JSON.parse(oldNewsStr) 
      : null;

    // Fetch all data in parallel
    const [promoCodesResult, shrineResult, newsResult] = await Promise.allSettled([
      fetchPromoCodes(),
      fetchShrineOfSecrets(),
      fetchNews(),
    ]);

    // Process promo codes
    if (promoCodesResult.status === 'fulfilled') {
      const newPromoCodes = promoCodesResult.value;
      await AsyncStorage.setItem(
        CACHE_KEYS.PROMO_CODES,
        JSON.stringify(newPromoCodes)
      );
      
      // Check for new codes and send notification if enabled
      if (notificationSettings.promoCodes && oldPromoCodes) {
        const newCodes = getNewPromoCodes(oldPromoCodes.codes, newPromoCodes.codes);
        if (newCodes.length > 0) {
          await notifyNewPromoCodes(newCodes);
          console.log(`[Background Fetch] Notified about ${newCodes.length} new promo codes`);
        }
      }
      console.log('[Background Fetch] Promo codes updated');
    } else {
      console.error('[Background Fetch] Failed to fetch promo codes:', promoCodesResult.reason);
    }

    // Process shrine
    if (shrineResult.status === 'fulfilled' && shrineResult.value) {
      const newShrine = shrineResult.value;
      await AsyncStorage.setItem(
        CACHE_KEYS.SHRINE,
        JSON.stringify(newShrine)
      );
      
      // Check if shrine changed and send notification if enabled
      if (notificationSettings.shrine && hasShrineChanged(oldShrine, newShrine)) {
        await notifyShrineReset(newShrine);
        console.log('[Background Fetch] Notified about shrine reset');
      }
      console.log('[Background Fetch] Shrine data updated');
    } else {
      console.error('[Background Fetch] Failed to fetch shrine:', shrineResult.reason);
    }

    // Process news
    if (newsResult.status === 'fulfilled' && newsResult.value) {
      const newNews = newsResult.value;
      await AsyncStorage.setItem(
        CACHE_KEYS.NEWS,
        JSON.stringify(newNews)
      );
      
      // Check for new news items and send notification if enabled
      if (notificationSettings.news && oldNews) {
        const newItems = getNewNewsItems(oldNews.items, newNews.items);
        if (newItems.length > 0) {
          await notifyNewNews(newItems);
          console.log(`[Background Fetch] Notified about ${newItems.length} new news items`);
        }
      }
      console.log('[Background Fetch] News updated');
    } else {
      console.error('[Background Fetch] Failed to fetch news:', newsResult.reason);
    }

    console.log('[Background Fetch] Background fetch completed');
  } catch (error) {
    console.error('[Background Fetch] Error during background fetch:', error);
    throw error;
  }
}

// Try to import background task modules (only available in development builds)
let BackgroundTask: typeof import('expo-background-task') | null = null;
let TaskManager: typeof import('expo-task-manager') | null = null;

try {
  BackgroundTask = require('expo-background-task');
  TaskManager = require('expo-task-manager');
  
  // Define the background task (only if modules are available)
  if (TaskManager && BackgroundTask) {
    TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
      try {
        await performBackgroundFetch();
        return BackgroundTask?.BackgroundTaskResult.Success || 1;
      } catch (error) {
        console.error('[Background Fetch] Error during background fetch:', error);
        return BackgroundTask?.BackgroundTaskResult.Failed || 2;
      }
    });
  }
} catch (error) {
  // Modules not available (e.g., in Expo Go) - this is expected
  // Silently handle - no need to log as this is normal in Expo Go
}

// Function to register the background task
export async function registerBackgroundFetchAsync(): Promise<void> {
  // Early return if running in Expo Go
  if (Constants.executionEnvironment === 'storeClient') {
    // Silently skip - this is expected in Expo Go
    return;
  }

  if (!BackgroundTask || !TaskManager) {
    // Silently skip - modules not available
    return;
  }

  try {
    // Check if background task is available
    const status = await BackgroundTask.getStatusAsync();
    if (status === BackgroundTask.BackgroundTaskStatus.Restricted) {
      // Background tasks are restricted (e.g., in Expo Go)
      return;
    }
    
    // Check if task is already registered
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    
    if (!isRegistered) {
      // Register the background task with expo-background-task
      // minimumInterval is in minutes (minimum is 15 minutes)
      await BackgroundTask.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 15, // 15 minutes
      });
      console.log('[Background Fetch] Task registered successfully');
    } else {
      console.log('[Background Fetch] Task already registered');
    }
  } catch (error: any) {
    // In Expo Go or when not configured, this will fail
    // Check for common error messages and handle gracefully
    const errorMessage = error?.message || String(error);
    if (
      errorMessage.includes('Background') ||
      errorMessage.includes('not been configured') ||
      errorMessage.includes('UIBackgroundModes') ||
      errorMessage.includes('not available') ||
      errorMessage.includes('Expo Go') ||
      errorMessage.includes('Restricted')
    ) {
      // Expected in Expo Go - don't log as error
      return;
    }
    // Only log unexpected errors
    console.error('[Background Fetch] Failed to register task:', error);
  }
}

// Function to unregister the background task
export async function unregisterBackgroundFetchAsync(): Promise<void> {
  if (!BackgroundTask || !TaskManager) {
    return;
  }

  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    
    if (isRegistered) {
      await BackgroundTask.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
      console.log('[Background Fetch] Task unregistered successfully');
    }
  } catch (error) {
    // Silently handle unregister errors
  }
}

// Check if background fetch is available
export function isBackgroundFetchAvailable(): boolean {
  // In Expo Go, modules exist but configuration isn't available
  if (Constants.executionEnvironment === 'storeClient') {
    return false;
  }
  return BackgroundTask !== null && TaskManager !== null;
}
