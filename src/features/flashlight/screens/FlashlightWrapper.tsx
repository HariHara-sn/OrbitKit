import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, PanResponder, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { BottomNav } from '../components/BottomNav';
import { TorchButton } from '../components/TorchButton';
import { FlashlightHeader } from '../components/FlashlightHeader';
import { colors } from '@/core/theme';
import { ICONS } from '@/core/constants/icons';
import { useTorchContext } from '../../../app/providers/AppProviders';
import { useHaptic } from '../hooks/useHaptic';
import { useSound } from '../hooks/useSound';
import { MorseScreen } from './MorseScreen';
import { StrobeScreen } from './StrobeScreen';
import { SettingsScreen } from './SettingsScreen';
import { ExitAppModal } from '../components/ExitAppModal';
import { flashlightService } from '../services/flashlightService';

const SWIPE_THRESHOLD = 80;

export const FlashlightScreen = () => {
  const { isOn, mode, toggle, setMode, lowBatteryWarning, batteryLevel } = useTorchContext();
  const [showSettings, setShowSettings] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const { trigger: haptic } = useHaptic();
  const { playToggleOn, playToggleOff, playClick } = useSound();
  const swipeHandled = useRef(false);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return (
            Math.abs(gestureState.dx) > 10 &&
            Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.5
          );
        },
        onPanResponderGrant: () => {
          swipeHandled.current = false;
        },
        onPanResponderMove: (_, gestureState) => {
          if (
            !swipeHandled.current &&
            gestureState.dx > SWIPE_THRESHOLD &&
            (mode === 'morse' || mode === 'strobe')
          ) {
            swipeHandled.current = true;
            haptic();
            setMode('torch');
          }
        },
        onPanResponderRelease: () => {
          swipeHandled.current = false;
        },
      }),
    [mode, haptic, setMode],
  );

  // Handle Android hardware back navigation.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showExitModal) {
        setShowExitModal(false);
        return true;
      }
      if (showSettings) {
        setShowSettings(false);
        return true;
      }
      if (mode === 'morse' || mode === 'strobe' || mode === 'white') {
        haptic();
        setMode('torch');
        return true;
      }
      if (mode === 'torch') {
        haptic();
        setShowExitModal(true);
        return true;
      }
      return true;
    });
    return () => sub.remove();
  }, [mode, haptic, setMode, showSettings, showExitModal]);

  const handleConfirmExit = useCallback(() => {
    if (isOn) {
      flashlightService.setTorchMode(false);
    }
    setShowExitModal(false);
    BackHandler.exitApp();
  }, [isOn]);

  const handleToggle = useCallback(() => {
    haptic();
    if (isOn) {
      playToggleOff();
    } else {
      playToggleOn();
    }
    toggle();
  }, [isOn, haptic, playToggleOn, playToggleOff, toggle]);

  const handleSettingsPress = useCallback(() => {
    haptic();
    playClick();
    setShowSettings(true);
  }, [haptic, playClick]);

  if (showSettings) {
    return <SettingsScreen onBack={() => setShowSettings(false)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlashlightHeader onSettingsPress={handleSettingsPress} />
      {lowBatteryWarning && (
        <View style={styles.warningBanner}>
          <Icon name={ICONS.batteryWarning} size={16} color={colors.yellow} />
          <Text style={styles.warningText}>
            Low battery ({Math.round(batteryLevel * 100)}%)
          </Text>
        </View>
      )}
      <View style={styles.content} {...panResponder.panHandlers}>
        {mode === 'torch' && (
          <>
            <Text testID="torch-status-text" style={styles.status}>
              {isOn ? 'Torch is ON' : 'Tap to turn on'}
            </Text>
            <TorchButton testID="torch-toggle-button" isOn={isOn} onPress={handleToggle} />
          </>
        )}

        {mode === 'white' && (
          <>
            <Text style={styles.status}>
              {isOn ? 'White screen is ON' : 'Tap for white screen'}
            </Text>
            <TorchButton isOn={isOn} onPress={handleToggle} />
          </>
        )}

        {mode === 'morse' && <MorseScreen />}
        {mode === 'strobe' && <StrobeScreen />}
      </View>
      <BottomNav mode={mode} onModeChange={setMode} />
      <ExitAppModal
        visible={showExitModal}
        onCancel={() => setShowExitModal(false)}
        onConfirmExit={handleConfirmExit}
      />
    </SafeAreaView>
  );
};

export const HomeScreen = FlashlightScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  status: {
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: 24,
  },

  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.yellow15,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },

  warningText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.yellow,
  },
});
