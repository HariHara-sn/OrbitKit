import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

export interface TorchNativeModule {
  setTorchMode(enabled: boolean): Promise<void>;
  scheduleAutoOff?(seconds: number): Promise<void>;
  cancelAutoOff?(): void;
  addListener?(eventName: string): void;
  removeListeners?(count: number): void;
}

export interface BrightnessNativeModule {
  setBrightness(brightness: number): void;
  resetBrightness(): void;
}

const { TorchModule, BrightnessModule } = NativeModules;

let torchEmitter: NativeEventEmitter | null = null;
const getTorchEmitter = (): NativeEventEmitter | null => {
  if (Platform.OS !== 'android' || !TorchModule) {
    return null;
  }
  if (!torchEmitter) {
    torchEmitter = new NativeEventEmitter(TorchModule);
  }
  return torchEmitter;
};

/**
 * Typed wrapper around the native torch + brightness modules.
 * Falls back to no-ops when the native module is missing (e.g. in tests).
 */
export const flashlightService = {
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

  scheduleAutoOff: async (seconds: number): Promise<boolean> => {
    try {
      if (!TorchModule?.scheduleAutoOff) {
        return false;
      }
      await TorchModule.scheduleAutoOff(seconds);
      return true;
    } catch {
      return false;
    }
  },

  cancelAutoOff: (): void => {
    if (!TorchModule?.cancelAutoOff) {
      return;
    }
    TorchModule.cancelAutoOff();
  },

  onAutoOff: (callback: () => void): (() => void) => {
    const emitter = getTorchEmitter();
    if (!emitter) {
      return () => {};
    }
    const sub = emitter.addListener('torchAutoOff', callback);
    return () => sub.remove();
  },

  onTorchStateChanged: (callback: (enabled: boolean) => void): (() => void) => {
    const emitter = getTorchEmitter();
    if (!emitter) {
      return () => {};
    }
    const sub = emitter.addListener('torchStateChanged', callback);
    return () => sub.remove();
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

  getSetting: async (key: string, defaultValue: string): Promise<string> => {
    try {
      if (!TorchModule?.getSetting) {
        return defaultValue;
      }
      return await TorchModule.getSetting(key, defaultValue);
    } catch {
      return defaultValue;
    }
  },

  setSetting: async (key: string, value: string): Promise<boolean> => {
    try {
      if (!TorchModule?.setSetting) {
        return false;
      }
      return await TorchModule.setSetting(key, value);
    } catch {
      return false;
    }
  },
};

export const FlashlightModule = flashlightService;
