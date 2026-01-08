import { Tabs } from 'expo-router';
import React from 'react';
import { Home, Store, Newspaper, Info } from 'lucide-react-native';

import { HapticTab } from '@/components/haptic-tab';
import { DBDColors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: DBDColors.accent.secondary,
        tabBarInactiveTintColor: DBDColors.text.muted,
        tabBarStyle: {
          backgroundColor: DBDColors.background.secondary,
          borderTopColor: DBDColors.border.subtle,
          borderTopWidth: 1,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Codes',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="shrine"
        options={{
          title: 'Shrine',
          tabBarIcon: ({ color, size }) => <Store size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: 'News',
          tabBarIcon: ({ color, size }) => <Newspaper size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'About',
          tabBarIcon: ({ color, size }) => <Info size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
