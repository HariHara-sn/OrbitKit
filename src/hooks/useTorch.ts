import { useCallback, useEffect, useState } from 'react';
import {
  MAX_BRIGHTNESS,
  STROBE_DEFAULT_INTERVAL,
} from '../constants';
import type { FlashlightMode } from '../constants';
import { FlashlightModule } from '../native/FlashlightModule';
import { requestCameraPermission } from '../utils/permissions';

export const useTorch = () => {
  const [isOn, setIsOn] = useState(false);
  const [mode, setModeState] = useState<FlashlightMode>('torch');
  const [strobeSpeed, setStrobeSpeed] = useState(STROBE_DEFAULT_INTERVAL);

  const turnOff = useCallback(() => {
    FlashlightModule.setTorchMode(false);
    FlashlightModule.resetBrightness();
    setIsOn(false);
  }, []);

  const turnOn = useCallback(async () => {
    if (mode === 'torch' || mode === 'strobe') {
      const granted = await requestCameraPermission();
      if (!granted) {
        return;
      }
      if (mode === 'torch') {
        const success = await FlashlightModule.setTorchMode(true);
        if (!success) {
          return;
        }
      }
    } else if (mode === 'white') {
      FlashlightModule.setBrightness(MAX_BRIGHTNESS);
    } else {
      return;
    }
    setIsOn(true);
  }, [mode]);

  // Drives the strobe blinking: a timer that toggles the torch on/off at the
  // configured interval. Restarts whenever the mode, on-state or speed change.
  useEffect(() => {
    if (!isOn || mode !== 'strobe') {
      return;
    }

    let torchOn = false;
    const flash = () => {
      torchOn = !torchOn;
      FlashlightModule.setTorchMode(torchOn);
    };
    flash();
    const timer = setInterval(flash, strobeSpeed);

    return () => {
      clearInterval(timer);
      FlashlightModule.setTorchMode(false);
    };
  }, [isOn, mode, strobeSpeed]);

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

  return {
    isOn,
    mode,
    isWhiteScreenVisible: isOn && mode === 'white',
    strobeSpeed,
    setStrobeSpeed,
    toggle,
    turnOff,
    setMode,
  };
};
