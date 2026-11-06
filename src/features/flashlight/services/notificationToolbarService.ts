import { NativeModules, Platform } from 'react-native';

const { NotificationToolbarModule } = NativeModules;

export const notificationToolbarService = {
  setToolbarEnabled: async (enabled: boolean): Promise<boolean> => {
    try {
      if (Platform.OS !== 'android' || !NotificationToolbarModule?.setToolbarEnabled) {
        return false;
      }
      return await NotificationToolbarModule.setToolbarEnabled(enabled);
    } catch {
      return false;
    }
  },

  isToolbarEnabled: async (): Promise<boolean> => {
    try {
      if (Platform.OS !== 'android' || !NotificationToolbarModule?.isToolbarEnabled) {
        return false;
      }
      return await NotificationToolbarModule.isToolbarEnabled();
    } catch {
      return false;
    }
  },

  updateToolbar: async (isTorchOn: boolean): Promise<boolean> => {
    try {
      if (Platform.OS !== 'android' || !NotificationToolbarModule?.updateToolbar) {
        return false;
      }
      return await NotificationToolbarModule.updateToolbar(isTorchOn);
    } catch {
      return false;
    }
  },

  checkInitialOpenSettings: async (): Promise<boolean> => {
    try {
      if (Platform.OS !== 'android' || !NotificationToolbarModule?.checkInitialOpenSettings) {
        return false;
      }
      return await NotificationToolbarModule.checkInitialOpenSettings();
    } catch {
      return false;
    }
  },
};
