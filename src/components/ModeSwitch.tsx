import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MODE_LABELS } from '../constants';
import type { FlashlightMode } from '../constants';

interface ModeSwitchProps {
  mode: FlashlightMode;
  onModeChange: (mode: FlashlightMode) => void;
}

const MODES: FlashlightMode[] = ['torch', 'white'];

export const ModeSwitch = ({ mode, onModeChange }: ModeSwitchProps) => (
  <View style={styles.container}>
    {MODES.map(item => {
      const active = item === mode;
      return (
        <Pressable
          key={item}
          onPress={() => onModeChange(item)}
          style={[styles.option, active && styles.optionActive]}
          accessibilityRole="button"
          accessibilityState={{ selected: active }}>
          <Text style={[styles.label, active && styles.labelActive]}>
            {MODE_LABELS[item]}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 4,
  },

  option: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },

  optionActive: {
    backgroundColor: '#FDE047',
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94A3B8',
  },

  labelActive: {
    color: '#713F12',
  },
});
