import { useCallback, useState } from 'react';
import { MAX_BRIGHTNESS } from '../constants';
import type { FlashlightMode } from '../constants';
import { FlashlightModule } from '../native/FlashlightModule';
import { requestCameraPermission } from '../utils/permissions';

export const useTorch = () => {
  const [isOn, setIsOn] = useState(false);
  const [mode, setModeState] = useState<FlashlightMode>('torch');

  const turnOff = useCallback(() => {
    FlashlightModule.setTorchMode(false);
    FlashlightModule.resetBrightness();
    setIsOn(false);
  }, []);

  const turnOn = useCallback(async () => {
    if (mode === 'torch') {
      const granted = await requestCameraPermission();
      if (!granted) {
        return;
      }
      const success = await FlashlightModule.setTorchMode(true);
      if (!success) {
        return;
      }
    } else {
      FlashlightModule.setBrightness(MAX_BRIGHTNESS);
    }
    setIsOn(true);
  }, [mode]);

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
    toggle,
    turnOff,
    setMode,
  };
};
