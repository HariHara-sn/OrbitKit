import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

const { ShakeModule } = NativeModules;

let shakeEmitter: NativeEventEmitter | null = null;
const getShakeEmitter = (): NativeEventEmitter | null => {
  if (Platform.OS !== 'android' || !ShakeModule) {
    return null;
  }
  if (!shakeEmitter) {
    shakeEmitter = new NativeEventEmitter(ShakeModule);
  }
  return shakeEmitter;
};

export const shakeService = {
  startWatching: (): void => {
    if (!ShakeModule?.startWatching) {
      return;
    }
    ShakeModule.startWatching();
  },

  stopWatching: (): void => {
    if (!ShakeModule?.stopWatching) {
      return;
    }
    ShakeModule.stopWatching();
  },

  onShake: (callback: () => void): (() => void) => {
    const emitter = getShakeEmitter();
    if (!emitter) {
      return () => {};
    }
    const sub = emitter.addListener('shakeDetected', callback);
    return () => sub.remove();
  },

  simulateShake: (): void => {
    if (!ShakeModule?.simulateShake) {
      return;
    }
    ShakeModule.simulateShake();
  },
};
