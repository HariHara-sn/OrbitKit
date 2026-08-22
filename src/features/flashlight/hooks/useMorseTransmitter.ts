import { useCallback, useEffect, useRef, useState } from 'react';
import { MORSE_DEFAULT_UNIT } from '../../../core/constants';
import { flashlightService } from '../services/flashlightService';
import { requestCameraPermission } from '../../../shared/services/permissions/permissionsService';
import type { MorseSignal } from '../utils/morse';

const delay = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

export const useMorseTransmitter = () => {
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [unit, setUnit] = useState(MORSE_DEFAULT_UNIT);
  const runningRef = useRef(false);
  const cancelRef = useRef(false);

  const stop = useCallback(() => {
    cancelRef.current = true;
    flashlightService.setTorchMode(false);
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
              flashlightService.setTorchMode(true);
              await delay(unit);
              flashlightService.setTorchMode(false);
              await delay(unit);
              break;
            case 'DASH':
              flashlightService.setTorchMode(true);
              await delay(unit * 3);
              flashlightService.setTorchMode(false);
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
        flashlightService.setTorchMode(false);
        runningRef.current = false;
        cancelRef.current = true;
        setIsTransmitting(false);
        setActiveIndex(null);
      }
    },
    [unit],
  );

  useEffect(() => {
    return () => {
      cancelRef.current = true;
      flashlightService.setTorchMode(false);
    };
  }, []);

  return { isTransmitting, activeIndex, unit, setUnit, start, stop };
};
