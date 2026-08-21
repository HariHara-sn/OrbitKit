import { useCallback } from 'react';
import { useSettings } from '../../../app/providers/SettingsProvider';
import { soundService } from '../services/soundService';

export const useSound = () => {
  const { settings } = useSettings();

  const playToggleOn = useCallback(() => {
    if (settings.sound) {
      soundService.playToggleOn();
    }
  }, [settings.sound]);

  const playToggleOff = useCallback(() => {
    if (settings.sound) {
      soundService.playToggleOff();
    }
  }, [settings.sound]);

  const playClick = useCallback(() => {
    if (settings.sound) {
      soundService.playClick();
    }
  }, [settings.sound]);

  return { playToggleOn, playToggleOff, playClick };
};
