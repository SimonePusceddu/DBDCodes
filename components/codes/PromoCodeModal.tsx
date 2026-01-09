import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { X, Copy } from 'lucide-react-native';
import { PromoCode } from '@/types';
import {
  DBDColors,
  Spacing,
  BorderRadius,
  Typography,
  Shadows,
} from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CODE_DISPLAY_WIDTH = SCREEN_WIDTH - Spacing.xl * 2;

interface Props {
  visible: boolean;
  code: PromoCode | null;
  onClose: () => void;
}

export function PromoCodeModal({ visible, code, onClose }: Props) {
  const { dispatch } = useAppContext();
  const scrollAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && code) {
      // Reset animation when modal opens
      scrollAnim.setValue(0);

      // Measure if code is too long and needs scrolling
      // Rough estimate: if code length > 15 characters, enable auto-scroll
      if (code.code.length > 15) {
        // Start auto-scroll animation after a short delay
        const timer = setTimeout(() => {
          Animated.loop(
            Animated.sequence([
              Animated.timing(scrollAnim, {
                toValue: -100,
                duration: 2000,
                useNativeDriver: true,
              }),
              Animated.delay(1000),
              Animated.timing(scrollAnim, {
                toValue: 0,
                duration: 2000,
                useNativeDriver: true,
              }),
              Animated.delay(1000),
            ])
          ).start();
        }, 500);

        return () => clearTimeout(timer);
      }
    }
  }, [visible, code, scrollAnim]);

  const handleCopy = async () => {
    if (code) {
      await Clipboard.setStringAsync(code.code);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      dispatch({ type: 'SHOW_TOAST', payload: `Copied: ${code.code}` });
      setTimeout(() => {
        dispatch({ type: 'HIDE_TOAST' });
      }, 2000);
      onClose();
    }
  };

  if (!code) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={3}>
              {code.title}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <X size={24} color={DBDColors.text.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.codeSection}>
            <Text style={styles.codeLabel}>PROMO CODE</Text>
            <View style={styles.codeWrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                <Animated.View
                  style={[
                    styles.codeContainer,
                    { transform: [{ translateX: scrollAnim }] },
                  ]}
                >
                  <Text style={styles.codeText}>{code.code}</Text>
                </Animated.View>
              </ScrollView>
            </View>

            {code.description && (
              <Text style={styles.description}>{code.description}</Text>
            )}

            {code.daysLeft !== null && !code.isExpired && (
              <Text style={styles.expiration}>
                Expires in {code.daysLeft} day{code.daysLeft !== 1 ? 's' : ''}
              </Text>
            )}

            {code.isExpired && (
              <Text style={[styles.expiration, styles.expired]}>
                This code has expired
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.copyButton, code.isExpired && styles.disabledButton]}
            onPress={handleCopy}
            activeOpacity={0.7}
          >
            <Copy size={18} color={DBDColors.text.primary} />
            <Text style={styles.copyButtonText}>COPY CODE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>CLOSE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: DBDColors.background.secondary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 400,
    ...Shadows.modal,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.heading,
    color: DBDColors.text.primary,
    flex: 1,
    marginRight: Spacing.md,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  codeSection: {
    marginBottom: Spacing.xl,
  },
  codeLabel: {
    ...Typography.small,
    color: DBDColors.text.muted,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  codeWrapper: {
    backgroundColor: DBDColors.background.tertiary,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: DBDColors.accent.primary,
    overflow: 'hidden',
  },
  scrollContent: {
    flexGrow: 1,
  },
  codeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeText: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: DBDColors.accent.secondary,
    textAlign: 'center',
  },
  description: {
    ...Typography.body,
    color: DBDColors.text.secondary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  expiration: {
    ...Typography.caption,
    color: DBDColors.status.warning,
    textAlign: 'center',
    fontWeight: '600',
  },
  expired: {
    color: DBDColors.status.error,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DBDColors.accent.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  disabledButton: {
    backgroundColor: DBDColors.text.muted,
    opacity: 0.5,
  },
  copyButtonText: {
    ...Typography.body,
    color: DBDColors.text.primary,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  cancelButtonText: {
    ...Typography.body,
    color: DBDColors.text.muted,
    fontWeight: '600',
  },
});
