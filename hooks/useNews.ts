import { useCallback, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { fetchNews } from '@/services/newsApi';

export function useNews() {
  const { state, dispatch } = useAppContext();

  const loadNews = useCallback(async () => {
    const result = await fetchNews();
    dispatch({ type: 'SET_NEWS', payload: result });
  }, [dispatch]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  return {
    news: state.news,
    refresh: loadNews,
  };
}
