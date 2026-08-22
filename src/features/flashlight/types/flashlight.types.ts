import type { FlashlightMode } from '../../../core/constants';

export interface FlashlightState {
  isOn: boolean;
  mode: FlashlightMode;
  isWhiteScreenVisible: boolean;
  strobeSpeed: number;
}

export interface FlashlightContextValue extends FlashlightState {
  setStrobeSpeed: (speed: number) => void;
  toggle: () => Promise<void>;
  turnOff: () => void;
  setMode: (mode: FlashlightMode) => void;
  batteryLevel: number;
  isCharging: boolean;
  lowBatteryWarning: boolean;
}
