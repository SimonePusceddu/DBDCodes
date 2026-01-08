import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { PromoCode, ShrineData, NewsItem } from '@/types';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request notification permissions
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    // Configure notification channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('dbd-updates', {
        name: 'DBD Updates',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#DC143C',
      });
    }

    return true;
  } catch (error) {
    console.error('Failed to request notification permissions:', error);
    return false;
  }
}

// Send notification for new promo codes
export async function notifyNewPromoCodes(newCodes: PromoCode[]): Promise<void> {
  if (newCodes.length === 0) return;

  try {
    const codeCount = newCodes.length;
    const title = codeCount === 1 
      ? 'New Promo Code!' 
      : `${codeCount} New Promo Codes!`;
    
    const body = codeCount === 1
      ? `${newCodes[0].code}: ${newCodes[0].title}`
      : `${codeCount} new promo codes available`;

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { type: 'promo-codes', codes: newCodes.map(c => c.id) },
      },
      trigger: null, // Send immediately
    });
  } catch (error) {
    console.error('Failed to send promo codes notification:', error);
  }
}

// Send notification for shrine reset
export async function notifyShrineReset(shrine: ShrineData): Promise<void> {
  try {
    const perkNames = shrine.perks.slice(0, 2).map(p => p.name).join(', ');
    const body = shrine.perks.length > 2 
      ? `${perkNames} and ${shrine.perks.length - 2} more`
      : perkNames;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Shrine of Secrets Updated!',
        body: `New perks: ${body}`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { type: 'shrine', week: shrine.week },
      },
      trigger: null, // Send immediately
    });
  } catch (error) {
    console.error('Failed to send shrine notification:', error);
  }
}

// Send notification for new news
export async function notifyNewNews(newItems: NewsItem[]): Promise<void> {
  if (newItems.length === 0) return;

  try {
    const itemCount = newItems.length;
    const title = itemCount === 1
      ? 'New DBD News!'
      : `${itemCount} New DBD News Items!`;
    
    const body = itemCount === 1
      ? newItems[0].title
      : `${itemCount} new news items available`;

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { type: 'news', items: newItems.map(i => i.id) },
      },
      trigger: null, // Send immediately
    });
  } catch (error) {
    console.error('Failed to send news notification:', error);
  }
}
