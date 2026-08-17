import { useCallback, useEffect, useState } from 'react';
import {
  MAX_BRIGHTNESS,
  STROBE_DEFAULT_INTERVAL,
} from '../../../core/constants';
import type { FlashlightMode } from '../../../core/constants';
import { flashlightService } from '../services/flashlightService';
import { requestCameraPermission } from '../../../shared/services/permissions/permissionsService';

export const useTorch = () => {
  const [isOn, setIsOn] = useState(false);
  const [mode, setModeState] = useState<FlashlightMode>('torch');
  const [strobeSpeed, setStrobeSpeed] = useState(STROBE_DEFAULT_INTERVAL);

  const turnOff = useCallback(() => {
    flashlightService.setTorchMode(false);
    flashlightService.resetBrightness();
    setIsOn(false);
  }, []);

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
