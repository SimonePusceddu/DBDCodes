import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SEEN_CODES_KEY = '@dbd_codes_seen';

export function useSeenCodes() {
  const [seenCodes, setSeenCodes] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load seen codes from storage on mount
  useEffect(() => {
    loadSeenCodes();
  }, []);

  const loadSeenCodes = async () => {
    try {
      const stored = await AsyncStorage.getItem(SEEN_CODES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        setSeenCodes(new Set(parsed));
      }
    } catch (error) {
      console.error('Failed to load seen codes:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const markAsSeen = useCallback(async (codeId: string) => {
    setSeenCodes((prev) => {
      if (prev.has(codeId)) return prev;

      const updated = new Set(prev);
      updated.add(codeId);

      // Persist to storage
      AsyncStorage.setItem(SEEN_CODES_KEY, JSON.stringify([...updated])).catch(
        (error) => console.error('Failed to save seen codes:', error)
      );

      return updated;
    });
  }, []);

  const markMultipleAsSeen = useCallback(async (codeIds: string[]) => {
    setSeenCodes((prev) => {
      const updated = new Set(prev);
      let hasChanges = false;

      codeIds.forEach((id) => {
        if (!updated.has(id)) {
          updated.add(id);
          hasChanges = true;
        }
      });

      if (hasChanges) {
        AsyncStorage.setItem(SEEN_CODES_KEY, JSON.stringify([...updated])).catch(
          (error) => console.error('Failed to save seen codes:', error)
        );
      }

      return updated;
    });
  }, []);

  const isNewCode = useCallback(
    (codeId: string) => {
      return isLoaded && !seenCodes.has(codeId);
    },
    [seenCodes, isLoaded]
  );

  return {
    seenCodes,
    isLoaded,
    markAsSeen,
    markMultipleAsSeen,
    isNewCode,
  };
}
