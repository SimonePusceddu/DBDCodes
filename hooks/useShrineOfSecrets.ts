import { useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppContext } from '@/context/AppContext';
import { fetchShrineOfSecrets } from '@/services/shrineApi';
import { CACHE_KEYS } from '@/tasks/backgroundFetch';
import { ShrineData } from '@/types';

export function useShrineOfSecrets() {
  const { state, dispatch } = useAppContext();

  const loadShrine = useCallback(async (forceRefresh = false) => {
    // Try to load from cache first if not forcing refresh
    if (!forceRefresh) {
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEYS.SHRINE);
        if (cached) {
          const parsed: ShrineData = JSON.parse(cached);
          // Restore dates from strings
          parsed.startTime = new Date(parsed.startTime);
          parsed.endTime = new Date(parsed.endTime);
          parsed.lastUpdated = new Date(parsed.lastUpdated);
          dispatch({ type: 'SET_SHRINE', payload: parsed });
          // Still fetch fresh data in background
          fetchShrineOfSecrets()
            .then((result) => {
              if (result) {
                dispatch({ type: 'SET_SHRINE', payload: result });
                AsyncStorage.setItem(CACHE_KEYS.SHRINE, JSON.stringify(result));
              }
            })
            .catch(console.error);
          return;
        }
      } catch (error) {
        console.error('Failed to load cached shrine data:', error);
      }
    }

    // Fetch fresh data
    const result = await fetchShrineOfSecrets();
    dispatch({ type: 'SET_SHRINE', payload: result });
    
    // Cache the result
    if (result) {
      AsyncStorage.setItem(CACHE_KEYS.SHRINE, JSON.stringify(result));
    }
  }, [dispatch]);

  useEffect(() => {
    loadShrine();
  }, [loadShrine]);

  return {
    shrine: state.shrine,
    refresh: () => loadShrine(true),
  };
}
