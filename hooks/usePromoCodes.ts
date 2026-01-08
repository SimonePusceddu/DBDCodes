import { useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppContext } from '@/context/AppContext';
import { fetchPromoCodes } from '@/services/promoCodeScraper';
import { CACHE_KEYS } from '@/tasks/backgroundFetch';
import { PromoCodesResponse } from '@/types';

export function usePromoCodes() {
  const { state, dispatch } = useAppContext();

  const loadCodes = useCallback(
    async (isRefresh = false) => {
      dispatch({
        type: isRefresh ? 'SET_REFRESHING' : 'SET_LOADING',
        payload: true,
      });

      // If not refreshing, try to load from cache first
      if (!isRefresh) {
        try {
          const cached = await AsyncStorage.getItem(CACHE_KEYS.PROMO_CODES);
          if (cached) {
            const parsed: PromoCodesResponse = JSON.parse(cached);
            // Restore dates from strings
            parsed.lastUpdated = new Date(parsed.lastUpdated);
            dispatch({ type: 'SET_PROMO_CODES', payload: parsed });
            dispatch({ type: 'SET_LOADING', payload: false });
            // Still fetch fresh data in background
            fetchPromoCodes()
              .then((result) => {
                dispatch({ type: 'SET_PROMO_CODES', payload: result });
                AsyncStorage.setItem(CACHE_KEYS.PROMO_CODES, JSON.stringify(result));
              })
              .catch(console.error);
            return;
          }
        } catch (error) {
          console.error('Failed to load cached promo codes:', error);
        }
      }

      // Fetch fresh data
      const result = await fetchPromoCodes();
      dispatch({ type: 'SET_PROMO_CODES', payload: result });

      // Cache the result
      AsyncStorage.setItem(CACHE_KEYS.PROMO_CODES, JSON.stringify(result));

      if (result.error) {
        dispatch({ type: 'SET_ERROR', payload: result.error });
      }

      dispatch({
        type: isRefresh ? 'SET_REFRESHING' : 'SET_LOADING',
        payload: false,
      });
    },
    [dispatch]
  );

  useEffect(() => {
    loadCodes();
  }, [loadCodes]);

  return {
    codes: state.promoCodes?.codes ?? [],
    isLoading: state.isLoading,
    isRefreshing: state.isRefreshing,
    error: state.error,
    refresh: () => loadCodes(true),
  };
}
