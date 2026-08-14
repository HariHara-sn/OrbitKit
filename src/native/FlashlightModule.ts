import { NativeModules } from 'react-native';

export interface TorchNativeModule {
  setTorchMode(enabled: boolean): Promise<void>;
}

export interface BrightnessNativeModule {
  setBrightness(brightness: number): void;
  resetBrightness(): void;
}

const { TorchModule, BrightnessModule } = NativeModules;

/**
 * Typed wrapper around the native torch + brightness modules.
 * Falls back to no-ops when the native module is missing (e.g. in tests).
 */
export const FlashlightModule = {
  setTorchMode: async (enabled: boolean): Promise<boolean> => {
    try {
      if (!TorchModule?.setTorchMode) {
        return false;
      }
      await TorchModule.setTorchMode(enabled);
      return true;
    } catch {
      return false;
    }
  },

  setBrightness: (brightness: number): void => {
    if (!BrightnessModule?.setBrightness) {
      return;
    }
    BrightnessModule.setBrightness(brightness);
  },

  resetBrightness: (): void => {
    if (!BrightnessModule?.resetBrightness) {
      return;
    }
    BrightnessModule.resetBrightness();
  },
};
