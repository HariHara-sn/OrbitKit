import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '@/core/theme';
import { useTorchContext } from '../../../app/providers/AppProviders';

export const WhiteScreen = () => {
  const { turnOff } = useTorchContext();

  return (
    <Pressable style={styles.screen} onPress={turnOff}>
      <Text style={styles.hint}>Tap anywhere to turn off</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 48,
  },

  hint: {
    fontSize: 14,
    color: colors.hint,
    backgroundColor: colors.overlay,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
});
