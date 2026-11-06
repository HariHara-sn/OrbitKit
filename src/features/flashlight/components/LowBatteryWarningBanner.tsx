import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '@/core/theme';
import {
  BATTERY_CUTOFF,
  BATTERY_DIM,
  BATTERY_WARN,
  DIM_BRIGHTNESS,
} from '@/core/constants';
import { useHaptic } from '../hooks/useHaptic';
import { useSound } from '../hooks/useSound';

export interface LowBatteryWarningBannerProps {
  visible: boolean;
  batteryLevel: number;
  isCharging?: boolean;
  onOpenSettings?: () => void;
  onDismiss?: () => void;
}

export const LowBatteryWarningBanner: React.FC<LowBatteryWarningBannerProps> = ({
  visible,
  batteryLevel,
  isCharging = false,
  onOpenSettings,
  onDismiss,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalRendered, setModalRendered] = useState(false);
  const hasAutoPromptedRef = useRef(false);

  const bannerFade = useRef(new Animated.Value(0)).current;
  const bannerTranslate = useRef(new Animated.Value(-12)).current;

  const modalFade = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.85)).current;

  const { trigger: haptic } = useHaptic();
  const { playClick } = useSound();

  const pct = Math.round(batteryLevel * 100);
  const isCutoff = batteryLevel <= BATTERY_CUTOFF && !isCharging;
  const isDimmed = batteryLevel <= BATTERY_DIM && !isCharging;

  // Auto-prompt modal once when low battery triggers or critical cutoff hits
  useEffect(() => {
    if (visible && !hasAutoPromptedRef.current) {
      hasAutoPromptedRef.current = true;
      setModalVisible(true);
    } else if (!visible) {
      hasAutoPromptedRef.current = false;
      setModalVisible(false);
    }
  }, [visible]);

  // If critical cutoff hits, re-prompt modal
  useEffect(() => {
    if (visible && isCutoff) {
      setModalVisible(true);
    }
  }, [visible, isCutoff]);

  // Top banner animation
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(bannerFade, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(bannerTranslate, {
          toValue: 0,
          friction: 8,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(bannerFade, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.timing(bannerTranslate, {
          toValue: -12,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, bannerFade, bannerTranslate]);

  // Modal animation
  useEffect(() => {
    if (modalVisible) {
      setModalRendered(true);
      Animated.parallel([
        Animated.timing(modalFade, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(modalScale, {
          toValue: 1,
          friction: 7,
          tension: 70,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (modalRendered) {
      Animated.parallel([
        Animated.timing(modalFade, {
          toValue: 0,
          duration: 160,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(modalScale, {
          toValue: 0.88,
          duration: 160,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setModalRendered(false);
      });
    }
  }, [modalVisible, modalRendered, modalFade, modalScale]);

  const handleOpenModal = () => {
    haptic();
    playClick();
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    haptic();
    playClick();
    setModalVisible(false);
    onDismiss?.();
  };

  const handleGoToSettings = () => {
    handleCloseModal();
    onOpenSettings?.();
  };

  if (!visible) {
    return null;
  }

  const getTitle = () => {
    if (isCutoff) {
      return `Critical Battery (${pct}%)`;
    }
    if (isDimmed) {
      return `Battery Very Low (${pct}%)`;
    }
    return `Low Battery Warning (${pct}%)`;
  };

  const getDescription = () => {
    if (isCutoff) {
      return `Battery dropped to ${pct}%. Flashlight has been turned off automatically to protect the battery.`;
    }
    if (isDimmed) {
      return `Battery dropped to ${pct}%. Flashlight brightness has been dimmed to ${Math.round(DIM_BRIGHTNESS * 100)}% to preserve charge.`;
    }
    return `Battery dropped below ${Math.round(BATTERY_WARN * 100)}%. Power Control will automatically dim the flashlight at ${Math.round(BATTERY_DIM * 100)}% and shut it off at ${Math.round(BATTERY_CUTOFF * 100)}% to protect your phone.`;
  };

  const iconName = isCutoff
    ? 'battery-dead'
    : isDimmed
    ? 'battery-dead-outline'
    : 'battery-half-outline';

  return (
    <>
      {/* Sleek Floating Top Banner Pill */}
      <Animated.View
        style={[
          styles.bannerWrapper,
          {
            opacity: bannerFade,
            transform: [{ translateY: bannerTranslate }],
          },
        ]}
        testID="low-battery-banner"
      >
        <Pressable
          onPress={handleOpenModal}
          style={({ pressed }) => [
            styles.bannerCard,
            pressed && styles.bannerPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Low battery warning ${pct} percent. Tap to view details.`}
        >
          <View style={styles.bannerIconGlow}>
            <Icon name={iconName} size={18} color={colors.yellow} />
          </View>
          <View style={styles.bannerTextCol}>
            <Text allowFontScaling={false} style={styles.bannerTitle}>
              Low Battery ({pct}%)
            </Text>
            <Text allowFontScaling={false} style={styles.bannerSubtitle}>
              {isCutoff
                ? `Auto-off at ${Math.round(BATTERY_CUTOFF * 100)}%`
                : isDimmed
                ? `Dimmed to ${Math.round(DIM_BRIGHTNESS * 100)}%`
                : 'Power Control active • Tap for info'}
            </Text>
          </View>
          <Icon name="chevron-forward" size={16} color={colors.yellowDark} />
        </Pressable>
      </Animated.View>

      {/* High-Impact Alert Modal (UI/UX styled like ExitAppModal) */}
      {modalRendered && (
        <Modal
          transparent
          visible={modalRendered}
          animationType="none"
          statusBarTranslucent
          onRequestClose={handleCloseModal}
          accessibilityRole="alert"
          testID="low-battery-modal"
        >
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalBackdrop, { opacity: modalFade }]}>
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={handleCloseModal}
                accessibilityRole="button"
                accessibilityLabel="Close battery dialog"
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.modalCard,
                {
                  opacity: modalFade,
                  transform: [{ scale: modalScale }],
                },
              ]}
            >
              {/* Glowing Icon Ring */}
              <View style={styles.iconGlowRing}>
                <View style={styles.iconBadge}>
                  <Icon name={iconName} size={30} color={colors.yellow} />
                </View>
              </View>

              {/* Title & Description */}
              <Text
                allowFontScaling={false}
                style={styles.modalTitle}
                testID="low-battery-title"
              >
                {getTitle()}
              </Text>
              <Text
                allowFontScaling={false}
                style={styles.modalDescription}
                testID="low-battery-description"
              >
                {getDescription()}
              </Text>

              {/* Action Buttons */}
              <View style={styles.modalActionsRow}>
                <Pressable
                  onPress={handleCloseModal}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    pressed && styles.buttonPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Acknowledge and dismiss"
                  testID="low-battery-dismiss"
                >
                  <Text allowFontScaling={false} style={styles.primaryButtonText}>
                    Got it
                  </Text>
                </Pressable>

                {onOpenSettings && (
                  <Pressable
                    onPress={handleGoToSettings}
                    style={({ pressed }) => [
                      styles.secondaryButton,
                      pressed && styles.buttonPressed,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Open settings"
                    testID="low-battery-settings-button"
                  >
                    <Icon name="settings-outline" size={16} color={colors.yellow} />
                    <Text allowFontScaling={false} style={styles.secondaryButtonText}>
                      Settings
                    </Text>
                  </Pressable>
                )}
              </View>
            </Animated.View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  /* Floating Banner Pill */
  bannerWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    width: '100%',
    zIndex: 10,
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.yellowDark,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  bannerPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  bannerIconGlow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.yellow15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.yellowDark,
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.2,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },

  /* Modal UI / UX (Matching ExitAppModal) */
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(7, 15, 29, 0.78)',
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.card,
    borderRadius: 24,
    paddingTop: 26,
    paddingBottom: 22,
    paddingHorizontal: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 14,
  },
  iconGlowRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.yellow15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.cardDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.yellowDark,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 6,
  },
  modalActionsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textOnYellow,
  },
  secondaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.cardDark,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textLight,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
