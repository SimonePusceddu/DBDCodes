import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { Skull, Heart } from 'lucide-react-native';
import { ShrinePerk } from '@/types';
import {
  DBDColors,
  Spacing,
  BorderRadius,
  Typography,
  Shadows,
} from '@/constants/theme';

const CARD_WIDTH = (Dimensions.get('window').width - Spacing.lg * 3) / 2;

// Try different possible CDN URLs (including bunny.net CDN)
const CDN_URLS = [
  'https://nightlight.gg',
  'https://nightlight.gg/assets',
  'https://cdn.nightlight.gg',
  'https://assets.nightlight.gg',
  'https://nightlight.b-cdn.net',
  'https://nightlight-gg.b-cdn.net',
];

interface Props {
  perk: ShrinePerk;
}

export function PerkCard({ perk }: Props) {
  const [imageError, setImageError] = useState(false);
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const isKiller = perk.type === 'killer';
  const IconComponent = isKiller ? Skull : Heart;
  const accentColor = isKiller
    ? DBDColors.shrine.killer
    : DBDColors.shrine.survivor;

  const imageUrl = perk.image ? `${CDN_URLS[currentUrlIndex]}/${perk.image}` : null;

  const handleImageError = () => {
    // Try next CDN URL
    if (currentUrlIndex < CDN_URLS.length - 1) {
      setCurrentUrlIndex(currentUrlIndex + 1);
      setImageError(false);
    } else {
      setImageError(true);
    }
  };

  return (
    <View style={[styles.card, { borderColor: accentColor }]}>
      <View style={[styles.iconContainer, { backgroundColor: accentColor + '20' }]}>
        {imageUrl && !imageError ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.perkImage}
            onError={handleImageError}
            resizeMode="contain"
          />
        ) : (
          <IconComponent size={32} color={accentColor} />
        )}
      </View>

      <Text style={styles.perkName} numberOfLines={2}>
        {perk.name}
      </Text>

      {perk.characterName ? (
        <Text style={styles.characterName} numberOfLines={1}>
          {perk.characterName}
        </Text>
      ) : null}

      <View style={styles.costRow}>
        <View style={styles.shardIcon} />
        <Text style={styles.cost}>{perk.shards.toLocaleString()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: DBDColors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 2,
    alignItems: 'center',
    ...Shadows.card,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  perkImage: {
    width: 64,
    height: 64,
  },
  perkName: {
    ...Typography.body,
    color: DBDColors.text.primary,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: Spacing.xs,
    minHeight: 40,
  },
  characterName: {
    ...Typography.caption,
    color: DBDColors.text.muted,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  shardIcon: {
    width: 16,
    height: 16,
    backgroundColor: DBDColors.shrine.shards,
    borderRadius: BorderRadius.full,
  },
  cost: {
    ...Typography.caption,
    color: DBDColors.shrine.shards,
    fontWeight: 'bold',
  },
});
