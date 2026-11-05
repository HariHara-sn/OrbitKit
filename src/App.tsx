import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProviders } from './app/providers/AppProviders';
import { SettingsProvider } from './app/providers/SettingsProvider';
import { Router } from './router';

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <AppProviders>
          <Router />
        </AppProviders>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
