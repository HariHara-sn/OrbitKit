import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ModeSwitch } from '../components/ModeSwitch';
import { ToggleButton } from '../components/ToggleButton';
import { useTorchContext } from '../context/TorchContext';

export const HomeScreen = () => {
  const { isOn, mode, toggle, setMode } = useTorchContext();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Flashlight</Text>
      <ModeSwitch mode={mode} onModeChange={setMode} />
      <View style={styles.content}>
        <ToggleButton isOn={isOn} onPress={toggle} />
        <Text style={styles.status}>
          {isOn ? 'Flashlight is ON' : 'Tap to turn on'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    paddingTop: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 24,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },

  status: {
    fontSize: 16,
    color: '#94A3B8',
  },
});
