import React, { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { DEFAULT_SETTINGS } from '@/core/constants';
import type { SettingsState } from '../features/flashlight/types/settings.types';

interface SettingsContextValue {
  settings: SettingsState;
  setSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);

  const setSetting = useCallback(
    <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
      setSettings(prev => ({ ...prev, [key]: value }));
    },
    [],
  );

  return (
    <SettingsContext.Provider value={{ settings, setSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextValue => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return ctx;
};
