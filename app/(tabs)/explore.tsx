import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { Github, Globe, Heart, ExternalLink } from 'lucide-react-native';
import {
  DBDColors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from '@/constants/theme';

export default function AboutScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url);
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
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Heart size={18} color={DBDColors.accent.secondary} />
              <Text style={styles.featureText}>
                Live promo codes from dbdcoupons.com
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Heart size={18} color={DBDColors.accent.secondary} />
              <Text style={styles.featureText}>
                Shrine of Secrets with weekly countdown
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Heart size={18} color={DBDColors.accent.secondary} />
              <Text style={styles.featureText}>
                One-tap copy with haptic feedback
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Heart size={18} color={DBDColors.accent.secondary} />
              <Text style={styles.featureText}>Pull-to-refresh updates</Text>
            </View>
          </View>
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
  featureList: {
    gap: Spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  featureText: {
    ...Typography.body,
    color: DBDColors.text.secondary,
    flex: 1,
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
});
