import { useCallback, useEffect, useRef, useState } from 'react';
import { MORSE_DEFAULT_UNIT } from '../constants';
import { FlashlightModule } from '../native/FlashlightModule';
import { requestCameraPermission } from '../utils/permissions';
import type { MorseSignal } from '../utils/morse';

const delay = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

/**
 * Blinks the flashlight following international Morse timing.
 *
 *   DOT            = ON 1 unit, OFF 1 unit
 *   DASH           = ON 3 units, OFF 1 unit
 *   CHARACTER_GAP  = +2 units of OFF (3 total, 1 already provided)
 *   WORD_GAP       = +6 units of OFF (7 total, 1 already provided)
 *
 * Always turns the flashlight OFF when stopped, cancelled or unmounted.
 */
export const useMorseTransmitter = () => {
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [unit, setUnit] = useState(MORSE_DEFAULT_UNIT);
  const runningRef = useRef(false);
  const cancelRef = useRef(false);

  const stop = useCallback(() => {
    cancelRef.current = true;
    FlashlightModule.setTorchMode(false);
    setIsTransmitting(false);
    setActiveIndex(null);
  }, []);

  const start = useCallback(
    async (signals: MorseSignal[]) => {
      if (runningRef.current || signals.length === 0) {
        return;
      }
      const granted = await requestCameraPermission();
      if (!granted) {
        return;
      }

      runningRef.current = true;
      cancelRef.current = false;
      setIsTransmitting(true);

      try {
        for (let i = 0; i < signals.length; i++) {
          if (cancelRef.current) {
            break;
          }
          setActiveIndex(i);
          const signal = signals[i];
          switch (signal) {
            case 'DOT':
              FlashlightModule.setTorchMode(true);
              await delay(unit);
              FlashlightModule.setTorchMode(false);
              await delay(unit);
              break;
            case 'DASH':
              FlashlightModule.setTorchMode(true);
              await delay(unit * 3);
              FlashlightModule.setTorchMode(false);
              await delay(unit);
              break;
            case 'CHARACTER_GAP':
              await delay(unit * 2);
              break;
            case 'WORD_GAP':
              await delay(unit * 6);
              break;
          }
        }
      } finally {
        FlashlightModule.setTorchMode(false);
        runningRef.current = false;
        cancelRef.current = true;
        setIsTransmitting(false);
        setActiveIndex(null);
      }
    },
    [unit],
  );

  // Never leave the torch on if the screen unmounts mid-transmission.
  useEffect(() => {
    return () => {
      cancelRef.current = true;
      FlashlightModule.setTorchMode(false);
    };
  }, []);

  return { isTransmitting, activeIndex, unit, setUnit, start, stop };
};
