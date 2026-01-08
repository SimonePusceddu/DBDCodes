import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AppProvider } from '@/context/AppContext';
import { DBDColors } from '@/constants/theme';
// Import background task to ensure it's defined early
import '@/tasks/backgroundFetch';
import { registerBackgroundFetchAsync } from '@/tasks/backgroundFetch';

// Custom DBD Dark Theme
const DBDDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: DBDColors.accent.secondary,
    background: DBDColors.background.primary,
    card: DBDColors.background.secondary,
    text: DBDColors.text.primary,
    border: DBDColors.border.subtle,
    notification: DBDColors.accent.primary,
  },
};

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  useEffect(() => {
    // Register background fetch task on app startup
    registerBackgroundFetchAsync().catch(console.error);
  }, []);

  return (
    <AppProvider>
      <ThemeProvider value={DBDDarkTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: 'modal', title: 'Modal' }}
          />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </AppProvider>
  );
}
