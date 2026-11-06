import React, { useEffect } from 'react';
import {
  AppState,
  BackHandler,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
} from 'react-native';
import { colors } from '@/core/theme';
import { DIM_BRIGHTNESS, MAX_BRIGHTNESS } from '@/core/constants';
import { useTorchContext } from '../../../app/providers/AppProviders';
import { flashlightService } from '../services/flashlightService';

export const WhiteScreen = () => {
  const { turnOff, isDimmed } = useTorchContext();

  useEffect(() => {
    // Lock window brightness to 100% full native foreground brightness (or dimmed by Power Control)
    const targetBrightness = isDimmed ? DIM_BRIGHTNESS : MAX_BRIGHTNESS;
    flashlightService.setBrightness(targetBrightness);

    // Re-apply 100% brightness if app returns from notification drawer or lock screen
    const appStateSub = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        flashlightService.setBrightness(targetBrightness);
      }
    });

    const backSub = BackHandler.addEventListener('hardwareBackPress', () => {
      turnOff();
      return true;
    });

    return () => {
      appStateSub.remove();
      backSub.remove();
      flashlightService.resetBrightness();
    };
  }, [turnOff, isDimmed]);

  return (
    <>
      <StatusBar hidden backgroundColor={colors.white} barStyle="dark-content" />
      <Pressable
        style={styles.screen}
        onPress={turnOff}
        testID="white-screen-surface"
        accessibilityRole="button"
        accessibilityLabel="White screen torch. Tap anywhere to turn off."
      >
        <Text style={styles.hint}>Tap anywhere to turn off</Text>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 48,
  },

  hint: {
    fontSize: 14,
    color: colors.hint,
    backgroundColor: colors.overlay,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
});
