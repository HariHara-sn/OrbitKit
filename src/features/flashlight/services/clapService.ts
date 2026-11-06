import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

const { ClapModule } = NativeModules;

let clapEmitter: NativeEventEmitter | null = null;
const getClapEmitter = (): NativeEventEmitter | null => {
  if (Platform.OS !== 'android' || !ClapModule) {
    return null;
  }
  if (!clapEmitter) {
    clapEmitter = new NativeEventEmitter(ClapModule);
  }
  return clapEmitter;
};

export const clapService = {
  startListening: async (): Promise<boolean> => {
    try {
      if (!ClapModule?.startListening) {
        return false;
      }
      return await ClapModule.startListening();
    } catch {
      return false;
    }
  },

  stopListening: async (): Promise<boolean> => {
    try {
      if (!ClapModule?.stopListening) {
        return false;
      }
      return await ClapModule.stopListening();
    } catch {
      return false;
    }
  },

  setTorchState: (isOn: boolean): void => {
    if (!ClapModule?.setTorchState) {
      return;
    }
    ClapModule.setTorchState(isOn);
  },

  onClapTurnOn: (callback: () => void): (() => void) => {
    const emitter = getClapEmitter();
    if (!emitter) {
      return () => {};
    }
    const sub = emitter.addListener('clapTurnOn', callback);
    return () => sub.remove();
  },

  onClapTurnOff: (callback: () => void): (() => void) => {
    const emitter = getClapEmitter();
    if (!emitter) {
      return () => {};
    }
    const sub = emitter.addListener('clapTurnOff', callback);
    return () => sub.remove();
  },

  onClap: (callback: () => void): (() => void) => {
    return clapService.onClapTurnOn(callback);
  },

  simulateClap: (): void => {
    if (!ClapModule?.simulateClap) {
      return;
    }
    ClapModule.simulateClap();
  },
};
