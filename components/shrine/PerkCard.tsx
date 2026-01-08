import React from 'react';
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

interface Props {
  perk: ShrinePerk;
}

export function PerkCard({ perk }: Props) {
  const isKiller = perk.type === 'killer';
  const IconComponent = isKiller ? Skull : Heart;
  const accentColor = isKiller
    ? DBDColors.shrine.killer
    : DBDColors.shrine.survivor;

  return (
    <View style={[styles.card, { borderColor: accentColor }]}>
      <View style={[styles.iconContainer, { backgroundColor: accentColor + '20' }]}>
        <IconComponent size={32} color={accentColor} />
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
