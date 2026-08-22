import { useEffect, useRef, useState } from 'react';
import { batteryService, type BatteryInfo } from '../services/batteryService';

const POLL_INTERVAL = 30_000;

export const useBattery = (enabled: boolean) => {
  const [battery, setBattery] = useState<BatteryInfo>({ level: 1, isCharging: false });
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!enabled) {
      setBattery({ level: 1, isCharging: false });
      return;
    }

    batteryService.getBatteryLevel().then(setBattery);

    const unsub = batteryService.onBatteryLevelChanged(setBattery);

    pollRef.current = setInterval(() => {
      batteryService.getBatteryLevel().then(setBattery);
    }, POLL_INTERVAL);

    return () => {
      unsub();
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [enabled]);

  return battery;
};
