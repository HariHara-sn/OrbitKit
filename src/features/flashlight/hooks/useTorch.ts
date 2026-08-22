import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AUTO_OFF_TIMER_NEVER,
  MAX_BRIGHTNESS,
  STROBE_DEFAULT_INTERVAL,
} from '../../../core/constants';
import type { FlashlightMode } from '../../../core/constants';
import { flashlightService } from '../services/flashlightService';
import { requestCameraPermission } from '../../../shared/services/permissions/permissionsService';
import { batteryService, type BatteryInfo } from '../services/batteryService';

interface UseTorchOptions {
  automaticOff: boolean;
  automaticOffTimer: number;
  powerControl: boolean;
}

const BATTERY_WARN = 0.10;
const BATTERY_DIM = 0.05;
const BATTERY_CUTOFF = 0.02;

const DIM_BRIGHTNESS = 0.3;

export const useTorch = (options?: UseTorchOptions) => {
  const [isOn, setIsOn] = useState(false);
  const [mode, setModeState] = useState<FlashlightMode>('torch');
  const [strobeSpeed, setStrobeSpeed] = useState(STROBE_DEFAULT_INTERVAL);
  const [battery, setBattery] = useState<BatteryInfo>({ level: 1, isCharging: false });
  const autoOffTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dimmedRef = useRef(false);

  const clearAutoOffTimer = useCallback(() => {
    if (autoOffTimerRef.current !== null) {
      clearTimeout(autoOffTimerRef.current);
      autoOffTimerRef.current = null;
    }
  }, []);

  const turnOff = useCallback(() => {
    clearAutoOffTimer();
    flashlightService.setTorchMode(false);
    flashlightService.resetBrightness();
    setIsOn(false);
    dimmedRef.current = false;
  }, [clearAutoOffTimer]);

  const turnOn = useCallback(async () => {
    if (mode === 'torch' || mode === 'strobe') {
      const granted = await requestCameraPermission();
      if (!granted) {
        return;
      }
      if (mode === 'torch') {
        const success = await flashlightService.setTorchMode(true);
        if (!success) {
          return;
        }
      }
    } else if (mode === 'white') {
      flashlightService.setBrightness(MAX_BRIGHTNESS);
    } else {
      return;
    }
    setIsOn(true);
  }, [mode]);

  useEffect(() => {
    if (!isOn || mode !== 'strobe') {
      return;
    }

    let torchOn = false;
    const flash = () => {
      torchOn = !torchOn;
      flashlightService.setTorchMode(torchOn);
    };
    flash();
    const timer = setInterval(flash, strobeSpeed);

    return () => {
      clearInterval(timer);
      flashlightService.setTorchMode(false);
    };
  }, [isOn, mode, strobeSpeed]);

  useEffect(() => {
    if (
      !isOn ||
      !options?.automaticOff ||
      options.automaticOffTimer === AUTO_OFF_TIMER_NEVER
    ) {
      return;
    }

    clearAutoOffTimer();
    autoOffTimerRef.current = setTimeout(() => {
      flashlightService.setTorchMode(false);
      flashlightService.resetBrightness();
      setIsOn(false);
      autoOffTimerRef.current = null;
    }, options.automaticOffTimer * 1000);

    return () => {
      clearAutoOffTimer();
    };
  }, [isOn, options?.automaticOff, options.automaticOffTimer, clearAutoOffTimer]);

  useEffect(() => {
    if (!options?.powerControl) {
      setBattery({ level: 1, isCharging: false });
      return;
    }

    batteryService.getBatteryLevel().then(setBattery);

    const unsub = batteryService.onBatteryLevelChanged(setBattery);
    return unsub;
  }, [options?.powerControl]);

  useEffect(() => {
    if (!options?.powerControl || battery.isCharging || !isOn) {
      return;
    }

    if (battery.level <= BATTERY_CUTOFF) {
      turnOff();
      return;
    }

    if (battery.level <= BATTERY_DIM && !dimmedRef.current) {
      dimmedRef.current = true;
      flashlightService.setBrightness(DIM_BRIGHTNESS);
    }
  }, [options?.powerControl, battery, isOn, turnOff]);

  const toggle = useCallback(async () => {
    if (isOn) {
      turnOff();
      return;
    }
    await turnOn();
  }, [isOn, turnOff, turnOn]);

  const setMode = useCallback(
    (nextMode: FlashlightMode) => {
      if (nextMode === mode) {
        return;
      }
      turnOff();
      setModeState(nextMode);
    },
    [mode, turnOff],
  );

  const lowBatteryWarning =
    options?.powerControl && !battery.isCharging && battery.level <= BATTERY_WARN;

  return {
    isOn,
    mode,
    isWhiteScreenVisible: isOn && mode === 'white',
    strobeSpeed,
    setStrobeSpeed,
    toggle,
    turnOff,
    setMode,
    batteryLevel: battery.level,
    isCharging: battery.isCharging,
    lowBatteryWarning,
  };
};
