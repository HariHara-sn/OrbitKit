import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNav } from '../components/BottomNav';
import { TorchButton } from '../components/TorchButton';
import { FlashlightHeader } from '../components/FlashlightHeader';
import { useTorchContext } from '../../../app/providers/AppProviders';
import { MorseScreen } from './MorseScreen';
import { StrobeScreen } from './StrobeScreen';

export const FlashlightScreen = () => {
  const { isOn, mode, toggle, setMode } = useTorchContext();

  return (
    <SafeAreaView style={styles.container}>
      <FlashlightHeader />
      <View style={styles.content}>
        {mode === 'torch' && (
          <>
            <Text style={styles.status}>
              {isOn ? 'Torch is ON' : 'Tap to turn on'}
            </Text>
            <TorchButton isOn={isOn} onPress={toggle} />
          </>
        )}

        {mode === 'white' && (
          <>
            <Text style={styles.status}>
              {isOn ? 'White screen is ON' : 'Tap for white screen'}
            </Text>
            <TorchButton isOn={isOn} onPress={toggle} />
          </>
        )}

        {mode === 'morse' && <MorseScreen />}
        {mode === 'strobe' && <StrobeScreen />}
      </View>
      <BottomNav mode={mode} onModeChange={setMode} />
    </SafeAreaView>
  );
};

export const HomeScreen = FlashlightScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  status: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 24,
  },
});

