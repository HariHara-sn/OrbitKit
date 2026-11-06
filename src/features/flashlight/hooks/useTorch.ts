import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
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
import { shakeService } from '../services/shakeService';
import { clapService } from '../services/clapService';
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
  automaticOn?: boolean;
  flashlightStayOn?: boolean;
  shakeToSwitch?: boolean;
  clapToFind?: boolean;
}

export const useTorch = (options?: UseTorchOptions) => {
  const [isOn, setIsOn] = useState(false);
  const [mode, setModeState] = useState<FlashlightMode>('torch');
  const [strobeSpeed, setStrobeSpeed] = useState(STROBE_DEFAULT_INTERVAL);
  const [isDimmed, setIsDimmed] = useState(false);
  const autoOffTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const turnOnTimeRef = useRef<number | null>(null);
  const hasTriggeredAutoOnRef = useRef(false);

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
    flashlightService.cancelAutoOff();
    flashlightService.setTorchMode(false);
    flashlightService.resetBrightness();
    setIsOn(false);
    setIsDimmed(false);
    turnOnTimeRef.current = null;
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
    turnOnTimeRef.current = Date.now();
    setIsOn(true);
  }, [mode, options?.powerControl, battery]);

  // Automatic On: Turn on flashlight on startup when enabled
  useEffect(() => {
    if (hasTriggeredAutoOnRef.current) {
      return;
    }
    if (options?.automaticOn) {
      hasTriggeredAutoOnRef.current = true;
      turnOn();
    }
  }, [options?.automaticOn, turnOn]);

  // Synchronize flashlightStayOn option with native module
  useEffect(() => {
    flashlightService.setFlashlightStayOn(options?.flashlightStayOn ?? false);
  }, [options?.flashlightStayOn]);

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

  // Automatic timer shut-off (runs natively in background + foreground JS fallback)
  useEffect(() => {
    if (
      !isOn ||
      !options?.automaticOff ||
      options.automaticOffTimer === AUTO_OFF_TIMER_NEVER
    ) {
      clearAutoOffTimer();
      flashlightService.cancelAutoOff();
      return;
    }

    clearAutoOffTimer();

    // Schedule native background timer that executes via Android Handler/WakeLock
    // even when the app is in the background or device is locked
    flashlightService.scheduleAutoOff(options.automaticOffTimer);

    // Foreground JS fallback timer
    autoOffTimerRef.current = setTimeout(() => {
      turnOff();
    }, options.automaticOffTimer * 1000);

    return () => {
      clearAutoOffTimer();
    };
  }, [isOn, options?.automaticOff, options?.automaticOffTimer, clearAutoOffTimer, turnOff]);

  // Listen for native background auto-off completion
  useEffect(() => {
    const unsub = flashlightService.onAutoOff(() => {
      turnOff();
    });
    return unsub;
  }, [turnOff]);

  // Synchronize with external/hardware changes (e.g. Android Quick Settings tile, lockscreen gesture)
  useEffect(() => {
    const unsub = flashlightService.onTorchStateChanged(enabled => {
      setModeState(currentMode => {
        if (currentMode === 'torch') {
          setIsOn(currentIsOn => {
            if (currentIsOn !== enabled) {
              if (!enabled) {
                clearAutoOffTimer();
                flashlightService.cancelAutoOff();
                turnOnTimeRef.current = null;
              } else {
                turnOnTimeRef.current = Date.now();
              }
              return enabled;
            }
            return currentIsOn;
          });
        }
        return currentMode;
      });
    });
    return unsub;
  }, [clearAutoOffTimer]);

  // Catch up on auto-off expiration when app is foregrounded from background
  useEffect(() => {
    const sub = AppState.addEventListener('change', nextState => {
      if (nextState === 'active' && isOn) {
        if (
          options?.automaticOff &&
          options.automaticOffTimer !== AUTO_OFF_TIMER_NEVER &&
          turnOnTimeRef.current &&
          Date.now() - turnOnTimeRef.current >= options.automaticOffTimer * 1000
        ) {
          turnOff();
        }
      }
    });
    return () => sub.remove();
  }, [isOn, options?.automaticOff, options?.automaticOffTimer, turnOff]);

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

  // Shake to switch: Shake your phone to turn on/off flashlight
  useEffect(() => {
    if (!options?.shakeToSwitch) {
      shakeService.stopWatching();
      return;
    }

    shakeService.startWatching();
    const unsub = shakeService.onShake(() => {
      toggle();
    });

    return () => {
      unsub();
      shakeService.stopWatching();
    };
  }, [options?.shakeToSwitch, toggle]);

  // Synchronize torch ON/OFF state to ClapModule for 2-claps-on / 1-clap-off
  useEffect(() => {
    clapService.setTorchState(isOn);
  }, [isOn]);

  // Clap to find: 2 claps to turn ON, 1 clap to turn OFF
  useEffect(() => {
    if (!options?.clapToFind) {
      clapService.stopListening();
      return;
    }

    clapService.startListening();
    const unsubTurnOn = clapService.onClapTurnOn(() => {
      turnOn();
    });
    const unsubTurnOff = clapService.onClapTurnOff(() => {
      turnOff();
    });

    return () => {
      unsubTurnOn();
      unsubTurnOff();
      clapService.stopListening();
    };
  }, [options?.clapToFind, turnOn, turnOff]);

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
    Boolean(options?.powerControl && !battery.isCharging && battery.level <= BATTERY_WARN);

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
