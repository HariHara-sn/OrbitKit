import { useCallback } from 'react';
import { Vibration } from 'react-native';
import { useSettings } from '../../../app/providers/SettingsProvider';

const HAPTIC_DURATION = 30;

export const useHaptic = () => {
  const { settings } = useSettings();

  const trigger = useCallback(() => {
    if (settings.haptic) {
      Vibration.vibrate(HAPTIC_DURATION);
    }
  }, [settings.haptic]);

  return { trigger };
};
