import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '@/core/theme';
import { useHaptic } from '../hooks/useHaptic';
import { useSound } from '../hooks/useSound';

export interface ExitAppModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirmExit?: () => void;
}

export const ExitAppModal: React.FC<ExitAppModalProps> = ({
  visible,
  onCancel,
  onConfirmExit,
}) => {
  const [modalRendered, setModalRendered] = useState(visible);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const { trigger: haptic } = useHaptic();
  const { playClick } = useSound();

  useEffect(() => {
    if (visible) {
      setModalRendered(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 70,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (modalRendered) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 160,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.88,
          duration: 160,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setModalRendered(false);
      });
    }
  }, [visible, fadeAnim, scaleAnim, modalRendered]);

  const handleCancel = () => {
    haptic();
    playClick();
    onCancel();
  };

  const handleExit = () => {
    haptic();
    playClick();
    if (onConfirmExit) {
      onConfirmExit();
    } else {
      BackHandler.exitApp();
    }
  };

  if (!modalRendered) {
    return null;
  }

  return (
    <Modal
      transparent
      visible={modalRendered}
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleCancel}
      accessibilityRole="alert">
      <View style={styles.rootOverlay}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={handleCancel}
            accessibilityRole="button"
            accessibilityLabel="Close exit dialog"
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}>
          {/* Top glowing icon */}
          <View style={styles.iconGlowRing}>
            <View style={styles.iconBadge}>
              <Icon name="exit-outline" size={30} color={colors.yellow} />
            </View>
          </View>

          {/* Title & Description */}
          <Text allowFontScaling={false} style={styles.title}>
            Leave the App?
          </Text>
          <Text allowFontScaling={false} style={styles.description}>
            Do you want to leave the app? You can turn off the flashlight anytime from here.
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <Pressable
              onPress={handleCancel}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.buttonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Cancel and stay in app">
              <Text allowFontScaling={false} style={styles.cancelButtonText}>
                Stay
              </Text>
            </Pressable>

            <Pressable
              onPress={handleExit}
              style={({ pressed }) => [
                styles.exitButton,
                pressed && styles.buttonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Leave and close app">
              <Icon name="log-out-outline" size={18} color={colors.textOnYellow} />
              <Text allowFontScaling={false} style={styles.exitButtonText}>
                Leave
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  rootOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7, 15, 29, 0.78)',
  },

  card: {
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

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.3,
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 6,
  },

  actionsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },

  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.cardDark,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textLight,
  },

  exitButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.yellow,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    elevation: 3,
  },

  exitButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textOnYellow,
  },

  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
