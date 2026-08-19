import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNav } from '../components/BottomNav';
import { TorchButton } from '../components/TorchButton';
import { FlashlightHeader } from '../components/FlashlightHeader';
import { colors } from '@/core/theme';
import { useTorchContext } from '../../../app/providers/AppProviders';
import { MorseScreen } from './MorseScreen';
import { StrobeScreen } from './StrobeScreen';
import { SettingsScreen } from './SettingsScreen';

export const FlashlightScreen = () => {
  const { isOn, mode, toggle, setMode } = useTorchContext();
  const [showSettings, setShowSettings] = useState(false);

  if (showSettings) {
    return <SettingsScreen onBack={() => setShowSettings(false)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlashlightHeader onSettingsPress={() => setShowSettings(true)} />
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
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  status: {
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: 24,
  },
});
