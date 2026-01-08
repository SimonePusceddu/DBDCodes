import { useCallback, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { fetchPromoCodes } from '@/services/promoCodeScraper';

export function usePromoCodes() {
  const { state, dispatch } = useAppContext();

  const loadCodes = useCallback(
    async (isRefresh = false) => {
      dispatch({
        type: isRefresh ? 'SET_REFRESHING' : 'SET_LOADING',
        payload: true,
      });

      const result = await fetchPromoCodes();
      dispatch({ type: 'SET_PROMO_CODES', payload: result });

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
