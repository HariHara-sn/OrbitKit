import { NativeModules } from 'react-native';

const { SoundModule } = NativeModules;

export const soundService = {
  playToggleOn: async (): Promise<boolean> => {
    try {
      if (!SoundModule?.playToggleOn) {
        return false;
      }
      await SoundModule.playToggleOn();
      return true;
    } catch {
      return false;
    }
  },

  playToggleOff: async (): Promise<boolean> => {
    try {
      if (!SoundModule?.playToggleOff) {
        return false;
      }
      await SoundModule.playToggleOff();
      return true;
    } catch {
      return false;
    }
  },

  playClick: async (): Promise<boolean> => {
    try {
      if (!SoundModule?.playClick) {
        return false;
      }
      await SoundModule.playClick();
      return true;
    } catch {
      return false;
    }
  },
};
