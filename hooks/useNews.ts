import { useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppContext } from '@/context/AppContext';
import { fetchNews } from '@/services/newsApi';
import { CACHE_KEYS } from '@/tasks/backgroundFetch';
import { NewsResponse } from '@/types';

export function useNews() {
  const { state, dispatch } = useAppContext();

  const loadNews = useCallback(async (forceRefresh = false) => {
    // Try to load from cache first if not forcing refresh
    if (!forceRefresh) {
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEYS.NEWS);
        if (cached) {
          const parsed: NewsResponse = JSON.parse(cached);
          // Restore dates from strings
          parsed.lastUpdated = new Date(parsed.lastUpdated);
          parsed.items = parsed.items.map((item) => ({
            ...item,
            date: new Date(item.date),
          }));
          dispatch({ type: 'SET_NEWS', payload: parsed });
          // Still fetch fresh data in background
          fetchNews()
            .then((result) => {
              if (result) {
                dispatch({ type: 'SET_NEWS', payload: result });
                AsyncStorage.setItem(CACHE_KEYS.NEWS, JSON.stringify(result));
              }
            })
            .catch(console.error);
          return;
        }
      } catch (error) {
        console.error('Failed to load cached news:', error);
      }
    }

    // Fetch fresh data
    const result = await fetchNews();
    dispatch({ type: 'SET_NEWS', payload: result });
    
    // Cache the result
    if (result) {
      AsyncStorage.setItem(CACHE_KEYS.NEWS, JSON.stringify(result));
    }
  }, [dispatch]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  return {
    news: state.news,
    refresh: () => loadNews(true),
  };
}
