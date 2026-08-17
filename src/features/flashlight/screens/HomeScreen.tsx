import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNav } from '../components/BottomNav';
import { ToggleButton } from '../components/ToggleButton';
import { useTorchContext } from '../../../context/TorchContext';
import { MorseScreen } from './MorseScreen';
import { StrobeScreen } from './StrobeScreen';

export const HomeScreen = () => {
  const { isOn, mode, toggle, setMode } = useTorchContext();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Flashlight</Text>
      <View style={styles.content}>
        {mode === 'torch' && (
          <>
            <Text style={styles.status}>
              {isOn ? 'Torch is ON' : 'Tap to turn on'}
            </Text>
            <ToggleButton isOn={isOn} onPress={toggle} />
          </>
        )}

        {mode === 'white' && (
          <>
            <Text style={styles.status}>
              {isOn ? 'White screen is ON' : 'Tap for white screen'}
            </Text>
            <ToggleButton isOn={isOn} onPress={toggle} />
          </>
        )}

        {mode === 'morse' && <MorseScreen />}
        {mode === 'strobe' && <StrobeScreen />}
      </View>
      <BottomNav mode={mode} onModeChange={setMode} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },

  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F8FAFC',
    textAlign: 'center',
    paddingTop: 8,
    paddingBottom: 8,
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
