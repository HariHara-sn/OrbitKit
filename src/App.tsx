import React, { useCallback, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProviders } from './app/providers/AppProviders';
import { SettingsProvider } from './app/providers/SettingsProvider';
import { SplashScreen } from './features/flashlight/screens/SplashScreen';
import { Router } from './router';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashFinish = useCallback(() => {
    setSplashDone(true);
  }, []);

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <AppProviders>
          {!splashDone && <SplashScreen onFinish={handleSplashFinish} />}
          <Router />
        </AppProviders>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
