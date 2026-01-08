import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { ExternalLink, Calendar } from 'lucide-react-native';
import { NewsItem } from '@/types';
import {
  DBDColors,
  Spacing,
  BorderRadius,
  Typography,
  Shadows,
} from '@/constants/theme';

interface Props {
  item: NewsItem;
}

export function NewsCard({ item }: Props) {
  const openArticle = () => {
    Linking.openURL(item.url);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={openArticle}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.feedLabel}>{item.feedLabel}</Text>
        <View style={styles.dateRow}>
          <Calendar size={12} color={DBDColors.text.muted} />
          <Text style={styles.date}>{formatDate(item.date)}</Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>

      <Text style={styles.contents} numberOfLines={3}>
        {item.contents}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.readMore}>Read more</Text>
        <ExternalLink size={14} color={DBDColors.accent.secondary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: DBDColors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: DBDColors.border.subtle,
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  feedLabel: {
    ...Typography.small,
    color: DBDColors.accent.secondary,
    fontWeight: '600',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  date: {
    ...Typography.small,
    color: DBDColors.text.muted,
  },
  title: {
    ...Typography.subtitle,
    color: DBDColors.text.primary,
    marginBottom: Spacing.sm,
  },
  contents: {
    ...Typography.body,
    color: DBDColors.text.secondary,
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  readMore: {
    ...Typography.caption,
    color: DBDColors.accent.secondary,
    fontWeight: '600',
  },
});
