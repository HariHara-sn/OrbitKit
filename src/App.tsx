import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProviders } from './app/providers/AppProviders';
import { Router } from './router';

export function TorchProvider({ children }: { children: React.ReactNode }) {
  return <AppProviders>{children}</AppProviders>;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProviders>
        <Router />
      </AppProviders>
    </SafeAreaProvider>
  );
}
