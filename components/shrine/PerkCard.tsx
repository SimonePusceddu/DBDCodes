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

// Try different possible CDN URLs (prioritize most likely to work)
const CDN_URLS = [
  'https://cdn.nightlight.gg',
  'https://nightlight.gg',
  'https://assets.nightlight.gg',
  'https://nightlight-gg.b-cdn.net',
];

interface Props {
  perk: ShrinePerk;
}

function buildImageUrl(baseUrl: string, imagePath: string): string {
  // Remove leading slash from image path if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  // If base URL ends with a path segment, ensure proper joining
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  return `${base}/${cleanPath}`;
}

export function PerkCard({ perk }: Props) {
  const [imageError, setImageError] = useState(false);
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const isKiller = perk.type === 'killer';
  const IconComponent = isKiller ? Skull : Heart;
  const accentColor = isKiller
    ? DBDColors.shrine.killer
    : DBDColors.shrine.survivor;

  const imageUrl = perk.image
    ? buildImageUrl(CDN_URLS[currentUrlIndex], perk.image)
    : null;

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
        <Image
          source={require('@/assets/images/iridescent-shards.png')}
          style={styles.shardIcon}
          resizeMode="contain"
        />
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
  },
  cost: {
    ...Typography.caption,
    color: DBDColors.shrine.shards,
    fontWeight: 'bold',
  },
});
