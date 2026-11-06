import React, { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { FlashlightContextValue } from '../../features/flashlight/types/flashlight.types';
import { useTorch } from '../../features/flashlight/hooks/useTorch';
import { SettingsProvider, useSettings } from './SettingsProvider';

const TorchContext = createContext<FlashlightContextValue | undefined>(undefined);

const TorchProvider = ({ children }: { children: ReactNode }) => {
  const { settings } = useSettings();

  const torch = useTorch({
    automaticOff: settings.automaticOff,
    automaticOffTimer: settings.automaticOffTimer,
    powerControl: settings.powerControl,
  });

  const value = useMemo(
    () => ({
      isOn: torch.isOn,
      mode: torch.mode,
      isWhiteScreenVisible: torch.isWhiteScreenVisible,
      strobeSpeed: torch.strobeSpeed,
      setStrobeSpeed: torch.setStrobeSpeed,
      toggle: torch.toggle,
      turnOff: torch.turnOff,
      setMode: torch.setMode,
      batteryLevel: torch.batteryLevel,
      isCharging: torch.isCharging,
      lowBatteryWarning: torch.lowBatteryWarning,
    }),
    [
      torch.isOn,
      torch.mode,
      torch.isWhiteScreenVisible,
      torch.strobeSpeed,
      torch.setStrobeSpeed,
      torch.toggle,
      torch.turnOff,
      torch.setMode,
      torch.batteryLevel,
      torch.isCharging,
      torch.lowBatteryWarning,
    ],
  );

  return <TorchContext.Provider value={value}>{children}</TorchContext.Provider>;
};

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <SettingsProvider>
      <TorchProvider>{children}</TorchProvider>
    </SettingsProvider>
  );
};

export const useTorchContext = (): FlashlightContextValue => {
  const ctx = useContext(TorchContext);
  if (!ctx) {
    throw new Error('useTorchContext must be used within AppProviders');
  }
  return ctx;
};
