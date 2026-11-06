import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AUTO_OFF_TIMER_NEVER,
  BATTERY_CUTOFF,
  BATTERY_DIM,
  BATTERY_WARN,
  DIM_BRIGHTNESS,
  MAX_BRIGHTNESS,
  STROBE_DEFAULT_INTERVAL,
} from '../../../core/constants';
import type { FlashlightMode } from '../../../core/constants';
import { flashlightService } from '../services/flashlightService';
import { useBattery } from './useBattery';

export {
  BATTERY_CUTOFF,
  BATTERY_DIM,
  BATTERY_WARN,
  DIM_BRIGHTNESS,
};

export interface UseTorchOptions {
  automaticOff: boolean;
  automaticOffTimer: number;
  powerControl: boolean;
}

export const useTorch = (options?: UseTorchOptions) => {
  const [isOn, setIsOn] = useState(false);
  const [mode, setModeState] = useState<FlashlightMode>('torch');
  const [strobeSpeed, setStrobeSpeed] = useState(STROBE_DEFAULT_INTERVAL);
  const [isDimmed, setIsDimmed] = useState(false);
  const autoOffTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Unified battery hook: monitors level, charging state, event broadcasts and periodic polls
  const battery = useBattery(options?.powerControl ?? false);

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
    setIsDimmed(false);
  }, [clearAutoOffTimer]);

  const turnOn = useCallback(async () => {
    // Cutoff protection at 3% battery
    if (
      options?.powerControl &&
      !battery.isCharging &&
      battery.level <= BATTERY_CUTOFF
    ) {
      return;
    }

    const shouldDim =
      options?.powerControl &&
      !battery.isCharging &&
      battery.level <= BATTERY_DIM;

    if (mode === 'torch' || mode === 'strobe') {
      if (mode === 'torch') {
        const success = await flashlightService.setTorchMode(true);
        if (!success) {
          return;
        }
        if (shouldDim) {
          flashlightService.setBrightness(DIM_BRIGHTNESS);
          setIsDimmed(true);
        }
      }
    } else if (mode === 'white') {
      flashlightService.setBrightness(shouldDim ? DIM_BRIGHTNESS : MAX_BRIGHTNESS);
      setIsDimmed(shouldDim);
    } else {
      return;
    }
    setIsOn(true);
  }, [mode, options?.powerControl, battery]);

  // Strobe effect
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

  // Automatic timer shut-off
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
      setIsDimmed(false);
      autoOffTimerRef.current = null;
    }, options.automaticOffTimer * 1000);

    return () => {
      clearAutoOffTimer();
    };
  }, [isOn, options?.automaticOff, options.automaticOffTimer, clearAutoOffTimer]);

  // Power Control rules:
  // - Cutoff at 3%
  // - Dimming at 5%
  // - Warning below 10%
  useEffect(() => {
    if (!options?.powerControl || battery.isCharging || !isOn) {
      if (isDimmed) {
        setIsDimmed(false);
        if (isOn) {
          flashlightService.resetBrightness();
        }
      }
      return;
    }

    if (battery.level <= BATTERY_CUTOFF) {
      turnOff();
      return;
    }

    if (battery.level <= BATTERY_DIM) {
      if (!isDimmed) {
        setIsDimmed(true);
        flashlightService.setBrightness(DIM_BRIGHTNESS);
      }
    } else if (isDimmed) {
      setIsDimmed(false);
      flashlightService.resetBrightness();
    }
  }, [options?.powerControl, battery, isOn, isDimmed, turnOff]);

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

  const lowBatteryWarning = Boolean(options?.powerControl && !battery.isCharging && battery.level <= BATTERY_WARN);

  const isCutoff =
    Boolean(options?.powerControl && !battery.isCharging && battery.level <= BATTERY_CUTOFF);

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
    isDimmed,
    isCutoff,
  };
};
