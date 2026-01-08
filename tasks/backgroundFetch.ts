import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { fetchPromoCodes } from '@/services/promoCodeScraper';
import { fetchShrineOfSecrets } from '@/services/shrineApi';
import { fetchNews } from '@/services/newsApi';

// Cache keys for storing fetched data
export const CACHE_KEYS = {
  PROMO_CODES: '@dbd_codes_cache',
  SHRINE: '@dbd_shrine_cache',
  NEWS: '@dbd_news_cache',
} as const;

const BACKGROUND_FETCH_TASK = 'background-fetch-dbdcodes';

// Background fetch function (can be called manually or by background task)
export async function performBackgroundFetch(): Promise<void> {
  try {
    console.log('[Background Fetch] Starting background data fetch...');

    // Fetch all data in parallel
    const [promoCodesResult, shrineResult, newsResult] = await Promise.allSettled([
      fetchPromoCodes(),
      fetchShrineOfSecrets(),
      fetchNews(),
    ]);

    // Store successful fetches in AsyncStorage
    if (promoCodesResult.status === 'fulfilled') {
      await AsyncStorage.setItem(
        CACHE_KEYS.PROMO_CODES,
        JSON.stringify(promoCodesResult.value)
      );
      console.log('[Background Fetch] Promo codes updated');
    } else {
      console.error('[Background Fetch] Failed to fetch promo codes:', promoCodesResult.reason);
    }

    if (shrineResult.status === 'fulfilled' && shrineResult.value) {
      await AsyncStorage.setItem(
        CACHE_KEYS.SHRINE,
        JSON.stringify(shrineResult.value)
      );
      console.log('[Background Fetch] Shrine data updated');
    } else {
      console.error('[Background Fetch] Failed to fetch shrine:', shrineResult.reason);
    }

    if (newsResult.status === 'fulfilled' && newsResult.value) {
      await AsyncStorage.setItem(
        CACHE_KEYS.NEWS,
        JSON.stringify(newsResult.value)
      );
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
