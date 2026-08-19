export interface SettingsState {
  automaticOn: boolean;
  flashlightStayOn: boolean;
  shakeToSwitch: boolean;
  notificationToolbarToggle: boolean;
  compass: boolean;
  sound: boolean;
  haptic: boolean;
  powerControl: boolean;
  automaticOff: boolean;
  automaticOffTimer: number;
}

export type SettingsKey = keyof SettingsState;

export type SettingsToggleKey = {
  [K in SettingsKey]: SettingsState[K] extends boolean ? K : never;
}[SettingsKey];
