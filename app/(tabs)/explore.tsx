import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { Globe, ExternalLink, BellOff, Gift, Store, Newspaper } from 'lucide-react-native';
import {
  DBDColors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';

export default function AboutScreen() {
  const { settings, isLoaded, hasPermission, updateSetting, requestPermissions } = useNotificationSettings();

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  const handleToggle = async (key: 'promoCodes' | 'shrine' | 'news', value: boolean) => {
    if (value && !hasPermission) {
      const granted = await requestPermissions();
      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to receive updates.',
          [{ text: 'OK' }]
        );
        return;
      }
    }

    const success = await updateSetting(key, value);
    if (!success && value) {
      Alert.alert('Error', 'Failed to enable notifications. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>About</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>DBD Codes</Text>
          <Text style={styles.cardDescription}>
            Your companion app for Dead by Daylight promo codes and Shrine of
            Secrets tracking.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <Text style={styles.sectionDescription}>
            Receive alerts when new codes, shrine updates, or news are available
          </Text>

          {!hasPermission && (
            <View style={styles.permissionWarning}>
              <BellOff size={16} color={DBDColors.status.warning} />
              <Text style={styles.permissionWarningText}>
                Notification permission is required
              </Text>
            </View>
          )}

          {isLoaded && (
            <>
              <View style={styles.notificationRow}>
                <View style={styles.notificationLeft}>
                  <Gift size={20} color={DBDColors.accent.secondary} />
                  <View style={styles.notificationTextContainer}>
                    <Text style={styles.notificationTitle}>Promo Codes</Text>
                    <Text style={styles.notificationSubtitle}>
                      New promo codes
                    </Text>
                  </View>
                </View>
                <Switch
                  value={settings.promoCodes}
                  onValueChange={(value) => handleToggle('promoCodes', value)}
                  trackColor={{
                    false: DBDColors.border.subtle,
                    true: DBDColors.accent.secondary + '80',
                  }}
                  thumbColor={
                    settings.promoCodes
                      ? DBDColors.accent.secondary
                      : DBDColors.text.muted
                  }
                />
              </View>

              <View style={styles.notificationRow}>
                <View style={styles.notificationLeft}>
                  <Store size={20} color={DBDColors.accent.secondary} />
                  <View style={styles.notificationTextContainer}>
                    <Text style={styles.notificationTitle}>Shrine of Secrets</Text>
                    <Text style={styles.notificationSubtitle}>
                      Weekly shrine reset
                    </Text>
                  </View>
                </View>
                <Switch
                  value={settings.shrine}
                  onValueChange={(value) => handleToggle('shrine', value)}
                  trackColor={{
                    false: DBDColors.border.subtle,
                    true: DBDColors.accent.secondary + '80',
                  }}
                  thumbColor={
                    settings.shrine
                      ? DBDColors.accent.secondary
                      : DBDColors.text.muted
                  }
                />
              </View>

              <View style={styles.notificationRow}>
                <View style={styles.notificationLeft}>
                  <Newspaper size={20} color={DBDColors.accent.secondary} />
                  <View style={styles.notificationTextContainer}>
                    <Text style={styles.notificationTitle}>News</Text>
                    <Text style={styles.notificationSubtitle}>
                      New Dead by Daylight news
                    </Text>
                  </View>
                </View>
                <Switch
                  value={settings.news}
                  onValueChange={(value) => handleToggle('news', value)}
                  trackColor={{
                    false: DBDColors.border.subtle,
                    true: DBDColors.accent.secondary + '80',
                  }}
                  thumbColor={
                    settings.news
                      ? DBDColors.accent.secondary
                      : DBDColors.text.muted
                  }
                />
              </View>
            </>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Data Sources</Text>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => openLink('https://dbdcoupons.com/')}
          >
            <Globe size={20} color={DBDColors.text.primary} />
            <Text style={styles.linkText}>dbdcoupons.com</Text>
            <ExternalLink size={16} color={DBDColors.text.muted} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => openLink('https://nightlight.gg/')}
          >
            <Globe size={20} color={DBDColors.text.primary} />
            <Text style={styles.linkText}>NightLight.gg API</Text>
            <ExternalLink size={16} color={DBDColors.text.muted} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Not affiliated with Behaviour Interactive
          </Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DBDColors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.header,
    color: DBDColors.text.primary,
  },
  card: {
    backgroundColor: DBDColors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  cardTitle: {
    ...Typography.title,
    color: DBDColors.accent.secondary,
    marginBottom: Spacing.sm,
  },
  cardDescription: {
    ...Typography.body,
    color: DBDColors.text.secondary,
    lineHeight: 24,
  },
  sectionTitle: {
    ...Typography.subtitle,
    color: DBDColors.text.primary,
    marginBottom: Spacing.md,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DBDColors.background.tertiary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  linkText: {
    ...Typography.body,
    color: DBDColors.text.primary,
    flex: 1,
  },
  footer: {
    marginTop: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  footerText: {
    ...Typography.caption,
    color: DBDColors.text.muted,
  },
  version: {
    ...Typography.small,
    color: DBDColors.text.muted,
  },
  sectionDescription: {
    ...Typography.body,
    color: DBDColors.text.secondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  permissionWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DBDColors.status.warning + '20',
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  permissionWarningText: {
    ...Typography.small,
    color: DBDColors.status.warning,
    flex: 1,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: DBDColors.border.subtle,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.md,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    ...Typography.body,
    color: DBDColors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs / 2,
  },
  notificationSubtitle: {
    ...Typography.small,
    color: DBDColors.text.muted,
  },
});
