import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TorchProvider, useTorchContext } from './context/TorchContext';
import { HomeScreen } from './screens/HomeScreen';
import { WhiteScreen } from './screens/WhiteScreen';

const AppContent = () => {
  const { isWhiteScreenVisible } = useTorchContext();
  return isWhiteScreenVisible ? <WhiteScreen /> : <HomeScreen />;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <TorchProvider>
        <AppContent />
      </TorchProvider>
    </SafeAreaProvider>
  );
}
