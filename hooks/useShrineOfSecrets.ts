import { useCallback, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { fetchShrineOfSecrets } from '@/services/shrineApi';

export function useShrineOfSecrets() {
  const { state, dispatch } = useAppContext();

  const loadShrine = useCallback(async () => {
    const result = await fetchShrineOfSecrets();
    dispatch({ type: 'SET_SHRINE', payload: result });
  }, [dispatch]);

  useEffect(() => {
    loadShrine();
  }, [loadShrine]);

  return {
    shrine: state.shrine,
    refresh: loadShrine,
  };
}
