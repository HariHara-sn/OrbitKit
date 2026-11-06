import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { DEFAULT_SETTINGS } from '@/core/constants';
import type { SettingsState } from '../features/flashlight/types/settings.types';
import { flashlightService } from '../../features/flashlight/services/flashlightService';

interface SettingsContextValue {
  settings: SettingsState;
  setSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);

  // Restore persisted settings from native SharedPreferences on startup
  useEffect(() => {
    flashlightService.getSetting('app_settings', '').then(savedJson => {
      if (savedJson) {
        try {
          const parsed = JSON.parse(savedJson);
          if (parsed && typeof parsed === 'object') {
            setSettings(prev => ({ ...prev, ...parsed }));
          }
        } catch (_) {}
      }
    });
  }, []);

  const setSetting = useCallback(
    <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
      setSettings(prev => {
        const next = { ...prev, [key]: value };
        flashlightService.setSetting('app_settings', JSON.stringify(next)).catch(() => {});
        return next;
      });
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
