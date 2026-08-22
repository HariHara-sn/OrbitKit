import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { BatteryModule } = NativeModules;

export interface BatteryInfo {
  level: number;
  isCharging: boolean;
}

let emitter: NativeEventEmitter | null = null;

const getEmitter = (): NativeEventEmitter | null => {
  if (Platform.OS !== 'android' || !BatteryModule) {
    return null;
  }
  if (!emitter) {
    emitter = new NativeEventEmitter(BatteryModule);
  }
  return emitter;
};

export const batteryService = {
  getBatteryLevel: async (): Promise<BatteryInfo> => {
    try {
      if (!BatteryModule?.getBatteryLevel) {
        return { level: 1, isCharging: false };
      }
      const result = await BatteryModule.getBatteryLevel();
      return {
        level: typeof result.level === 'number' ? result.level : 1,
        isCharging: !!result.isCharging,
      };
    } catch {
      return { level: 1, isCharging: false };
    }
  },

  onBatteryLevelChanged: (
    callback: (info: BatteryInfo) => void,
  ): (() => void) => {
    const e = getEmitter();
    if (!e) {
      return () => {};
    }
    const sub = e.addListener('batteryLevelChanged', (event: any) => {
      callback({
        level: typeof event.level === 'number' ? event.level : 1,
        isCharging: !!event.isCharging,
      });
    });
    return () => sub.remove();
  },
};
