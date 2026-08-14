import React, { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { FlashlightMode } from '../constants';
import { useTorch } from '../hooks/useTorch';

interface TorchContextValue {
  isOn: boolean;
  mode: FlashlightMode;
  isWhiteScreenVisible: boolean;
  toggle: () => Promise<void>;
  turnOff: () => void;
  setMode: (mode: FlashlightMode) => void;
}

const TorchContext = createContext<TorchContextValue | undefined>(undefined);

export const TorchProvider = ({ children }: { children: ReactNode }) => {
  const torch = useTorch();

  const value = useMemo(
    () => ({
      isOn: torch.isOn,
      mode: torch.mode,
      isWhiteScreenVisible: torch.isWhiteScreenVisible,
      toggle: torch.toggle,
      turnOff: torch.turnOff,
      setMode: torch.setMode,
    }),
    [
      torch.isOn,
      torch.mode,
      torch.isWhiteScreenVisible,
      torch.toggle,
      torch.turnOff,
      torch.setMode,
    ],
  );

  return <TorchContext.Provider value={value}>{children}</TorchContext.Provider>;
};

export const useTorchContext = (): TorchContextValue => {
  const ctx = useContext(TorchContext);
  if (!ctx) {
    throw new Error('useTorchContext must be used within a TorchProvider');
  }
  return ctx;
};
