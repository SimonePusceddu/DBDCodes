import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { requestNotificationPermissions } from '@/services/notifications';

const NOTIFICATION_SETTINGS_KEY = '@dbd_notification_settings';

export interface NotificationSettings {
  promoCodes: boolean;
  shrine: boolean;
  news: boolean;
}

const defaultSettings: NotificationSettings = {
  promoCodes: false,
  shrine: false,
  news: false,
};

export function useNotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  // Load settings and check permissions on mount
  useEffect(() => {
    loadSettings();
    checkPermissions();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as NotificationSettings;
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load notification settings:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const checkPermissions = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setHasPermission(status === 'granted');
    } catch (error) {
      console.error('Failed to check notification permissions:', error);
    }
  };

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      const granted = await requestNotificationPermissions();
      if (granted) {
        const { status } = await Notifications.getPermissionsAsync();
        setHasPermission(status === 'granted');
      }
      return granted;
    } catch (error) {
      console.error('Failed to request permissions:', error);
      return false;
    }
  }, []);

  const updateSetting = useCallback(
    async (key: keyof NotificationSettings, value: boolean) => {
      // If enabling notifications, request permission first
      if (value && !hasPermission) {
        const granted = await requestPermissions();
        if (!granted) {
          return false; // Permission denied, don't update setting
        }
      }

      const updated = { ...settings, [key]: value };
      setSettings(updated);

      try {
        await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save notification settings:', error);
        return false;
      }

      return true;
    },
    [settings, hasPermission, requestPermissions]
  );

  const getSetting = useCallback(
    (key: keyof NotificationSettings): boolean => {
      return settings[key];
    },
    [settings]
  );

  return {
    settings,
    isLoaded,
    hasPermission,
    updateSetting,
    getSetting,
    requestPermissions,
  };
}
