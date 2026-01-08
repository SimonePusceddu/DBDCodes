import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
  Linking,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { X, ExternalLink, Skull, Heart, TrendingUp, TrendingDown } from 'lucide-react-native';
import { ShrinePerk } from '@/types';
import {
  DBDColors,
  Spacing,
  BorderRadius,
  Typography,
  Shadows,
} from '@/constants/theme';
import { getPerkWikiUrl } from '@/utils/wiki';

interface Props {
  perk: ShrinePerk | null;
  onClose: () => void;
}

export function PerkDetailModal({ perk, onClose }: Props) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [perk?.id]);

  if (!perk) return null;

  const isKiller = perk.type === 'killer';
  const IconComponent = isKiller ? Skull : Heart;
  const accentColor = isKiller
    ? DBDColors.shrine.killer
    : DBDColors.shrine.survivor;

  const openWiki = () => {
    Linking.openURL(getPerkWikiUrl(perk.name));
  };

  const showImage = perk.image && !imageError;

  return (
    <Modal
      visible={!!perk}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.modal, { borderColor: accentColor }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={DBDColors.text.muted} />
          </TouchableOpacity>

          <View style={[styles.iconContainer, { backgroundColor: accentColor + '20' }]}>
            {showImage ? (
              <ExpoImage
                source={{ uri: perk.image }}
                style={styles.perkImage}
                contentFit="contain"
                transition={200}
                onError={() => setImageError(true)}
              />
            ) : (
              <IconComponent size={48} color={accentColor} />
            )}
          </View>

          <Text style={styles.perkName}>{perk.name}</Text>

          {perk.characterName ? (
            <View style={styles.characterRow}>
              <IconComponent size={16} color={accentColor} />
              <Text style={[styles.characterName, { color: accentColor }]}>
                {perk.characterName}
              </Text>
            </View>
          ) : null}

          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <Image
                source={require('@/assets/images/iridescent-shards.png')}
                style={styles.shardIcon}
                resizeMode="contain"
              />
              <Text style={styles.statLabel}>Shards:</Text>
              <Text style={[styles.statValue, { color: DBDColors.shrine.shards }]}>
                {perk.shards.toLocaleString()}
              </Text>
            </View>

            {perk.usageTier ? (
              <View style={styles.statRow}>
                {perk.usageTier === 'high' ? (
                  <TrendingUp size={18} color={DBDColors.status.success} />
                ) : (
                  <TrendingDown size={18} color={DBDColors.status.warning} />
                )}
                <Text style={styles.statLabel}>Usage Tier:</Text>
                <Text
                  style={[
                    styles.statValue,
                    {
                      color:
                        perk.usageTier === 'high'
                          ? DBDColors.status.success
                          : DBDColors.status.warning,
                    },
                  ]}
                >
                  {perk.usageTier.charAt(0).toUpperCase() + perk.usageTier.slice(1)}
                </Text>
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            style={[styles.wikiButton, { borderColor: accentColor }]}
            onPress={openWiki}
          >
            <Text style={styles.wikiButtonText}>View on Wiki</Text>
            <ExternalLink size={16} color={DBDColors.text.primary} />
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modal: {
    backgroundColor: DBDColors.background.secondary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    borderWidth: 2,
    ...Shadows.elevated,
  },
  closeButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    padding: Spacing.xs,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  perkImage: {
    width: 80,
    height: 80,
  },
  perkName: {
    ...Typography.title,
    color: DBDColors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  characterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  characterName: {
    ...Typography.body,
    fontWeight: '500',
  },
  statsContainer: {
    width: '100%',
    backgroundColor: DBDColors.background.tertiary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  shardIcon: {
    width: 18,
    height: 18,
  },
  statLabel: {
    ...Typography.body,
    color: DBDColors.text.secondary,
    flex: 1,
  },
  statValue: {
    ...Typography.body,
    fontWeight: 'bold',
  },
  wikiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: DBDColors.background.tertiary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    width: '100%',
  },
  wikiButtonText: {
    ...Typography.body,
    color: DBDColors.text.primary,
    fontWeight: '600',
  },
});
